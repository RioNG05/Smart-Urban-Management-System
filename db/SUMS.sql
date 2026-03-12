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
-- định chuyển sang URL luôn để bên back-end check mỗi khi có người truy cập ? - thay vì cần thêm 1 cái trung gian Để xác định cho mỗi URL 
-- ví dụ URL là /api/create/invoice thì thay vì chuyển từ URL rồi lại check code trong DB bằng Join. nói chung là cũng cũng. 
-- đại khái là đỡ bước 
-- vì permission code và URL là 1-1 nên mapping luôn. cái này sẽ đỡ giúp 1 đoạn từ chuyển đổi URL sang permission Code -> permission id
-- sang thành URL code -> permission Id
CREATE TABLE Permissions (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- Thay cho permission_id
    APIPath VARCHAR(50) NOT NULL UNIQUE, -- xem cụ thể trong change 04.
    Description NVARCHAR(255) -- permission description
);

--bảng 2
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- role id
    RoleName NVARCHAR(50) NOT NULL UNIQUE, -- role name (Vd: 'ADMIN', 'RESIDENT')
	ContextPath NVARCHAR(20) NOT NULL UNIQUE -- context path của url khi đi tìm endpoint.
);

-- Chèn dữ liệu cho bảng Roles (Bao gồm RoleName và ContextPath)
INSERT INTO Roles (RoleName, ContextPath)
VALUES 
(N'ADMIN'),              -- Toàn quyền hệ thống
(N'RESIDENT'),           -- Cư dân (Sử dụng App)
(N'STAFF_APARTMENT'),    -- Nhân viên quản lý căn hộ, hợp đồng
(N'STAFF_SERVICE'),      -- Nhân viên quản lý tiện ích, hóa đơn
(N'STAFF_SECURITY'),      -- Nhân viên an ninh, xử lý khiếu nại
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

-- Chèn 4 khiếu nại cho các Account ID: 2, 6, 7, 8
INSERT INTO Complaints (Content, MadeByUserId, CreatedAt)
VALUES 
(N'Căn hộ tầng trên thường xuyên gây tiếng ồn lớn sau 11 giờ đêm, ảnh hưởng đến việc nghỉ ngơi.', 2, GETDATE()),

(N'Khu vực hành lang tầng 7 chưa được dọn dẹp vệ sinh sạch sẽ trong 2 ngày qua.', 6, GETDATE()),

(N'Thang máy tòa B có hiện tượng rung lắc mạnh khi di chuyển giữa tầng 10 và 15, cần kiểm tra kỹ thuật.', 7, GETDATE()),

(N'Hệ thống đèn chiếu sáng tại khu vực bãi đỗ xe máy dưới hầm bị hỏng, gây khó khăn khi di chuyển vào buổi tối.', 8, GETDATE());
GO

-- 7 reply
-- note: appartment staff lm cái naỳ
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
INSERT INTO Replies (Content, ComplaintId, RepliedByUserId, CreatedAt)
VALUES 
(N'Ban quản lý đã ghi nhận và sẽ làm việc trực tiếp với chủ căn hộ tầng trên về vấn đề tiếng ồn. Rất xin lỗi vì sự bất tiện này.', 1, 3, GETDATE()),

(N'Đã chuyển thông tin tới đội vệ sinh để kiểm tra và xử lý ngay lập tức tại hành lang tầng 7. Cảm ơn cư dân đã phản hồi.', 2, 3, GETDATE()),

(N'Kỹ thuật viên thang máy đã được điều động để kiểm tra hệ thống cáp và bộ giảm chấn của tòa B trong sáng nay.', 3, 3, GETDATE()),

(N'Bộ phận bảo trì đã tiếp nhận thông tin và sẽ tiến hành thay thế các bóng đèn hỏng tại khu vực hầm gửi xe trong ngày hôm nay.', 4, 3, GETDATE());
GO

-- 8 news
-- note: only add by admin
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

INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES 
(N'Thông báo bảo trì thang máy tòa S1', 
N'Ban quản lý xin thông báo, ngày 15/03/2024 sẽ tiến hành bảo trì thang máy số 2 tòa S1 từ 00h00 đến 04h00 sáng. Xin lỗi quý cư dân vì sự bất tiện này.',
'https://piconorm.vn/wp-content/uploads/2020/10/Th%E1%BA%AFng-Ph%C3%BAc-ng%E1%BB%93i-n%C3%B3c-%C4%91i-thang-l%C3%AAn.MP4.16_53_38_09.Still002.jpg', 1),

(N'Lễ hội ẩm thực cuối tuần', 
N'Kính mời toàn thể cư dân tham gia lễ hội ẩm thực tại khu vực nướng BBQ vào cuối tuần này.', 
'https://nld.mediacdn.vn/291774122806476800/2022/8/25/le-hoi-am-thuc-anh-hoang-trieu22-16614300460151286487996.jpg', 1),

