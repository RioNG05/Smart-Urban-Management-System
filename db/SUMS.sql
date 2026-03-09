USE master;
GO

-- 1. Kiểm tra và xóa Database nếu đã tồn tại
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SmartCity_DB')
BEGIN
    -- Force đóng các kết nối đang mở để có thể xóa được DB
    ALTER DATABASE SmartCity_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SmartCity_DB;
END
GO

-- 2. Tạo Database mới
CREATE DATABASE SmartCity_DB;
GO

-- 3. Sử dụng Database vừa tạo
USE SmartCity_DB;
GO

-- bảng 1
CREATE TABLE Permissions (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- Thay cho permission_id
    PermissionCode VARCHAR(50) NOT NULL UNIQUE, -- Mã code để check trong Java (Vd: 'USER_CREATE')
    Description NVARCHAR(255), -- permission description
);

--bảng 2
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- role id
    RoleName NVARCHAR(50) NOT NULL UNIQUE -- role name (Vd: 'ADMIN', 'RESIDENT')
);

INSERT INTO Roles (RoleName) 
VALUES 
(N'ADMIN'),              -- Toàn quyền hệ thống
(N'RESIDENT'),           -- Cư dân (Sử dụng App)
(N'STAFF_APARTMENT'),    -- Nhân viên quản lý căn hộ, hợp đồng
(N'STAFF_SERVICE'),      -- Nhân viên quản lý tiện ích, hóa đơn
(N'STAFF_SECURITY');     -- Nhân viên an ninh, xử lý khiếu nại
(N'USER');               -- Người dùng hiện ko còn là Resident
GO

--bảng 3 
CREATE TABLE Authorities (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- authority id
    RoleId INT NOT NULL,              -- role id (FK)
    PermissionId INT NOT NULL,        -- permission id (FK)
    
    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_Authorities_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id),
    CONSTRAINT FK_Authorities_Permissions FOREIGN KEY (PermissionId) REFERENCES Permissions(Id),
    
    -- Đảm bảo một Role không bị gán trùng một Permission nhiều lần
    CONSTRAINT UQ_Role_Permission UNIQUE (RoleId, PermissionId)
);

-- bảng 4
CREATE TABLE Accounts (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- accountid PK
    Email VARCHAR(100) NOT NULL UNIQUE, -- email 
    Username varchar(50) NOT NULL UNIQUE, -- username
    Password VARCHAR(255) NOT NULL,    -- password (nên lưu dưới dạng Hash như BCrypt)
    RoleId INT NOT NULL,               -- role id (FK)
    IsActive BIT DEFAULT 1,            -- Trạng thái tài khoản (1: Hoạt động, 0: Khóa)

    -- Ràng buộc khóa ngoại nối sang bảng Roles
    CONSTRAINT FK_Accounts_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive)
VALUES 
('admin@tems.com', 'admin', 'admin_secret', 1, 1),           -- Tài khoản Admin tổng
('resident.tuan@gmail.com', 'tuan01', 'tuan_pass', 2, 1),    -- Tài khoản Cư dân mẫu
('staff.building@tems.com', 'buildingstaff', 'apart_pass', 3, 1),   -- Nhân viên quản lý căn hộ
('staff.finance@tems.com', 'financestaff', 'service_pass', 4, 1),  -- Nhân viên kế toán/dịch vụ
('staff.guard@tems.com','guardstaff', 'security_pass', 5, 1);    -- Nhân viên an ninh
GO

-- add thêm resident. 
-- Giả định RoleId = 2 là RESIDENT
INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive)
VALUES 
('thao.tran@gmail.com', 'thao01', 'thao_pass123', 2, 1),
('hoang.le@gmail.com','hoang01', 'hoang_pass456', 2, 1),
('lan.anh@gmail.com','lan01', 'lananh_pass789', 2, 1);
GO

