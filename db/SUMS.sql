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
    Email VARCHAR(100) NOT NULL UNIQUE, -- email (dùng làm username để đăng nhập)
    Password VARCHAR(255) NOT NULL,    -- password (nên lưu dưới dạng Hash như BCrypt)
    RoleId INT NOT NULL,               -- role id (FK)
    IsActive BIT DEFAULT 1,            -- Trạng thái tài khoản (1: Hoạt động, 0: Khóa)

    -- Ràng buộc khóa ngoại nối sang bảng Roles
    CONSTRAINT FK_Accounts_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

INSERT INTO Accounts (Email, Password, RoleId, IsActive)
VALUES 
('admin@tems.com', 'admin_secret', 1, 1),           -- Tài khoản Admin tổng
('resident.tuan@gmail.com', 'tuan_pass', 2, 1),    -- Tài khoản Cư dân mẫu
('staff.building@tems.com', 'apart_pass', 3, 1),   -- Nhân viên quản lý căn hộ
('staff.finance@tems.com', 'service_pass', 4, 1),  -- Nhân viên kế toán/dịch vụ
('staff.guard@tems.com', 'security_pass', 5, 1);    -- Nhân viên an ninh
GO

-- add thêm resident. 
-- Giả định RoleId = 2 là RESIDENT
INSERT INTO Accounts (Email, Password, RoleId, IsActive)
VALUES 
('thao.tran@gmail.com', 'thao_pass123', 2, 1),
('hoang.le@gmail.com', 'hoang_pass456', 2, 1),
('lan.anh@gmail.com', 'lananh_pass789', 2, 1);
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

CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AccountId INT NULL,                  -- account_id (FK: Gửi cho ai? Nếu NULL = Gửi toàn hệ thống)
    Title NVARCHAR(200) NOT NULL,        -- Tiêu đề thông báo
    Content NVARCHAR(MAX) NOT NULL,      -- Nội dung chi tiết
    Type INT DEFAULT 0,                  -- Phân loại: 0: Hệ thống, 1: Hóa đơn, 2: Khiếu nại, 3: Tin tức 
    IsRead BIT DEFAULT 0,                -- Trạng thái: 0: Chưa đọc, 1: Đã đọc
    CreatedAt DATETIME DEFAULT GETDATE(),

    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_Notifications_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts(Id)
);

CREATE TABLE GuestAccessLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- guest_log_id (PK)
    GuestName NVARCHAR(100) NOT NULL,        -- Tên khách đến thăm
    GuestIdentityId VARCHAR(20),             -- Số CMND/CCCD/Hộ chiếu của khách (nếu có)
    PhoneNumber VARCHAR(15),                 -- Số điện thoại khách
    
    ApartmentId INT NOT NULL,                -- apartment_id (FK: Đến thăm căn hộ nào)
    CreatedByAccountId INT NOT NULL,         -- account_id (FK: Nhân viên bảo vệ/Staff nào lập log)
    
    EntryTime DATETIME DEFAULT GETDATE(),    -- Thời điểm vào cổng
    ExitTime DATETIME NULL,                  -- Thời điểm rời đi (để NULL khi mới vào)
    Note NVARCHAR(MAX),                      -- Ghi chú thêm (Vd: Khách đi giao hàng, bạn chủ nhà...)

    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_GuestLogs_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    CONSTRAINT FK_GuestLogs_Accounts FOREIGN KEY (CreatedByAccountId) REFERENCES Accounts(Id)
);