(N'Kế hoạch phun thuốc diệt côn trùng định kỳ',
N'Vào sáng thứ Bảy tuần này (14/03/2026), ban quản lý sẽ tiến hành phun thuốc diệt côn trùng tại các khu vực hành lang, tầng hầm và khuôn viên chung. Cư dân vui lòng đóng kín cửa sổ và hạn chế ra ngoài trong thời gian trên.', 
 'https://th.bing.com/th/id/R.8ce64a608b9ddfba419f579b41972c42?rik=cqTsV6Eq4cFSYg&pid=ImgRaw&r=0', 1),

(N'Nâng cấp hệ thống chiếu sáng tầng hầm B1', 
 N'Hệ thống đèn LED cảm biến mới sẽ được lắp đặt tại tầng hầm B1 từ ngày 16/03 đến 18/03. Việc thi công sẽ không làm ảnh hưởng đến khu vực đỗ xe, tuy nhiên quý cư dân lưu ý di chuyển cẩn thận qua các khu vực có biển báo.', 
 'https://th.bing.com/th/id/R.fcbdd54c679a0511fa44735e3728ff91?rik=FuErExljl0HfuA&pid=ImgRaw&r=0', 1);
GO

-- 9 services
CREATE TABLE Services (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- service_id (PK)
    ServiceName NVARCHAR(100) NOT NULL,  -- name
    ServiceCode VARCHAR(50) UNIQUE,      -- e_code (Mã định danh dịch vụ)
    FeePerUnit DECIMAL(18, 2),           -- fee/unit (Giá tiền trên mỗi đơn vị)
    UnitType NVARCHAR(50),               -- fee unit (Vd: "Hour", "Times", "Person")
	Description NVARCHAR(MAX)            -- Thêm trường mô tả chi tiết
);

INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType, Description)
VALUES 
-- 1. Dịch vụ thiết yếu (Tính theo chỉ số hàng tháng)
(N'Điện sinh hoạt', 'ELEC_01', 2500.00, 'kWh', N'Hóa đơn điện tiêu thụ hàng tháng dựa trên chỉ số công tơ thực tế.'),
(N'Nước sinh hoạt', 'WAT_01', 15000.00, 'm3', N'Hóa đơn nước tiêu thụ hàng tháng tính theo khối lượng sử dụng.'),

-- 2. Dịch vụ tiện ích (Cần đặt trước và check quyền cư dân)
(N'Bếp nướng BBQ', 'BBQ', 200000.00, N'Turn', N'Thuê khu vực nướng ngoài trời (tối đa 4 giờ). Bao gồm dụng cụ nướng và hỗ trợ nhóm than.'),
(N'Sân Tennis', 'TENNIS', 150000.00, N'Hour', N'Thuê sân Tennis tiêu chuẩn. Giá đã bao gồm hệ thống chiếu sáng ban đêm.'),
(N'Phòng Gym', 'GYM', 500000.00, N'Month', N'Thẻ hội viên Gym trọn gói trong tháng. Sử dụng không giới hạn thiết bị và phòng xông hơi.'),

-- 3. Dịch vụ cộng thêm khác (Ví dụ thêm cho phong phú)
(N'Vé bể bơi lượt', 'SWIM_01', 30000.00, N'Person', N'Vé lượt sử dụng hồ bơi tầng 5, chỉ áp dụng cho cư dân chính thức.');
GO

INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType, Description)
VALUES 
(N'Phí quản lý tòa nhà (Tháng)', 'MNG_FEE_MONTH', 500000.00, N'Tháng', N'Phí quản lý định kỳ hàng tháng, áp dụng đồng mức cho các căn hộ cùng phân khu.');
GO

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

-- trong nay có vài cái book được và vài cái không nhé, 
-- vd: bookable: bbq, tenis
-- ko cần book/ko book được: bể bơi và gym.
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable)
VALUES 
-- 1. Tài nguyên cho Bếp nướng BBQ (Có 3 khu vực nướng riêng biệt)
('BBQ_ZONE_A', N'Khu vực sân vườn phía Tây - Trạm A', 3, 1),
('BBQ_ZONE_B', N'Khu vực sân vườn phía Tây - Trạm B', 3, 1),
('BBQ_ZONE_C', N'Khu vực sân vườn phía Tây - Trạm C', 3, 1),

-- 2. Tài nguyên cho Sân Tennis (Có 2 sân)
('TENNIS_COURT_01', N'Tầng thượng Tòa A', 4, 1),
('TENNIS_COURT_02', N'Tầng thượng Tòa A', 4, 1),

-- 3. Tài nguyên cho Phòng Gym (Phân theo khu vực tập)
('GYM_MAIN_AREA', N'Tầng 2 - Tòa B', 5, 1),

-- 4. Tài nguyên cho Vé bể bơi (Chia làm 2 bể như bồ yêu cầu)
('POOL_ADULT', N'Bể bơi vô cực - Tầng 5 (Dành cho người lớn)', 6, 1),
('POOL_KID', N'Bể bơi trẻ em - Tầng G (Khu vui chơi)', 6, 1);
GO


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
    CreatedAt DATETIME DEFAULT GETDATE(),
	Furniture INT DEFAULT 0                 -- Furniture: 0: Không nội thất, 1: Cơ bản, 2: Đầy đủ, 3: Cao cấp  
);