--bảng 5 
CREATE TABLE Residents (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- ResidentId (Auto increment PK)
    FullName NVARCHAR(100) NOT NULL,      -- name
    Gender NVARCHAR(10),                  -- gender (Vd: Male, Female, Other)
    DateOfBirth DATE,                     -- dob
    IdentityId VARCHAR(20) NOT NULL,      -- identity_id (Natural Key - Unique)
    AccountId INT NULL,                   -- Account id (FK, để Nullable nếu cư dân chưa lập acc)

    -- Đảm bảo không trùng số định danh (CCCD/Passport)
    CONSTRAINT UQ_Resident_Identity UNIQUE (IdentityId),
    
    -- Ràng buộc khóa ngoại nối sang bảng Accounts
    CONSTRAINT FK_Residents_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts(Id)
);

-- Chèn dữ liệu cho 4 cư dân tương ứng với các AccountId 2, 6, 7, 8
INSERT INTO Residents (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
(N'Nguyễn Văn Tuấn', N'Male', '1990-05-15', '001090012345', 2),
(N'Trần Thị Thanh Thảo', N'Female', '1995-10-20', '001095098765', 6),
(N'Lê Minh Hoàng', N'Male', '1988-03-12', '001088001122', 7),
(N'Đặng Lan Anh', N'Female', '1997-08-25', '001097005544', 8);
GO

-- 6 compliant 
CREATE TABLE Complaints (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- Compliant_id (PK)
    Content NVARCHAR(MAX) NOT NULL,      -- content
    MadeByUserId INT NOT NULL,           -- made_by_user_id (FK nối tới Accounts)
    CreatedAt DATETIME DEFAULT GETDATE(), -- made_at

    -- Khóa ngoại nối tới bảng Accounts (người tạo khiếu nại)
    CONSTRAINT FK_Complaints_Accounts FOREIGN KEY (MadeByUserId) REFERENCES Accounts(Id)
);
-- 7 reply
CREATE TABLE Replies (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- reply_id (PK)
    Content NVARCHAR(MAX) NOT NULL,      -- content
    ComplaintId INT NOT NULL,            -- reply_to_compliant_id (FK)
    RepliedByUserId INT NOT NULL,        -- reply_by_user_id (FK nối tới Accounts)
    CreatedAt DATETIME DEFAULT GETDATE(), -- reply_at

    -- Khóa ngoại nối tới bảng Complaints (phản hồi cho khiếu nại nào)
    CONSTRAINT FK_Replies_Complaints FOREIGN KEY (ComplaintId) REFERENCES Complaints(Id),

    -- Khóa ngoại nối tới bảng Accounts (ai là người phản hồi)
    CONSTRAINT FK_Replies_Accounts FOREIGN KEY (RepliedByUserId) REFERENCES Accounts(Id)
);

-- 8 news
CREATE TABLE News (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- news_id (PK)
    Title NVARCHAR(255) NOT NULL,        -- title
    Content NVARCHAR(MAX) NOT NULL,      -- content
    ImageUrl VARCHAR(500),               -- img (Lưu đường dẫn/URL ảnh)
    CreatedByUserId INT NOT NULL,        -- create_by (FK nối tới Accounts)
    LastUpdate DATETIME DEFAULT GETDATE(), -- last_update
    
    -- Khóa ngoại nối tới bảng Accounts để biết Admin/Staff nào đăng bài
    CONSTRAINT FK_News_Accounts FOREIGN KEY (CreatedByUserId) REFERENCES Accounts(Id)
);

-- 9 services
CREATE TABLE Services (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- service_id (PK)
    ServiceName NVARCHAR(100) NOT NULL,  -- name
    ServiceCode VARCHAR(50) UNIQUE,      -- e_code (Mã định danh dịch vụ)
    FeePerUnit DECIMAL(18, 2),           -- fee/unit (Giá tiền trên mỗi đơn vị)
    UnitType NVARCHAR(50),               -- fee unit (Vd: "Hour", "Times", "Person")
);

-- 10 service resource
CREATE TABLE ServiceResources (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- service_resource_id (PK)
    ResourceCode VARCHAR(50) UNIQUE,     -- service_resource_code
    Location NVARCHAR(255),              -- location_of_service
    ServiceId INT NOT NULL,              -- service_id (FK)
    IsAvailable BIT DEFAULT 1,           -- Thêm trạng thái để biết có đang bảo trì không

    -- Khóa ngoại nối sang bảng Services
    CONSTRAINT FK_Resources_Services FOREIGN KEY (ServiceId) REFERENCES Services(Id)
);

-- 11 service booking
CREATE TABLE BookingServices (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- booking_service_id
    ResourceId INT NOT NULL,             -- service_resource_id (FK tới ServiceResources)
    AccountId INT NOT NULL,              -- book_by_account (FK tới Accounts)
    BookAt DATETIME DEFAULT GETDATE(),   -- book_at
    BookFrom DATETIME NOT NULL,          -- book_from
    BookTo DATETIME NOT NULL,            -- book_to
    Status INT DEFAULT 0,                -- status (0: Pending, 1: Confirmed, 2: Cancelled)
    TotalAmount DECIMAL(18, 2),          -- Con số chốt tiền cuối cùng

    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_Booking_Resources FOREIGN KEY (ResourceId) REFERENCES ServiceResources(Id),
    CONSTRAINT FK_Booking_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts(Id)
);

-- 12 service invoice 
CREATE TABLE ServiceInvoices (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- Id PK
    ServiceBookingId INT NOT NULL,       -- serviceBookingId (FK tới BookingServices)
    Amount DECIMAL(18, 2) NOT NULL,      -- Số tiền thực tế tại thời điểm xuất hóa đơn
    Status INT DEFAULT 0,                -- status (0: Chưa thanh toán, 1: Đã thanh toán, 2: Hủy)
    PaymentDate DATETIME NULL,           -- Ngày thực tế cư dân trả tiền
    CreatedAt DATETIME DEFAULT GETDATE(), -- Ngày hệ thống xuất hóa đơn này

    -- Ràng buộc khóa ngoại nối sang bảng BookingServices
    CONSTRAINT FK_ServiceInvoices_Booking FOREIGN KEY (ServiceBookingId) REFERENCES BookingServices(Id)
);

-- 13 apartment type 
CREATE TABLE ApartmentTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- apartment_type_id (PK)
    Name NVARCHAR(100) NOT NULL,             -- name (Vd: Căn hộ 2PN - 2WC)
    DesignSqrt DECIMAL(10, 2),               -- design_sqrt (Diện tích thiết kế)
    NumberOfBedroom INT DEFAULT 1,           -- number_of_bedroom
    NumberOfBathroom INT DEFAULT 1,          -- number_of_bathroom
    Overview NVARCHAR(MAX),                  -- overview (Mô tả chi tiết căn hộ)
    CommonPriceForBuying DECIMAL(18, 2),     -- common_price_for_buying (Giá bán tham khảo)
    CommonPriceForRent DECIMAL(18, 2),       -- common_price_for_rent (Giá thuê tham khảo)
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 14 apartment
CREATE TABLE Apartments (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- apartment_id (PK)
    RoomNumber VARCHAR(20) NOT NULL,         -- room_number
    FloorNumber INT NOT NULL,                -- floor_number
    Direction NVARCHAR(50),                  -- hướng
    
    -- Furniture: 0: Không nội thất, 1: Cơ bản, 2: Đầy đủ, 3: Cao cấp
    Furniture INT DEFAULT 0,                 
    
    Status INT DEFAULT 0,                    -- status (0: Trống, 1: Có người)
    SpecificPriceForBuying DECIMAL(18, 2),   
    SpecificPriceForRenting DECIMAL(18, 2),  
    ApartmentTypeId INT NOT NULL,            -- apartment_type_id (FK)

    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_Apartments_Types FOREIGN KEY (ApartmentTypeId) REFERENCES ApartmentTypes(Id)
);

-- 15 apartment utilities invoice
-- cái này lấy luôn cả tiền nhà nếu có nhé, bên back-end check contract (hợp đòng)rồi xem có phải thuê ko, có thì lấy giá tiền trong đấy ra. 
CREATE TABLE UtilitiesInvoices (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- utilities_invoice_id (PK)
    ApartmentId INT NOT NULL,                -- apartment_id (FK)
    BillingMonth INT NOT NULL,               -- month (Tháng chốt số)
    BillingYear INT NOT NULL,                -- year (Năm chốt số)
    
    TotalElectricUsed DECIMAL(10, 2),        -- total_electric_number_used (Số điện tiêu thụ)
    TotalWaterUsed DECIMAL(10, 2),           -- total_m^3_water_used (Số khối nước tiêu thụ)
    
    TotalAmount DECIMAL(18, 2) NOT NULL,     -- total_amount_of_money (Tổng tiền phải trả)
    Status INT DEFAULT 0,                    -- status (0: Chưa thanh toán, 1: Đã thanh toán)
    
    CreatedAt DATETIME DEFAULT GETDATE(),

    -- Ràng buộc khóa ngoại nối sang bảng Apartments
    CONSTRAINT FK_Utilities_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    
    -- Đảm bảo mỗi căn hộ chỉ có 1 hóa đơn duy nhất cho mỗi tháng/năm
    CONSTRAINT UQ_Apartment_Month_Year UNIQUE (ApartmentId, BillingMonth, BillingYear)
);
-- 16 contract
CREATE TABLE Contracts (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- contract_id (PK)
    ApartmentId INT NOT NULL,                -- apartment_id (FK)
    AccountId INT NOT NULL,                  -- account_id (FK - Người đại diện hợp đồng)
    ContractType NVARCHAR(50),               -- contract_type (Vd: "Rent", "Sale")
    StartDate DATE NOT NULL,                 -- start_date
    EndDate DATE NULL,                       -- end_date (Có thể Null nếu là hợp đồng mua đứt)
    MonthlyRent DECIMAL(18, 2),              -- monthly_rent (Giá thuê hàng tháng)
    Status INT DEFAULT 1,                    -- status (1: Hiệu lực, 0: Hết hạn, 2: Thanh lý sớm)
    CreatedAt DATETIME DEFAULT GETDATE(),

    -- Các ràng buộc khóa ngoại
    CONSTRAINT FK_Contracts_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    CONSTRAINT FK_Contracts_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts(Id)
);
-- 17 stay at 
CREATE TABLE StayAtHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- stay_at_id (PK)
    ResidentId INT NOT NULL,             -- Nối tới identity_id của bảng Residents
    ApartmentId INT NOT NULL,            -- apartment_id (FK)
    MoveIn DATE NOT NULL,                -- move_in (Ngày bắt đầu ở)
    MoveOut DATE NULL,                   -- move_out (Ngày chuyển đi, để NULL nếu đang ở)
    
    -- Các ràng buộc khóa ngoại
    CONSTRAINT FK_StayHistory_Residents FOREIGN KEY (ResidentId) REFERENCES Residents(Id),
    CONSTRAINT FK_StayHistory_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id)
);

USE SmartCity_DB;
GO

-- =========================================================================
-- 1. PHÂN QUYỀN (Permissions & Authorities)
-- =========================================================================
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
('USER_READ', N'Xem danh sách người dùng'),
('APARTMENT_MANAGE', N'Quản lý thông tin căn hộ, hợp đồng'),
('SERVICE_MANAGE', N'Quản lý tiện ích và hóa đơn dịch vụ'),
('COMPLAINT_RESOLVE', N'Xử lý khiếu nại an ninh'),
('BOOKING_CREATE', N'Tạo lịch đặt tiện ích (dành cho cư dân)');

-- Gán quyền cho Roles (Dựa theo RoleId đã insert trước đó)
-- 1: ADMIN, 2: RESIDENT, 3: STAFF_APARTMENT, 4: STAFF_SERVICE, 5: STAFF_SECURITY
INSERT INTO Authorities (RoleId, PermissionId)
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Admin có toàn quyền
(2, 1), (2, 5),                         -- Cư dân xem thông tin và book dịch vụ
(3, 1), (3, 2),                         -- Quản lý căn hộ
(4, 1), (4, 3),                         -- Quản lý dịch vụ & tài chính
(5, 1), (5, 4);                         -- Quản lý an ninh

-- =========================================================================
-- 2. HẠ TẦNG (ApartmentTypes & Apartments)
-- =========================================================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent)
VALUES 
(N'Căn hộ Studio', 35.5, 1, 1, N'Phù hợp người độc thân, thiết kế mở.', 1500000000, 6000000),
(N'Căn hộ 2PN - 2WC', 70.0, 2, 2, N'Căn hộ tiêu chuẩn cho gia đình nhỏ, ban công thoáng.', 3000000000, 12000000),
(N'Căn hộ 3PN - 2WC (Góc)', 95.5, 3, 2, N'Căn góc 2 mặt thoáng, view đẹp.', 4500000000, 18000000);