-- Chèn dữ liệu mẫu cho 4 loại căn hộ kèm theo thông tin nội thất (Furniture)
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, Furniture)
VALUES 
-- 1. Căn hộ Studio - Nội thất Cơ bản (1)
(N'Căn hộ Studio - The Sakura', 32.50, 1, 1, 
N'Thiết kế tối ưu công năng trên một mặt sàn, không gian mở hoàn toàn giữa phòng ngủ và phòng khách. Phù hợp cho người độc thân hoặc chuyên gia nước ngoài.', 
2500000000, 10000000, 1),

-- 2. Căn hộ 1 Phòng Ngủ - Không nội thất (0)
(N'Căn hộ 1 Phòng Ngủ - The Sakura', 54.80, 1, 1, 
N'Phân khu The Sakura là thành quả hợp tác giữa Samty (Nhật Bản) và Vinhomes. Căn hộ 1PN mang phong cách tối giản nhưng tinh tế, tối ưu hóa ánh sáng tự nhiên.', 
3800000000, 15000000, 0),

-- 3. Căn hộ 2 Phòng Ngủ - Đầy đủ nội thất (2)
(N'Căn hộ 2 Phòng Ngủ - 2WC Premium', 75.00, 2, 2, 
N'Lựa chọn lý tưởng cho gia đình trẻ. Căn hộ gồm 2 phòng ngủ riêng biệt, phòng khách rộng rãi và ban công thoáng đãng, tận hưởng trọn vẹn tiện ích nội khu.', 
5200000000, 22000000, 2),

-- 4. Căn hộ 3 Phòng Ngủ - Nội thất Cao cấp (3)
(N'Căn hộ 3 Phòng Ngủ - Family Suite', 105.20, 3, 2, 
N'Căn góc với tầm nhìn panorama đẳng cấp. Diện tích lớn phù hợp cho gia đình nhiều thế hệ, mang lại không gian sống sang trọng và đầy đủ tiện nghi.', 
8500000000, 35000000, 3);
GO

-- tách ra và thêm bảng chỗ furniture. 
CREATE TABLE Apartments (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- apartment_id (PK)
    RoomNumber INT NOT NULL,                 -- room_number
    FloorNumber INT NOT NULL,                -- floor_number
    Direction NVARCHAR(50),                  -- hướng
    Status INT DEFAULT 0,                    -- status (0: Trống, 1: Có người)
    ApartmentTypeId INT NOT NULL,            -- apartment_type_id (FK)

    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_Apartments_Types FOREIGN KEY (ApartmentTypeId) REFERENCES ApartmentTypes(Id)
);



-- 15 apartment utilities invoice
-- cái này lấy luôn cả tiền nhà nếu có nhé - lấy ở chỗ contract ý. 
-- bên back-end check contract (hợp đòng)rồi xem có phải thuê ko, có thì lấy giá tiền trong đấy ra. 
-- gồm tiền điện, nước   tiền thuê nhà/tháng   tiền quản lý (dịch v).
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

-- 18 staff information. 
--lưu mấy cái giống hệt Resident để cho admin quản lý nhân sự. 
CREATE TABLE StaffInfo (
    Id INT IDENTITY(1,1) PRIMARY KEY,     -- staff_id (PK)
    FullName NVARCHAR(255) NOT NULL,      -- Họ và tên nhân viên
    Gender NVARCHAR(10),                  -- Giới tính
    DateOfBirth DATE,                     -- Ngày sinh
    IdentityId VARCHAR(20) UNIQUE,        -- Số CCCD/CMND (Duy nhất)
    AccountId INT NOT NULL,               -- FK nối tới bảng Accounts

    -- Khóa ngoại đảm bảo nhân viên phải có tài khoản trong hệ thống
    CONSTRAINT FK_Staff_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts(Id)
);


-- 19 visitor logs
-- Note: Chức năng này chỉ dành cho Security (Bảo vệ) thực hiện
CREATE TABLE VisitorLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,       -- visitor_log_id (PK)
    VisitorName NVARCHAR(255) NOT NULL,     -- Tên người vào
    PhoneNumber VARCHAR(20) NOT NULL,       -- SĐT người vào
    ApartmentId INT NOT NULL,               -- ID phòng khách ghé thăm (FK)
    CreatedByStaffId INT NOT NULL,          -- ID bảo vệ thực hiện check-in (FK nối tới StaffInfo)
    CheckInTime DATETIME DEFAULT GETDATE(), -- Thời điểm vào
    Note NVARCHAR(MAX),                     -- Ghi chú thêm (Vd: Mang theo đồ cồng kềnh)

    -- Khóa ngoại nối tới bảng căn hộ
    CONSTRAINT FK_Visitor_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    -- Khóa ngoại nối tới bảng nhân viên (để biết bảo vệ nào check-in)
    CONSTRAINT FK_Visitor_Staff FOREIGN KEY (CreatedByStaffId) REFERENCES StaffInfo(Id)
);