-- Thêm các căn hộ thực tế (Status: 1 là có người, 0 là trống)
INSERT INTO Apartments (RoomNumber, FloorNumber, Direction, Furniture, Status, SpecificPriceForBuying, SpecificPriceForRenting, ApartmentTypeId)
VALUES 
('S1.05.01', 5, N'Đông Nam', 2, 1, NULL, 6000000, 1),      -- Đang cho thuê (Account 2)
('S1.05.02', 5, N'Tây Bắc', 3, 1, 3100000000, NULL, 2),    -- Đã bán đứt (Account 6)
('S1.10.05', 10, N'Đông Bắc', 1, 1, NULL, 11500000, 2),    -- Đang cho thuê (Account 7)
('S1.12.08', 12, N'Nam', 0, 0, 4400000000, 17000000, 3);   -- Đang trống, chưa ai ở

-- =========================================================================
-- 3. CƯ DÂN (Contracts & StayAtHistory)
-- =========================================================================
-- Hợp đồng cho các căn hộ có người ở
-- AccountId: 2 (Tuấn), 6 (Thảo), 7 (Hoàng)
INSERT INTO Contracts (ApartmentId, AccountId, ContractType, StartDate, EndDate, MonthlyRent, Status)
VALUES 
(1, 2, N'Rent', '2023-01-01', '2025-01-01', 6000000, 1),  -- Tuấn thuê căn Studio
(2, 6, N'Sale', '2022-05-15', NULL, NULL, 1),             -- Thảo mua đứt căn 2PN
(3, 7, N'Rent', '2024-02-01', '2025-02-01', 11500000, 1); -- Hoàng thuê căn 2PN

-- Lịch sử cư trú (ResidentId tương ứng 1, 2, 3)
INSERT INTO StayAtHistory (ResidentId, ApartmentId, MoveIn, MoveOut)
VALUES 
(1, 1, '2023-01-05', NULL), -- Tuấn chuyển vào ở S1.05.01
(2, 2, '2022-06-01', NULL), -- Thảo chuyển vào ở S1.05.02
(3, 3, '2024-02-05', NULL); -- Hoàng chuyển vào ở S1.10.05

-- =========================================================================
-- 4. TÀI CHÍNH CĂN HỘ (UtilitiesInvoices)
-- =========================================================================
-- Hóa đơn điện nước tháng 2/2024. Tiền điện: 3.500đ/kwh, Nước: 15.000đ/khối
INSERT INTO UtilitiesInvoices (ApartmentId, BillingMonth, BillingYear, TotalElectricUsed, TotalWaterUsed, TotalAmount, Status)
VALUES 
(1, 2, 2024, 150.5, 8.0, 6646750, 1), -- (150.5 * 3500) + (8 * 15000) + Tiền thuê nhà (6.000.000) = 6.646.750. Đã thanh toán
(2, 2, 2024, 320.0, 15.5, 1352500, 0),-- (320 * 3500) + (15.5 * 15000) = 1.352.500 (Không cộng tiền thuê vì mua đứt). Chưa thanh toán
(3, 2, 2024, 210.0, 12.0, 12415000, 0);-- (210 * 3500) + (12 * 15000) + Tiền thuê nhà (11.500.000) = 12.415.000. Chưa thanh toán

-- =========================================================================
-- 5. TIỆN ÍCH DỊCH VỤ (Services, Resources, Bookings & Invoices)
-- =========================================================================
INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType)
VALUES 
(N'Bếp nướng BBQ', 'BBQ', 200000.00, N'Turn'),
(N'Sân Tennis', 'TENNIS', 150000.00, N'Hour'),
(N'Phòng Gym', 'GYM', 500000.00, N'Month');

INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable)
VALUES 
('BBQ-Z1-01', N'Khu BBQ Hồ Trung Tâm - Lò 01', 1, 1),
('BBQ-Z1-02', N'Khu BBQ Hồ Trung Tâm - Lò 02', 1, 1),
('TEN-A', N'Sân Tennis Thể thao A', 2, 1),
('GYM-S1', N'Phòng Gym Tầng 2 tòa S1', 3, 1);

-- Đặt dịch vụ (Account 2 - Tuấn đặt BBQ, Account 6 - Thảo đặt Tennis)
INSERT INTO BookingServices (ResourceId, AccountId, BookFrom, BookTo, Status, TotalAmount)
VALUES 
(1, 2, '2024-03-10 17:00:00', '2024-03-10 20:00:00', 1, 200000.00), -- Tuấn đặt 1 lượt BBQ
(3, 6, '2024-03-11 06:00:00', '2024-03-11 08:00:00', 1, 300000.00); -- Thảo đặt 2 giờ Tennis (2 * 150k)

-- Xuất hóa đơn cho dịch vụ vừa đặt
INSERT INTO ServiceInvoices (ServiceBookingId, Amount, Status, PaymentDate)
VALUES 
(1, 200000.00, 1, '2024-03-08 10:00:00'), -- Tuấn đã trả tiền trước
(2, 300000.00, 0, NULL);                   -- Thảo chưa trả tiền

-- =========================================================================
-- 6. GIAO TIẾP (News, Complaints & Replies)
-- =========================================================================
-- Tin tức (Tạo bởi Admin - Account 1)
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES 
(N'Thông báo bảo trì thang máy tòa S1', N'Ban quản lý xin thông báo, ngày 15/03/2024 sẽ tiến hành bảo trì thang máy số 2 tòa S1 từ 00h00 đến 04h00 sáng. Xin lỗi quý cư dân vì sự bất tiện này.', 'https://dummyimage.com/600x400/000/fff&text=Maintenance', 1),
(N'Lễ hội ẩm thực cuối tuần', N'Kính mời toàn thể cư dân tham gia lễ hội ẩm thực tại khu vực nướng BBQ vào cuối tuần này.', 'https://dummyimage.com/600x400/000/fff&text=Event', 1);

-- Khiếu nại (Tạo bởi cư dân)
INSERT INTO Complaints (Content, MadeByUserId)
VALUES 
(N'Căn hộ tầng trên thường xuyên hát karaoke sau 10h đêm gây ồn ào.', 2), -- Tuấn complain
(N'Bóng đèn hành lang tầng 5 bị cháy, đề nghị ban quản lý thay thế.', 6);   -- Thảo complain

-- Phản hồi khiếu nại (Bởi Staff_Security - Account 5)
INSERT INTO Replies (Content, ComplaintId, RepliedByUserId)
VALUES 
(N'Ban an ninh đã ghi nhận sự việc và sẽ cử bảo vệ lên nhắc nhở căn hộ tầng trên. Cảm ơn anh Tuấn đã báo cáo.', 1, 5),
(N'Bộ phận kỹ thuật đã nhận được yêu cầu và sẽ tiến hành thay bóng đèn trong ngày hôm nay.', 2, 5);
GO