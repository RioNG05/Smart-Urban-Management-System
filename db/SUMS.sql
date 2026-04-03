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
    PermissionCode VARCHAR(50) NOT NULL UNIQUE, -- xem cụ thể trong change 04.
    Description NVARCHAR(255) -- permission description
);

-- Table 1 Permission
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Permissions_C_01', N'Create New Permission Definition'),
    (N'Permissions_R_01', N'View All Permission Definitions'),
    (N'Permissions_R_02', N'View My Permissions List'),
    (N'Permissions_U_01', N'Update Existing Permission Information'),
    (N'Permissions_D_01', N'Delete Permission Definition');
GO

-- Table 2 Roles
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Roles_C_01', N'Create a new Role'),
    (N'Roles_R_01', N'View all Roles in database'),
    (N'Roles_R_02', N'View my Role Infor'),
    (N'Roles_U_01', N'Update Role Infor'),
    (N'Roles_D_01', N'Delete Role');
GO

-- Table 3 Authorities
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
	(N'Authorities_C_01', N'Assign Permission to Role'),
	(N'Authorities_R_01', N'View All Role-Permission Mapping'),
    (N'Authorities_U_01', N'Update Authorities'),
	(N'Authorities_D_01', N'Remove Permission from Role');
GO

-- Permission liên quan đến Bảng 4 Account
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Account_C_01', N'Create a new Account'),
    (N'Account_R_01', N'View All Account Information'),
    (N'Account_R_02', N'View My Account Information'),
    (N'Account_U_01', N'Update Any Account Information'),
    (N'Account_U_02', N'Update My Account Information'),
    (N'Account_U_03', N'Update User Role'),
    (N'Account_D_01', N'Delete A account');
GO

-- Permission liên quan đến Bảng 5 Resident 
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Resident_C_01', N'Create a new Resident'),
    (N'Resident_R_01', N'View All Resident'),
    (N'Resident_R_02', N'View My Resident Information'),
    (N'Resident_U_01', N'Update Any Resident Information'),
    (N'Resident_U_02', N'Update My Resident Information'),
    (N'Resident_D_01', N'Delete Resident');
GO

-- Permission liên quan đến bảng 6: Complaints
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Complaints_C_01', N'Create/report a complaints'),
    (N'Complaints_R_01', N'View All Complaints in database'),
    (N'Complaints_R_02', N'View My Complaints'),
    (N'Complaints_U_02', N'Update My Complaint'),
    (N'Complaints_D_01', N'Delete My Complaint'),
    (N'Complaints_D_02', N'Auto Delete Old & answered Complaints');
GO

-- Permission liên quan đến bảng 7: Replies 
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Replies_C_01', N'Create a Replies'),
    (N'Replies_R_01', N'View All Replies In database'),
    (N'Replies_R_02', N'View Replies send to me'),
    (N'Replies_U_01', N'Update any Replies'),
    (N'Replies_D_01', N'Delete Replies');
GO

-- Permission liên quan đến bảng 8: News
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'News_C_01', N'Create News'),
    (N'News_R_01', N'View All News'),
    (N'News_U_01', N'Update Any News'),
    (N'News_D_01', N'Delete News');
GO

-- Permission liên quan đến bảng 9: Services
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Services_C_01', N'Create New Service'),
    (N'Services_R_01', N'View All service'),
    (N'Services_U_01', N'Update Service'),
    (N'Services_D_01', N'Delete Service');
GO

-- Permission liên quan đến bảng 10: ServiceResources
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'ServiceResources_C_01', N'Create New ServiceResource'),
    (N'ServiceResources_R_01', N'View all Service resource/location'),
    (N'ServiceResources_U_01', N'Update ServiceResource'),
    (N'ServiceResources_D_01', N'Delete ServiceResource');
GO

-- Permission liên quan đến bảng 11: BookingServices
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'BookingServices_C_01', N'Booking a service'),
    (N'BookingServices_R_01', N'View All Booking Service'),
    (N'BookingServices_R_02', N'View My Booking Service'),
    (N'BookingServices_U_01', N'Update My Booking'),
    (N'BookingServices_U_02', N'Update Booking Request include Accept/Reject Booking Request'),
    (N'BookingServices_D_01', N'Delete Booking Request');
GO

-- Permission liên quan đến bảng 12: ServiceInvoices
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'ServiceInvoices_C_01', N'Create Invoice Manually'),
    (N'ServiceInvoices_R_01', N'View All Invoice'),
    (N'ServiceInvoices_R_02', N'View My Invoice'),
    (N'ServiceInvoices_U_01', N'Update any Invoice'),
    (N'ServiceInvoices_U_02', N'PayInvoice <=> Change Invoice Status'),
    (N'ServiceInvoices_D_01', N'Delete Invoice');
GO

-- Permission liên quan đến bảng 13: ApartmentTypes
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'ApartmentTypes_C_01', N'Create Apartment Type'),
    (N'ApartmentTypes_R_01', N'View All Apartment Type'),
    (N'ApartmentTypes_U_01', N'Update Apartment Type'),
    (N'ApartmentTypes_D_01', N'Delete Apartment Type');
GO

-- Permission liên quan đến bảng 14: Apartments
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Apartments_C_01', N'Create Apartment'),
    (N'Apartments_R_01', N'View All Apartment Information'),
    (N'Apartments_R_02', N'View An Apartment able to Buy/Rent'),
    (N'Apartments_R_03', N'View My Apartment Information'),
    (N'Apartments_U_01', N'Update Apartment'),
    (N'Apartments_D_01', N'Delete Apartment');
GO

-- Permission liên quan đến bảng 15: UtilitiesInvoices
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'UtilitiesInvoices_C_01', N'Create Utilities Invoice'),
    (N'UtilitiesInvoices_R_01', N'View All Invoice'),
    (N'UtilitiesInvoices_R_02', N'View My Invoice'),
    (N'UtilitiesInvoices_U_01', N'Update Invoice Information'),
    (N'UtilitiesInvoices_U_02', N'Pay Money <=> Update Invoice Status'),
    (N'UtilitiesInvoices_D_01', N'Delete Utilities Invoice');
GO

-- Permission liên quan đến bảng 16: Contracts
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Contracts_C_01', N'Create a new Contract'),
    (N'Contracts_R_01', N'View All Contract'),
    (N'Contracts_R_02', N'View My Contracts'),
    (N'Contracts_U_01', N'Update Contract Information'),
    (N'Contracts_D_01', N'Delete Contract');
GO

-- Permission liên quan đến bảng 17: StayAtHistory
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'StayAtHistory_C_01', N'Create Stay At History Record'),
    (N'StayAtHistory_R_01', N'View All Stay At History'),
    (N'StayAtHistory_R_02', N'View my Stay At History'),
    (N'StayAtHistory_U_01', N'Update Stay At History Information'),
    (N'StayAtHistory_D_01', N'Delete Stay At History Record');
GO

-- Permission liên quan đến bảng 18: StaffInfo
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'StaffInfo_C_01', N'Create New Staff Information'),
    (N'StaffInfo_R_01', N'View All Staff Information'),
    (N'StaffInfo_R_02', N'View My Staff Information'),
    (N'StaffInfo_U_01', N'Update Any Staff Information'),
    (N'StaffInfo_U_02', N'Update My Staff Information'),
    (N'StaffInfo_D_01', N'Delete Staff Information');
GO

-- Permission liên quan đến bảng 19: VisitorLogs
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'VisitorLogs_C_01', N'Create Visitor Log (Check-in)'),
    (N'VisitorLogs_R_01', N'View All Visitor Logs'),
    (N'VisitorLogs_R_02', N'View Logs related to my apartment'),
    (N'VisitorLogs_U_01', N'Update Visitor Log Information'),
    (N'VisitorLogs_D_01', N'Delete Visitor Log');
GO
-- Permission liên quan đến bảng 20: Appointments
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Appointments_C_01', N'Create a new Appointment'),
    (N'Appointments_R_01', N'View All Appointment'),
    (N'Appointments_R_02', N'View My Appointment'),
    (N'Appointments_U_01', N'Update Appointment Information'),
    (N'Appointments_U_02', N'Assign To Staff'),
    (N'Appointments_D_01', N'Delete Appointment');
GO

-- Permission liên quan đến bảng 21: Notification
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Notification_C_01', N'Create System Notification'),
    (N'Notification_R_01', N'View all Notification of system'),
    (N'Notification_R_02', N'View my Notification'),
    (N'Notification_U_01', N'Read <=> Update Noti Status'),
    (N'Notification_D_01', N'Delete Notification');
GO

-- Permission liên quan đến bảng 22: Expenses
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'Expenses_C_01', N'Create New Expense Record'),
    (N'Expenses_R_01', N'View All Expense'),
    (N'Expenses_R_02', N'View My Expense'),
    (N'Expenses_U_01', N'Update Expense Information'),
    (N'Expenses_U_02', N'Pay Expense <=> Update Expense Status'),
    (N'Expenses_D_01', N'Delete Expense Record');
GO

-- Permission liên quan đến bảng 23: IoT_Sync_Logs
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'IoT_Sync_Logs_C_01', N'Create IoT Sync Log Entry'),
    (N'IoT_Sync_Logs_R_01', N'View All IoT Sync Logs'),
    (N'IoT_Sync_Logs_U_01', N'Update IoT Sync Log Information'),
    (N'IoT_Sync_Logs_D_01', N'Delete IoT Sync Log Record');
GO
-- =============================================
-- Permission liên quan đến bảng 24: MandatoryServices
-- NOTE: Không cho Staff/Admin tạo mới (C) đâu nhé :)))) 
-- Vì phí bắt buộc phải do hệ thống hoặc Super Admin cấu hình cứng từ đầu, 
-- add bừa vào là không biết tính toán hóa đơn sao cho khớp đâu.
-- =============================================
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'MandatoryServices_C_01', N'Create new mandatory service'),
    (N'MandatoryServices_R_01', N'View mandatory service details'),
    (N'MandatoryServices_U_01', N'Update mandatory fee configuration'),
    (N'MandatoryServices_D_01', N'Delete mandatory service record');
GO

-- =============================================
-- Permission liên quan đến bảng 25: ApartmentTypeImages
-- Quản lý bộ sưu tập ảnh cho các loại căn hộ (2PN, 3PN...)
-- =============================================
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'ApartmentTypeImages_C_01', N'Create new Apartment Type Images'),
    (N'ApartmentTypeImages_R_01', N'View all Apartment Type Images'),
    (N'ApartmentTypeImages_U_01', N'Update Apartment Type Images'),
    (N'ApartmentTypeImages_D_01', N'Delete Apartment Type Images');
GO

-- =============================================
-- Permission liên quan đến bảng 26: ServiceResourceImages
-- Quản lý ảnh thực tế của từng tài nguyên (Sân bóng, Phòng gym...)
-- =============================================
INSERT INTO Permissions (PermissionCode, Description)
VALUES 
    (N'ServiceResourceImages_C_01', N'Create new service Resource Images'),
    (N'ServiceResourceImages_R_01', N'View all service Resource Images'),
    (N'ServiceResourceImages_U_01', N'Update service Resource Images'),
    (N'ServiceResourceImages_D_01', N'Delete service Resource Images');
GO


-- Bảng 2
-- Bảng Roles (Chỉ giữ lại định danh Role)
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- role id
    RoleName NVARCHAR(50) NOT NULL UNIQUE -- role name (Vd: 'MANAGER', 'RESIDENT')
);

-- Chèn dữ liệu cho bảng Roles
INSERT INTO Roles (RoleName)
VALUES 
(N'MANAGER'),         -- Toàn quyền hệ thống
(N'RESIDENT'),        -- Cư dân (Sử dụng App)
(N'STAFF_APARTMENT'), -- Quản lý căn hộ, hợp đồng
(N'STAFF_SERVICE'),   -- Quản lý tiện ích, hóa đơn
(N'STAFF_SECURITY'),  -- An ninh, check-in khách, khiếu nại
(N'USER');            -- Người dùng vãng lai/hết hạn hợp đồng
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

-- Bảng 1
--1.1 Gán hết Authorities liên quan đến bảng 1 - permission cho admin
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id 
FROM Permissions 
WHERE PermissionCode LIKE 'Permissions_%'
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- Bảng 2
-- 2.1. Gán các quyền vừa tạo cho Admin (RoleId = 1)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id 
FROM Permissions 
WHERE PermissionCode LIKE 'Roles_%'
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 2.2 Gán quyền Roles_R_02 cho mọi Role đang tồn tại trong bảng Roles
INSERT INTO Authorities (RoleId, PermissionId)
SELECT Roles.Id, Permissions.Id
FROM Roles, Permissions -- Đây là phép Cross Join: lấy mọi Role kết hợp với Permission
WHERE Permissions.PermissionCode = 'Roles_R_02'
  AND NOT EXISTS (
      -- Nếu cặp Role-Permission này đã tồn tại rồi thì bỏ qua
      SELECT 1 FROM Authorities 
      WHERE RoleId = Roles.Id AND PermissionId = Permissions.Id
  );
GO

-- Bảng 3
--3.1 Gán bộ quyền này cho ông Admin (RoleId = 1)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id 
FROM Permissions 
WHERE PermissionCode LIKE 'Authorities_%'
AND NOT EXISTS (
    -- Kiểm tra nếu Admin đã có quyền này rồi thì không add trùng
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- Bảng 4 Account
-- 4.1. Gán bộ quyền này cho Admin (RoleId = 1)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id 
FROM Permissions 
WHERE PermissionCode LIKE 'Account_%'
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 4.2 Gán quyền xem chi tiết và đổi thông tin account cho Role User (RoleId = 2)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id 
FROM Permissions 
WHERE PermissionCode IN ('Account_R_02', 'Account_U_02')
AND NOT EXISTS (
    -- Kiểm tra chống trùng để tránh lỗi Unique
    SELECT 1 FROM Authorities 
    WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 4.3 Gán quyền Account cho RoleId = 3
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id 
FROM Permissions 
WHERE PermissionCode IN (
    'Account_C_01', 
    'Account_R_01', 
    'Account_R_02', 
    'Account_U_01', 
    'Account_U_02', 
    'Account_D_01'
)
AND NOT EXISTS (
    -- Kiểm tra để không chèn trùng dữ liệu
    SELECT 1 FROM Authorities 
    WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- 4.4 Gán quyền xem chi tiết và đổi thông tin account cho Role 4, 5, 6
INSERT INTO Authorities (RoleId, PermissionId)
SELECT r.RoleId, p.Id
FROM (
    SELECT 4 AS RoleId UNION SELECT 5 UNION SELECT 6
) AS r
CROSS JOIN (
    SELECT Id FROM Permissions WHERE PermissionCode IN ('Account_R_02', 'Account_U_02')
) AS p
WHERE NOT EXISTS (
    -- Kiểm tra chống trùng để tránh lỗi Unique
    SELECT 1 FROM Authorities 
    WHERE RoleId = r.RoleId AND PermissionId = p.Id
);
GO

--Bảng 5 Resident
-- 5.1 & 5.3 Gán quyền Resident cho Admin (1) và Staff (3) giống nhau
INSERT INTO Authorities (RoleId, PermissionId)
SELECT r.RoleId, p.Id
FROM (
    SELECT 1 AS RoleId UNION SELECT 3 -- Gộp Admin và Staff
) AS r
CROSS JOIN (
    SELECT Id FROM Permissions 
    WHERE PermissionCode IN ('Resident_C_01', 'Resident_R_01', 'Resident_U_01', 'Resident_D_01')
) AS p
WHERE NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = r.RoleId AND PermissionId = p.Id
);
GO

-- 5.2 Gán quyền hạn cho Resident (2)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN ('Resident_R_02')
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

--Bảng 6 Complaints
-- 6.1 Gán quyền cho Admin (RoleId = 1)
-- Admin có quyền xem tất cả (R_01)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN ('Complaints_R_01')
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id);
GO

-- 6.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân có quyền: Tạo mới, Xem/Sửa/Xóa đơn của chính mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN (
    'Complaints_C_01', 
    'Complaints_R_02', 
    'Complaints_U_02', 
    'Complaints_D_01'
)
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id);
GO

-- 6.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên có quyền xem toàn bộ danh sách khiếu nại để xử lý
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN ('Complaints_R_01')
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id);
GO

-- Bảng 7 Replies
-- 7.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng có toàn quyền quản lý phản hồi
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Replies_C_01', 
    'Replies_R_01', 
    'Replies_U_01', 
    'Replies_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 7.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân chỉ có quyền xem phản hồi gửi cho mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode = 'Replies_R_02'
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 7.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên trực tiếp xử lý và phản hồi khiếu nại
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'Replies_C_01', 
    'Replies_R_01', 
    'Replies_U_01', 
    'Replies_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- Bảng 8 News 
-- 8.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng có quyền đăng tin, sửa và xóa tin tức
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'News_C_01', 
    'News_U_01', 
    'News_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 8.2 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên ban quản lý phụ trách đăng tin và cập nhật thông báo
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'News_C_01', 
    'News_U_01', 
    'News_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- 8.3 thk nào cũng Read được hết nhé Ae bên BE owiiii 

-- Bảng 9: Services
-- 9.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng có quyền quản lý danh mục dịch vụ
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Services_C_01', 
    'Services_U_01', 
    'Services_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 9.2 Gán quyền cho Staff_service (RoleId = 4)
-- Nhân viên phụ trách vận hành và cập nhật các gói dịch vụ
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionCode IN (
    'Services_C_01', 
    'Services_U_01', 
    'Services_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 4 AND PermissionId = Permissions.Id
);
GO
GO

-- Read service Public nhé.

-- Bảng 10 ServiceResources
-- 10.1 Gán quyền cho Admin (RoleId = 1)
-- Full quyền quản lý tài nguyên dịch vụ (Vị trí, trang thiết bị...)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceResources_C_01', 
    'ServiceResources_R_01', 
    'ServiceResources_U_01', 
    'ServiceResources_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 10.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân có quyền xem danh sách tài nguyên/địa điểm để biết mà đặt lịch
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode = 'ServiceResources_R_01'
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 10.3 Gán quyền cho Staff_service (RoleId = 4)
-- Nhân viên quản lý và cập nhật trạng thái tài nguyên dịch vụ
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceResources_C_01', 
    'ServiceResources_R_01', 
    'ServiceResources_U_01', 
    'ServiceResources_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 4 AND PermissionId = Permissions.Id
);
GO

-- Bảng 11 BookingServices
-- 11.1 Gán quyền cho Admin (RoleId = 1)
-- Admin có quyền xem tất cả và Phê duyệt/Từ chối yêu cầu đặt lịch
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'BookingServices_C_01',
    'BookingServices_R_01', 
    'BookingServices_U_02',
	'BookingServices_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 11.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân có quyền: Đặt lịch, Xem lịch cá nhân, Cập nhật và Hủy lịch của mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN (
    'BookingServices_C_01', 
    'BookingServices_R_02', 
    'BookingServices_U_01', 
    'BookingServices_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 11.3 Gán quyền cho Staff_service (RoleId = 4)
-- Nhân viên dịch vụ phụ trách xem và Phê duyệt/Từ chối yêu cầu đặt lịch
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionCode IN (
	'BookingServices_C_01',
    'BookingServices_R_01', 
    'BookingServices_U_02',
	'BookingServices_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 4 AND PermissionId = Permissions.Id
);
GO

-- Bảng  12: ServiceInvoice
-- 12.1 Gán quyền cho Admin (RoleId = 1)
-- Admin nắm toàn quyền kiểm soát hóa đơn
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceInvoices_C_01', 
    'ServiceInvoices_R_01', 
    'ServiceInvoices_U_01', 
    'ServiceInvoices_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 12.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân xem hóa đơn cá nhân và thực hiện thanh toán
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceInvoices_R_02', 
    'ServiceInvoices_U_02'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 12.3 Gán quyền cho Staff_service (RoleId = 4)
-- Nhân viên dịch vụ quản lý hóa đơn (tương đương Admin)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceInvoices_C_01', 
    'ServiceInvoices_R_01', 
    'ServiceInvoices_U_01', 
    'ServiceInvoices_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 4 AND PermissionId = Permissions.Id
);
GO

-- Bảng 13: ApartmentType 
-- 13.1 Gán quyền cho Admin (RoleId = 1)
-- Quản lý danh mục loại căn hộ (Penthouse, Studio, 2BR...)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'ApartmentTypes_C_01', 
    'ApartmentTypes_U_01', 
    'ApartmentTypes_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 13.2 Gán quyền cho Resident (RoleId = 2)
-- View All Apartment Type là public nên không cần lưu trong Database
GO

-- 13.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên quản lý căn hộ được quyền tạo, sửa, xóa loại căn hộ
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'ApartmentTypes_C_01', 
    'ApartmentTypes_U_01', 
    'ApartmentTypes_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- Bảng 14: Apartment
-- 14.1 Gán quyền cho Admin (RoleId = 1)
-- Quản lý toàn bộ danh sách căn hộ trong tòa nhà
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Apartments_C_01', 
    'Apartments_R_01', 
    'Apartments_U_01', 
    'Apartments_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 14.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân xem được thông tin chi tiết căn hộ mình đang sở hữu/thuê
-- (Apartments_R_02 là public nên không cần add vào đây)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode = 'Apartments_R_03'
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 14.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên quản lý căn hộ thực hiện cập nhật trạng thái phòng ốc
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'Apartments_C_01', 
    'Apartments_R_01', 
    'Apartments_U_01', 
    'Apartments_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

--Bảng 15
-- 15.1 Admin (1)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions WHERE PermissionCode IN ('UtilitiesInvoices_C_01', 'UtilitiesInvoices_R_01', 'UtilitiesInvoices_U_01', 'UtilitiesInvoices_D_01')
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id);

-- 15.2 Resident (2)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions WHERE PermissionCode IN ('UtilitiesInvoices_R_02', 'UtilitiesInvoices_U_02')
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id);

-- 15.3 Staff_Apartment (3)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions WHERE PermissionCode IN ('UtilitiesInvoices_C_01', 'UtilitiesInvoices_R_01', 'UtilitiesInvoices_U_01', 'UtilitiesInvoices_D_01')
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id);
GO

-- Bảng 16 Contracts
-- 16.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng có quyền tạo, xem tất cả, chỉnh sửa và xóa hợp đồng
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Contracts_C_01', 
    'Contracts_R_01', 
    'Contracts_U_01', 
    'Contracts_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 16.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân chỉ có quyền xem các hợp đồng mà họ đã ký
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode = 'Contracts_R_02'
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 16.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên quản lý căn hộ trực tiếp làm hợp đồng với cư dân
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'Contracts_C_01', 
    'Contracts_R_01', 
    'Contracts_U_01', 
    'Contracts_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- Bảng 17 StayAtHistory
-- 17.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng có quyền quản lý toàn bộ lịch sử lưu trú của tòa nhà
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'StayAtHistory_C_01', 
    'StayAtHistory_R_01', 
    'StayAtHistory_U_01', 
    'StayAtHistory_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 17.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân chỉ được xem lịch sử lưu trú của chính bản thân mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode = 'StayAtHistory_R_02'
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 17.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên quản lý căn hộ cập nhật thông tin khi cư dân chuyển đến hoặc đi
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'StayAtHistory_C_01', 
    'StayAtHistory_R_01', 
    'StayAtHistory_U_01', 
    'StayAtHistory_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- Bảng 18 Staffinfo
-- 18.1 Gán quyền cho Admin (RoleId = 1)
-- Admin quản lý toàn bộ danh sách và thông tin nhân viên hệ thống
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'StaffInfo_C_01', 
    'StaffInfo_R_01', 
    'StaffInfo_U_01', 
    'StaffInfo_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 18.2 Gán quyền cho các Staff (RoleId 3, 4, 5)
-- Staff_Apartment (3), Staff_service (4) và các Staff khác (5)
-- Có quyền xem và tự cập nhật thông tin cá nhân của chính mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT r.RoleId, p.Id
FROM (
    SELECT 3 AS RoleId UNION SELECT 4 UNION SELECT 5
) AS r
CROSS JOIN (
    SELECT Id FROM Permissions 
    WHERE PermissionCode IN (
        'StaffInfo_R_02', 
        'StaffInfo_U_02'
    )
) AS p
WHERE NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = r.RoleId AND PermissionId = p.Id
);
GO

-- Bảng 19 VisitorLogs
-- 19.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng quản lý và kiểm soát toàn bộ nhật ký khách ra vào
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'VisitorLogs_C_01', 
    'VisitorLogs_R_01', 
    'VisitorLogs_U_01', 
    'VisitorLogs_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 19.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân xem nhật ký khách đến thăm căn hộ của mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode = 'VisitorLogs_R_02'
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 19.3 Gán quyền cho Staff_Apartment (RoleId = 3) và Staff_Security (RoleId = 5)
-- Nhân viên quản lý và Bảo vệ trực tiếp ghi nhận, cập nhật thông tin khách
INSERT INTO Authorities (RoleId, PermissionId)
SELECT r.RoleId, p.Id
FROM (
    SELECT 3 AS RoleId UNION SELECT 5
) AS r
CROSS JOIN (
    SELECT Id FROM Permissions 
    WHERE PermissionCode IN (
        'VisitorLogs_C_01', 
        'VisitorLogs_R_01', 
        'VisitorLogs_U_01', 
        'VisitorLogs_D_01'
    )
) AS p
WHERE NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = r.RoleId AND PermissionId = p.Id
);
GO
-- Bảng 20 Appointments
-- 20.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng có quyền quản lý toàn bộ lịch hẹn và phân công nhân sự
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Appointments_C_01', 
    'Appointments_R_01', 
    'Appointments_U_01', 
    'Appointments_U_02', 
    'Appointments_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 20.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân có quyền xem các lịch hẹn của mình
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN (
    'Appointments_R_02'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- 20.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên quản lý lịch hẹn và thực hiện các công việc được phân công
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'Appointments_C_01', 
    'Appointments_R_01', 
    'Appointments_U_01', 
    'Appointments_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- Bảng 21 Notification

-- 21.1 Gán quyền cho Admin (RoleId = 1)
-- Admin có quyền tạo thông báo mới, xem tất cả và xóa thông báo
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Notification_R_01', 
    'Notification_R_02', 
    'Notification_U_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 21.2 Gán quyền cho toàn bộ User còn lại (RoleId 2, 3, 4, 5, 6)
-- Bao gồm Cư dân và các loại Staff: Được xem thông báo cá nhân và cập nhật trạng thái "Đã đọc"
INSERT INTO Authorities (RoleId, PermissionId)
SELECT r.RoleId, p.Id
FROM (
    SELECT 2 AS RoleId UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
) AS r
CROSS JOIN (
    SELECT Id FROM Permissions 
    WHERE PermissionCode IN (
        'Notification_R_02', 
        'Notification_U_01'
    )
) AS p
WHERE NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = r.RoleId AND PermissionId = p.Id
);
GO

-- Bảng 22 Expense
-- 22.1 Gán quyền cho Admin (RoleId = 1)
-- Quản lý toàn bộ thu chi của hệ thống
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'Expenses_C_01', 
    'Expenses_R_01', 
    'Expenses_U_01', 
    'Expenses_D_01'
)
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id);

-- 22.2 Gán quyền cho Resident (RoleId = 2)
-- Cư dân xem và cập nhật trạng thái thanh toán các khoản chi phí cá nhân
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN (
    'Expenses_R_02', 
    'Expenses_U_02'
)
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 2 AND PermissionId = Permissions.Id);

-- 22.3 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên hỗ trợ quản lý hồ sơ chi phí và xem báo cáo thu chi
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'Expenses_C_01', 
    'Expenses_R_01', 
    'Expenses_U_01', 
    'Expenses_D_01'
)
AND NOT EXISTS (SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id);
GO

-- Bảng 23 IoT_Sync_Logs

-- 23.1 Gán quyền cho Admin (RoleId = 1)
-- Sếp tổng nắm toàn quyền kiểm soát nhật ký đồng bộ IoT
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'IoT_Sync_Logs_C_01', 
    'IoT_Sync_Logs_R_01', 
    'IoT_Sync_Logs_U_01', 
    'IoT_Sync_Logs_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 23.2 Gán quyền cho Staff_Apartment (RoleId = 3)
-- Nhân viên quản lý căn hộ cũng có toàn quyền để xử lý sự cố thiết bị cho cư dân
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'IoT_Sync_Logs_C_01', 
    'IoT_Sync_Logs_R_01', 
    'IoT_Sync_Logs_U_01', 
    'IoT_Sync_Logs_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

--Table 24: MandatoryServices
-- 24.1 gán quyền cho thk admin
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'MandatoryServices_R_01', 
    'MandatoryServices_U_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 24.2 gán quyền cho thk service staff
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionCode IN (
    'MandatoryServices_R_01', 
    'MandatoryServices_U_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 4 AND PermissionId = Permissions.Id
);
GO

-- Bảng 25: Apartment Type
-- 25.1 gán quyền cho thk admin
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'ApartmentTypeImages_C_01', 
    'ApartmentTypeImages_U_01', 
    'ApartmentTypeImages_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

-- 25.2 gán quyền cho thk role id là 3 (Manager)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionCode IN (
    'ApartmentTypeImages_C_01', 
    'ApartmentTypeImages_U_01', 
    'ApartmentTypeImages_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 3 AND PermissionId = Permissions.Id
);
GO

-- 26.1 gán full quyền cho thk admin
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 1, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceResourceImages_C_01', 
    'ServiceResourceImages_R_01', 
    'ServiceResourceImages_U_01', 
    'ServiceResourceImages_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 1 AND PermissionId = Permissions.Id
);
GO

--Bảng 26: ảnh của Apartmnet Type 
-- 26.2 gán full quyền cho thk service staff (Role Id = 4)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceResourceImages_C_01', 
    'ServiceResourceImages_R_01', 
    'ServiceResourceImages_U_01', 
    'ServiceResourceImages_D_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 4 AND PermissionId = Permissions.Id
);
GO

-- 26.3 gán quyền xem (Read) cho thk resident (Role Id = 2)
INSERT INTO Authorities (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionCode IN (
    'ServiceResourceImages_R_01'
)
AND NOT EXISTS (
    SELECT 1 FROM Authorities 
    WHERE RoleId = 2 AND PermissionId = Permissions.Id
);
GO

-- bảng 4
CREATE TABLE Accounts (
    Id INT IDENTITY(1,1) PRIMARY KEY,       -- accountid PK
    Email VARCHAR(100) NOT NULL UNIQUE,     -- email 
    Username VARCHAR(50) NOT NULL UNIQUE,   -- username
    Password VARCHAR(255) NOT NULL,         -- password (nên lưu dưới dạng Hash như BCrypt)

    RoleId INT NOT NULL,                    -- role id (FK)
    IsActive BIT DEFAULT 1,                 -- Trạng thái tài khoản (1: Hoạt động, 0: Khóa)

    -- Ràng buộc khóa ngoại nối sang bảng Roles
    CONSTRAINT FK_Accounts_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive)
VALUES 
('admin@tems.com', 'admin', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 1, 1),           -- Tài khoản Admin tổng
('resident.tuan@gmail.com', 'tuan01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1),    -- Tài khoản Cư dân mẫu
('staff.building@tems.com', 'buildingstaff', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),   -- Nhân viên quản lý căn hộ
('staff.finance@tems.com', 'financestaff', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),  -- Nhân viên kế toán/dịch vụ
('staff.guard@tems.com','guardstaff', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1);		-- Nhân viên an ninh
GO

-- add thêm resident. 
-- Giả định RoleId = 2 là RESIDENT
INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive)
VALUES 
('thao.tran@gmail.com', 'thao01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1),
('hoang.le@gmail.com','hoang01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1),
('lan.anh@gmail.com','lan01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1);
GO

-- add 20 thk user
DECLARE @i INT = 1;
DECLARE @MaxUsers INT = 20;
DECLARE @PasswordHash NVARCHAR(255) = '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W';
DECLARE @RoleId INT = 6;

WHILE @i <= @MaxUsers
BEGIN
    INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive)
    VALUES (
        CONCAT('user', @i, '@smarturban.com'), -- Email: user1@smarturban.com, user2...
        CONCAT('user_test_', @i),              -- Username: user_test_1, user_test_2...
        @PasswordHash, 
        @RoleId, 
        1                                      -- IsActive = 1
    );
    
    SET @i = @i + 1;
END;

PRINT 'Đã nạp xong 20 anh em vào hệ thống! Hẹ hẹ.';
GO

-- 3. Nhóm Building Staff - Quản lý căn hộ (10 người - RoleId = 3)
INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive) VALUES 
('staff.building.01@tems.com', 'buildingstaff01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.02@tems.com', 'buildingstaff02', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.03@tems.com', 'buildingstaff03', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.04@tems.com', 'buildingstaff04', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.05@tems.com', 'buildingstaff05', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.06@tems.com', 'buildingstaff06', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.07@tems.com', 'buildingstaff07', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.08@tems.com', 'buildingstaff08', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.09@tems.com', 'buildingstaff09', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1),
('staff.building.10@tems.com', 'buildingstaff10', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 3, 1);

-- 4. Nhóm Finance Staff - Kế toán/Dịch vụ (10 người - RoleId = 4)
INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive) VALUES 
('staff.finance.01@tems.com', 'financestaff01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.02@tems.com', 'financestaff02', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.03@tems.com', 'financestaff03', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.04@tems.com', 'financestaff04', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.05@tems.com', 'financestaff05', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.06@tems.com', 'financestaff06', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.07@tems.com', 'financestaff07', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.08@tems.com', 'financestaff08', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.09@tems.com', 'financestaff09', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1),
('staff.finance.10@tems.com', 'financestaff10', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 4, 1);

-- 5. Nhóm Guard Staff - An ninh (10 người - RoleId = 5)
INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive) VALUES 
('staff.guard.01@tems.com', 'guardstaff01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.02@tems.com', 'guardstaff02', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.03@tems.com', 'guardstaff03', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.04@tems.com', 'guardstaff04', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.05@tems.com', 'guardstaff05', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.06@tems.com', 'guardstaff06', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.07@tems.com', 'guardstaff07', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.08@tems.com', 'guardstaff08', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.09@tems.com', 'guardstaff09', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1),
('staff.guard.10@tems.com', 'guardstaff10', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1);
GO

DECLARE @i INT = 1;
DECLARE @Username VARCHAR(50);

WHILE @i <= 50
BEGIN
    SET @Username = 'resident_' + RIGHT('00' + CAST(@i AS VARCHAR), 2);
    
    -- Cập nhật lại mật khẩu cho đúng hội "đồng môn"
    UPDATE Accounts 
    SET [Password] = '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W'
    WHERE Username = @Username;

    -- Nếu chưa có thì chèn mới (Phòng trường hợp ông xóa đi làm lại)
    IF @@ROWCOUNT = 0
    BEGIN
        INSERT INTO Accounts (Email, Username, [Password], RoleId, IsActive)
        VALUES (
            @Username + '@tems.com.vn', 
            @Username, 
            '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 
            2, 
            1
        );
    END
    
    SET @i = @i + 1;
END
GO

--bảng 5 
CREATE TABLE Residents (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- ResidentId (Auto increment PK)
    FullName NVARCHAR(100) NOT NULL,      -- name
    Gender NVARCHAR(10),                  -- gender (Vd: Male, Female, Other)
    DateOfBirth DATE,                     -- dob
    IdentityId VARCHAR(20) NOT NULL,      -- identity_id (Natural Key - Unique)
	PhoneNumber VARCHAR(15) NULL,           -- số điện thoại (cho phép null)
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

-- =============================================
-- BATCH 20.1: TẠO THÔNG TIN CƯ DÂN (RESIDENTS)
-- IdentityId: Tăng dần từ 001000001001 -> 001000001050
-- =============================================

DECLARE @i INT = 59; -- AccountId bắt đầu từ 59
DECLARE @Count INT = 1; -- Biến đếm để chạy số thứ tự từ 1 đến 50
DECLARE @RandomDOB DATE;

WHILE @i <= 108
BEGIN
    -- Gen ngày sinh ngẫu nhiên nhưng vẫn đảm bảo >= 20 tuổi
    SET @RandomDOB = DATEADD(DAY, ABS(CHECKSUM(NEWID()) % 9000), '1980-01-01');

    INSERT INTO Residents (FullName, Gender, DateOfBirth, IdentityId, PhoneNumber, AccountId)
    VALUES (
        N'Cư Dân ' + CAST(@i AS NVARCHAR), 
        
        CASE WHEN @i % 2 = 0 THEN N'Male' ELSE N'Female' END,
        
        @RandomDOB,
        
        -- Định dạng IdentityId: 001000001 + số thứ tự (đảm bảo đủ 12 ký tự cho chuyên nghiệp)
        -- Ví dụ: 001000001001, 001000001002...
        '001000001' + RIGHT('000' + CAST(@Count AS VARCHAR), 3),
        
        -- PhoneNumber: 09 + 8 số cuối (ví dụ: 0900001001)
        '09' + RIGHT('00000000' + CAST(@Count AS VARCHAR), 8),
        
        @i
    );

    SET @i = @i + 1;
    SET @Count = @Count + 1;
END
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
'https://tse4.mm.bing.net/th/id/OIP.WIHz1g556WcPRXcu3nbpDwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', 1),

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
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES 
-- 6. Khai trương CLB Bóng bàn
(N'Khai trương Câu lạc bộ Bóng bàn cư dân The Sakura', 
N'Nhằm tăng cường giao lưu và sức khỏe, CLB Bóng bàn chính thức hoạt động tại tầng 1 tòa S2. Kính mời các tay vợt cư dân đăng ký tham gia vào 18h hàng ngày.', 
'https://tse1.mm.bing.net/th/id/OIP.5m7n2yXOj-HM6B1HzuFVeQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', 1),

-- 7. Cảnh báo an ninh PCCC định kỳ
(N'Diễn tập Phòng cháy chữa cháy (PCCC) toàn khu đô thị', 
N'Vào sáng Chủ nhật (20/03/2026), BQL phối hợp cùng lực lượng chức năng tổ chức diễn tập PCCC. Sẽ có còi báo động giả định, cư dân lưu ý không hoảng loạn.', 
'https://tse3.mm.bing.net/th/id/OIP.EFtqYeJQYXxWfFTBTclBNwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', 1);

-- 8. Lịch cắt điện tạm thời để bảo trì trạm biến áp
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES (N'Thông báo tạm ngừng cấp điện để bảo dưỡng trạm biến áp', 
N'Để đảm bảo hệ thống điện vận hành ổn định trong mùa hè, Điện lực sẽ tạm cắt điện khu vực sảnh và hầm từ 01h00 đến 03h00 sáng ngày 22/03/2026.', 
'https://visaho.vn/upload_images/images/2022/03/30/bao-tri-dien-toa-nha-1-min.jpg', 1);

-- 9. Quy định về nuôi thú cưng trong chung cư
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES (N'Nhắc nhở quy định về nuôi giữ thú cưng tại khu vực chung', 
N'Yêu cầu cư dân khi đưa thú cưng ra khu vực công cộng phải có dây xích, rọ mõm và đảm bảo vệ sinh môi trường. Mọi hành vi vi phạm sẽ bị nhắc nhở theo nội quy.', 
'https://i.ebayimg.com/images/g/-9gAAOSwhV9mwF4j/s-l960.jpg', 1);

-- 10. Chào mừng ngày Quốc tế Phụ nữ 8/3
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES (N'Chương trình tặng hoa tri ân nhân ngày Quốc tế Phụ nữ', 
N'BQL xin gửi lời chúc mừng đến toàn thể chị em cư dân. Vào sáng 08/03, mỗi cư dân nữ đi qua sảnh sẽ nhận được một nhành hoa hồng thay lời tri ân.', 
'https://tse4.mm.bing.net/th/id/OIP.5fntcb0-8rMEbyeRGa1zWgHaEo?rs=1&pid=ImgDetMain&o=7&rm=3', 1);
GO

-- =============================================
-- BATCH 16.1: BỔ SUNG 20 BÀI VIẾT NEWS (TỔNG 30)
-- Nội dung: Thông báo, Sự kiện, Mẹo vặt cư dân
-- =============================================

INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES 
-- 11. Thông báo phí gửi xe
(N'Cập nhật biểu phí trông giữ phương tiện năm 2026', 
N'Từ ngày 01/04/2026, phí gửi xe máy sẽ giữ nguyên, xe ô tô thứ hai trở đi sẽ có mức điều chỉnh nhẹ. Chi tiết vui lòng xem tại bảng tin sảnh tòa nhà.', 
'https://tse4.mm.bing.net/th/id/OIP.p61hM9_C3eNcRQUo7dBZLAHaEd?rs=1&pid=ImgDetMain&o=7&rm=3', 1),

-- 12. Mẹo tiết kiệm điện
(N'5 mẹo tiết kiệm điện năng trong mùa nắng nóng', 
N'Sử dụng rèm cửa sáng màu, bảo trì điều hòa định kỳ và tận dụng ánh sáng tự nhiên sẽ giúp hóa đơn tiền điện nhà bạn giảm đáng kể.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQISs5eaae3w4Wx3-EcCNNpbiGTgef1eXuJSw&s', 1),

-- 13. Giải bóng đá cư dân
(N'Khai mạc giải bóng đá nam cư dân TEMS Championship', 
N'Giải đấu quy tụ 12 đội bóng đến từ các block s1, s2. Trận khai mạc sẽ diễn ra vào lúc 15h00 chiều thứ Bảy tại sân bóng khu đô thị.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWGK8uq1tHrb9BM-QnZbUicS3EXX7gPxCk4g&s', 1),

-- 14. Quy định tiếng ồn
(N'Nhắc nhở quy định về tiếng ồn sau 22h00', 
N'Để đảm bảo không gian yên tĩnh cho cư dân nghỉ ngơi, yêu cầu quý vị không khoan đục, ca hát karaoke quá âm lượng quy định sau 10 giờ tối.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LLrL9hjmp1n69hd9eP97YfR8TeWSEmFWQw&s', 1),

-- 15. Lớp học bơi cho bé
(N'Mở lớp dạy bơi miễn phí cho trẻ em cư dân', 
N'Chương trình "Mùa hè an toàn" khai giảng lớp dạy bơi cơ bản tại bể bơi ngoài trời vào các buổi sáng thứ 3-5-7 hàng tuần.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS58alheI0CHjups94Qglyn-FLe2WJ8KhVOEw&s', 1),

-- 16. Bảo trì lọc nước
(N'Kiểm tra định kỳ hệ thống lọc nước tổng tòa nhà', 
N'Đội kỹ thuật sẽ súc rửa bồn chứa nước sạch từ 23h00 đêm nay. Nước có thể hơi đục nhẹ trong 5-10 phút đầu khi cấp lại, cư dân lưu ý.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-zgJHN8c2WERoRIiEL4DsZd9ea00scEu07w&s', 1),

-- 17. Ngày hội đổi rác lấy quà
(N'Ngày hội sống xanh: Đổi pin cũ lấy cây xanh', 
N'Hãy cùng chung tay bảo vệ môi trường bằng cách mang pin đã qua sử dụng đến quầy lễ tân để đổi lấy những chậu sen đá xinh xắn.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWtHe2KhjAQ0COD1uVf4i7GAjwZ_HN3Q5F6Q&s', 1),

-- 18. Cảnh báo lừa đảo
(N'Cảnh báo các thủ đoạn lừa đảo giả danh nhân viên điện lực', 
N'Hiện có đối tượng gọi điện yêu cầu đóng tiền điện qua tài khoản cá nhân. BQL nhắc nhở cư dân chỉ thanh toán qua App chính thức hoặc tại ngân hàng.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftPfa1-Zg1q9DowvB0UntIgglpk0diXfpbw&s', 1),

-- 19. Hội thảo đầu tư
(N'Hội thảo quản lý tài chính cá nhân cho cư dân trẻ', 
N'Diễn giả hàng đầu sẽ chia sẻ về cách tối ưu hóa dòng tiền và quản lý nợ trong buổi tối thứ Tư tuần tới tại sảnh sinh hoạt cộng đồng.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbZnh_YbJ6fcTKi2hnlMSouXnqBq7TgpSuaA&s', 1),

-- 20. Khuyến mãi Spa
(N'Ưu đãi 30% dịch vụ Massage thảo mộc tại Spa tòa nhà', 
N'Chào đón cư dân mới, phòng Spa (ID 9, 10) giảm giá sâu cho các gói chăm sóc da và bấm huyệt trong suốt tháng 3.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiVKcqyxJfwqZRbjBEvHSckx1Fmq93M1f3yw&s', 1),

-- 21-30. Các tin tức bổ sung nhanh (Loop nội dung)
(N'Lịch thu gom rác thải cồng kềnh tháng 4', N'Cư dân có nhu cầu bỏ giường, tủ cũ vui lòng đăng ký trước ngày 05/04.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nzT8tYwc95h0r7tu8peoY5F6b_exo2lEdg&s', 1),
(N'Vệ sinh lưới chắn rác ban công mùa mưa', N'BQL khuyến nghị cư dân kiểm tra phễu thoát sàn ban công tránh ngập úng.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_slxYfoxTTHdeAMQYgehv82AlpwBeJVEFzA&s', 1),
(N'Câu lạc bộ Yoga sảnh S2 tuyển thành viên', N'Lớp học buổi sáng sớm giúp tinh thần sảng khoái, bắt đầu từ 5h30 sáng.', 'https://static.hotdeal.vn/images/822/822188/500x500/190116-khoa-hoc-yoga-8-buoi-tai-clb-yoga-newlife.jpg', 1),
(N'Hướng dẫn sử dụng khóa cửa thông minh Yale', N'Video hướng dẫn cách đổi mã master và thêm vân tay cho người giúp việc.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyIuQ1fHt-1j4jOME6VD4h2Poz_YX0akMAXA&s', 1),
(N'Hợp tác cung cấp thực phẩm sạch tại sảnh', N'Gian hàng rau củ organic từ Đà Lạt sẽ phục vụ cư dân vào mỗi sáng sớm.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk10CsnRAVZAjxiSvRKc1SUZ72UPeSElqiPQ&s', 1),
(N'Tổ chức Tết Trung Thu sớm cho các bé', N'Chương trình rước đèn và múa lân sôi động tại quảng trường trung tâm.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5vSien6-6fEwacR3Yb_Wbf4jA3eOzmRyi3g&s', 1),
(N'Nhắc nhở nộp phí dịch vụ đúng hạn', N'Quý cư dân vui lòng hoàn tất phí dịch vụ trước ngày 10 hàng tháng để tránh gián đoạn.', 'https://thdlog.com/wp-content/uploads/2025/08/3-2.jpg', 1),
(N'Lắp đặt thêm máy tập Gym ngoài trời', N'Bổ sung 5 máy tập bụng và xà đơn tại khu vực công viên ven hồ.', 'https://thethaominhphu.com/wp-content/uploads/2017/12/cong-vien.jpg', 1),
(N'Bảo trì camera an ninh hành lang tầng 15-20', N'Kỹ thuật sẽ kiểm tra góc quay và độ nét của camera trong chiều hôm nay.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT52nGCq_ZEVDxWMF6Ixg0IxfvlxZkZgdGe0w&s', 1),
(N'Cảm ơn cư dân đã tham gia khảo sát chất lượng', N'Kết quả khảo sát mức độ hài lòng sẽ được BQL công bố vào cuối tuần tới.', 'https://lh4.googleusercontent.com/proxy/NAUmYxcTIQD2UXuCm5lBQZX79hnM_zYkPrY7FywECqqSWCm-tr7GdecW09zGYw9yECtodDgUExwyoNTKq1hdligKPkDdExcN5u-ih8jdtw', 1);
GO

-- 9 services
CREATE TABLE Services (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- service_id (PK)
    ServiceName NVARCHAR(100) NOT NULL,  -- name
    ServiceCode VARCHAR(50) UNIQUE,      -- unique service code (e.g., 'BBQ_01')
    FeePerUnit DECIMAL(18, 2),           -- price per unit
    UnitType NVARCHAR(50),               -- unit (e.g., "Hour", "Turn", "Month")
    Description NVARCHAR(MAX),           -- detailed description
    ImageUrl NVARCHAR(MAX),              -- URL for the service thumbnail
    IsBookable BIT DEFAULT 0             -- 1: Requires booking (e.g., Tennis), 0: Public access (e.g., Park)
);
--batch 1
INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType, ImageUrl, Description, IsBookable)
VALUES 
('Green Park', 'GREEN_PARK', 0.00, 'Free', 'https://img.freepik.com/free-photo/beautiful-park_1417-1417.jpg?semt=ais_rp_progressive&w=740&q=80', 'Extensive green parks with lush landscapes and walking trails.', 0),
('Swimming Pools', 'SWIM_POOL', 0.00, 'Resident Only', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7', 'Olympic-sized and infinity pools exclusively for residents.', 0),
('Shopping Center', 'SHOP_CENTER', 0.00, 'Free Access', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/06/a3/68/field-s-shopping-center.jpg?w=800&h=500&s=1', 'Sprawling commercial complex with top global brands.', 0),
('Children’s Playground', 'KIDS_PLAY', 0.00, 'Free', 'https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/PlaygroundHero.jpg', 'Safe indoor and outdoor playgrounds for kids of all ages.', 0);
--batch 2
INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType, ImageUrl, Description, IsBookable)
VALUES 
('Gym & Yoga Facilities', 'GYM_YOGA', 500000.00, 'Month', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 'High-end fitness centers and dedicated yoga studios.', 0), -- Gym thường mua thẻ tháng, không cần đặt giờ
('Education System', 'EDU_K12', 0.00, 'Semester', 'https://vcdn1-vnexpress.vnecdn.net/2023/12/13/v1-5551-1702452332.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=vTDtn5c45HktGxyMQtP20w', 'International standard curriculums for the next generation.', 0),
('Smart Parking', 'SMART_PARK', 0.00, 'Month', 'https://sliving.vn/static/bg-parking-55d4ba544730bb343bfb7709c4c8e50b.jpg', 'Automated parking systems with real-time slot tracking.', 0),
('BBQ Park', 'BBQ_PARK', 100000.00, 'Hour', 'https://vinhomebysalereal.vn/wp-content/uploads/2024/08/khu-bbq-garden-vinhomes-ocean-park-3.jpg', 'Dedicated outdoor BBQ areas equipped with grills.', 1); -- BBQ cần đặt chỗ trước
--batch 3
INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType, ImageUrl, Description, IsBookable)
VALUES 
('Tennis Court', 'TENNIS_PRO', 200000.00, 'Hour', 'https://congchungnguyenhue.com/Uploaded/Images/Original/2024/01/21/khu-do-thi-viet-hung-5_2101080916.jpg', 'Professional-grade courts with night lighting.', 1),
('Golf Course', 'GOLF_MINI', 500000.00, 'Hour', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b', 'Premium mini-golf courses for practice and leisure.', 1),
('Sauna & Spa', 'SPA_SAUNA', 300000.00, 'Turn', 'https://vccinews.vn/upload/photos/2026/1/large/vbf-202612210123d2y.jpg', 'Luxury sauna and spa facilities with wellness treatments.', 1),
('Community Hall', 'COMM_HALL', 100000.00, 'Event', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', 'Spacious halls for meetings and social gatherings.', 1);

-- Bảng 24 (tách từ bảng service)
CREATE TABLE MandatoryServices (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ServiceName NVARCHAR(100) NOT NULL,
    ServiceCode VARCHAR(50) UNIQUE,
    BasePrice DECIMAL(18, 2), -- Giá tiền
    UnitType NVARCHAR(50),    -- kWh, m3, Tháng
    Description NVARCHAR(MAX)
);
GO

INSERT INTO MandatoryServices (ServiceName, ServiceCode, BasePrice, UnitType, Description)
VALUES 
(N'Điện sinh hoạt', 'ELEC_01', 2500.00, 'kWh',  N'Tiền điện theo chỉ số.'),
(N'Nước sinh hoạt', 'WAT_01', 15000.00, 'm3', N'Tiền nước theo chỉ số.'),
(N'Phí quản lý tòa nhà', 'MNG_FEE', 500000.00, N'Tháng', N'Phí cố định hàng tháng.');
GO

-- 10 service resource
CREATE TABLE ServiceResources (
    Id INT IDENTITY(1,1) PRIMARY KEY,    -- service_resource_id (PK)
    ResourceCode VARCHAR(50) UNIQUE,     -- service_resource_code
    Location NVARCHAR(255),              -- location_of_service
    ServiceId INT NOT NULL,              -- service_id (FK)
    IsAvailable BIT DEFAULT 1,           -- Thêm trạng thái để biết có đang bảo trì không
	ImageUrl NVARCHAR(MAX),              -- ẢNH LƯU TRỰC TIẾP Ở ĐÂY (Refactored)

    -- Khóa ngoại nối sang bảng Services
    CONSTRAINT FK_Resources_Services FOREIGN KEY (ServiceId) REFERENCES Services(Id)
);

-- trong nay có vài cái book được và vài cái không nhé, 
-- vd: bookable: bbq, tenis
-- ko cần book/ko book được: bể bơi và gym.
-- 1. Resources cho BBQ Park (Giả sử ServiceId = 8)
-- 1. Nhóm BBQ (ServiceId = 8)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('BBQ_ZONE_A_01', N'Vườn BBQ - Khu A (Cạnh hồ bơi)', 8, 1, 'https://tse2.mm.bing.net/th/id/OIP.h5ojHmBqqkvXC7rtk65zugHaE_?rs=1&pid=ImgDetMain&o=7&rm=3'),
('BBQ_ZONE_A_02', N'Vườn BBQ - Khu A (Cạnh hồ bơi)', 8, 1, 'https://tse3.mm.bing.net/th/id/OIP.MM31qoW70iNVwsmLz-Hz7gHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('BBQ_ZONE_B_01', N'Vườn BBQ - Khu B (Công viên trung tâm)', 8, 1, 'https://tse3.mm.bing.net/th/id/OIP.TZwV6kcD_-PTgZpUBqdNjgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 2. Nhóm Tennis (ServiceId = 9)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('TENNIS_CT_01', N'Sân số 1', 9, 1, 'https://serena.com.vn/wp-content/uploads/2022/11/Tennis-3-scaled.jpg'),
('TENNIS_CT_02', N'Sân số 2', 9, 1, 'https://tse4.mm.bing.net/th/id/OIP.aQ6v_dIX8jWYZ1HkgddqFQHaE8?w=660&h=440&rs=1&pid=ImgDetMain&o=7&rm=3'),
('TENNIS_CT_03', N'Sân số 3 (Bảo trì)', 9, 0, 'https://tse1.mm.bing.net/th/id/OIP.H_xYMV4JvL_i3xV6ul8yvgHaEK?w=880&h=495&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 3. Nhóm Golf (ServiceId = 10)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('GOLF_LANE_01', N'Sân tập Golf - Làn 1', 10, 1, 'https://bizweb.dktcdn.net/100/454/998/files/cau-truc-san-golf-1024x579.png?v=1721027003853'),
('GOLF_LANE_02', N'Sân tập Golf - Làn 2', 10, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcrmlQG5DEvy2M6vSPwGkG_I4rETEqw8rMTw&s');
GO

-- 4. Nhóm Spa (ServiceId = 11)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('SPA_ROOM_01', N'Phòng VIP 1', 11, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJh0-BFAcK5wtH4FGe4aIO10v7ilfoYmzaGw&s'),
('SPA_ROOM_02', N'Phòng VIP 2', 11, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOjkrNdKBZb_A0uEOni0fzVsxLf1o4ysw0iw&s');
GO
-- 5. add cho bên hall
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES 
( 'HALL_S1_01', N'Tầng 1, Tòa S1 - Hội trường lớn A', 12, 1, 'https://tse2.mm.bing.net/th/id/OIP.lbReQ7jzsltz0GqdDn-9zQHaEv?rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_S1_02', N'Tầng 1, Tòa S1 - Phòng sinh hoạt nhỏ B', 12, 1, 'https://tse4.mm.bing.net/th/id/OIP.RujXzLwGtbOHnCkxClwwkAHaEL?rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_S2_01', N'Tầng 1, Tòa S2 - Hội trường trung tâm', 12, 1, 'https://tse2.mm.bing.net/th/id/OIP.hwEPNJ3f-qftLAPYzeOm6AAAAA?w=440&h=293&rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_S2_02', N'Tầng 2, Tòa S2 - Phòng họp cư dân', 12, 1, 'https://tse4.mm.bing.net/th/id/OIP.MsblINLo0plg08VE4JpKUQHaE8?w=550&h=367&rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_COMMON', N'Khu vực quảng trường - Nhà sinh hoạt chung', 12, 1, 'https://tse2.mm.bing.net/th/id/OIP.lbReQ7jzsltz0GqdDn-9zQHaEv?rs=1&pid=ImgDetMain&o=7&rm=3' );
GO
-- 1. Resources cho Green Park (ServiceId = 1)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('PARK_CENTRAL', N'Công viên trung tâm - Khu vực hồ điều hòa', 1, 1, 'https://www.annhome.vn/wp-content/uploads/2020/04/Cong-vien-van-hoa-nghe-thuat-Vinhomes-Grand-Park.jpg'),
('PARK_NORTH', N'Công viên phía Bắc - Khu vườn Nhật', 1, 1, 'https://tse3.mm.bing.net/th/id/OIP.BKk52dVdASyotQKc71uphQHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3');
GO

-- 2. Resources cho Swimming Pools (ServiceId = 2)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('POOL_S1_INF', N'Tòa S1 - Tầng 4 (Bể bơi vô cực)', 2, 1, 'https://tse1.mm.bing.net/th/id/OIP.L-JwO9EXN-dbA54tKnmaJQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'),
('POOL_S2_KIDS', N'Tòa S2 - Tầng trệt (Bể bơi trẻ em)', 2, 1, 'https://tse2.mm.bing.net/th/id/OIP.rxQdhbvDkL9D-xHrlVC89wHaEJ?w=740&h=415&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 3. Resources cho Shopping Center (ServiceId = 3)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('MALL_MAIN_A', N'Khu thương mại Vincom - Sảnh A', 3, 1, 'https://tse1.mm.bing.net/th/id/OIP.nIgOdEIPzK6iH_fn5VhZuAHaE9?rs=1&pid=ImgDetMain&o=7&rm=3'),
('SHOP_HOUSE_S1', N'Dãy Shophouse khối đế tòa S1', 3, 1, 'https://tse4.mm.bing.net/th/id/OIP.WjjQk3n_qC6-i6VNfJAFUgHaFj?w=800&h=600&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 4. Resources cho Children’s Playground (ServiceId = 4)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('KIDS_OUT_01', N'Sân chơi ngoài trời - Cạnh tòa S2', 4, 1, 'https://th.bing.com/th/id/OIP.v177-wHiXxZGJbcntYuQGQHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'),
('KIDS_IN_01', N'Phòng vui chơi trong nhà - Tòa S1', 4, 1, 'https://tse2.mm.bing.net/th/id/OIP.uESWc2hfOLwnToCMDsAGawHaE8?w=700&h=467&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 5. Resources cho Gym & Yoga Facilities (ServiceId = 5)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('GYM_CENTER_01', N'Tầng 2 - Tòa S1 (Phòng Gym chính)', 5, 1, 'https://tse3.mm.bing.net/th/id/OIP.b3ggclKqEU-oa6NNiTeiJAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('YOGA_STUDIO_01', N'Tầng 2 - Tòa S1 (Phòng Yoga thiền)', 5, 1, 'https://th.bing.com/th/id/OIP.H1MFdEfZszyHyFS_yZ7YrAHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 6. Resources cho Education System (ServiceId = 6)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('EDU_VINS_PRIMARY', N'Khu trường tiểu học Vinschool', 6, 1, 'https://tse1.mm.bing.net/th/id/OIP.Au3G2PnYSDyOnIr3uuEDPgHaEB?rs=1&pid=ImgDetMain&o=7&rm=3'),
('EDU_VINS_KINDERGARTEN', N'Khu trường mầm non Vinschool', 6, 1, 'https://tse2.mm.bing.net/th/id/OIP.NGX75odDxZJrt6V3C0fB5wHaEa?rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 7. Resources cho Smart Parking (ServiceId = 7)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('PARK_B1_S1', N'Hầm gửi xe B1 - Tòa S1', 7, 1, 'https://img.freepik.com/premium-photo/smart-parking-system-with-realtime-availability-reservation-features_1327465-68653.jpg?w=1800'),
('PARK_B1_S2', N'Hầm gửi xe B1 - Tòa S2', 7, 1, 'https://tse4.mm.bing.net/th/id/OIP.Y-kEhNTZMaxfwEyFxAHYogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3');
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

-- 12.5 (bảng 27) Tạo bảng FurnitureTypes trước để làm danh mục
CREATE TABLE FurnitureTypes (
    Id INT PRIMARY KEY,                       -- Id tự nhập (0, 1, 2, 3) hoặc dùng IDENTITY
    Description NVARCHAR(255) NOT NULL        -- Mô tả (Vd: Không nội thất, Cao cấp...)
);
GO

-- Chèn dữ liệu danh mục cho FurnitureTypes
INSERT INTO FurnitureTypes (Id, Description)
VALUES 
    (0, N'Không nội thất'),
    (1, N'Nội thất cơ bản'),
    (2, N'Đầy đủ nội thất'),
    (3, N'Nội thất cao cấp'),
	(4, N'Nội thất siêu sang (Luxury)');
GO

-- 13. Cấu trúc bảng ApartmentTypes mới (Dùng khóa ngoại)
CREATE TABLE ApartmentTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- PK
    Name NVARCHAR(100) NOT NULL,             
    DesignSqrt DECIMAL(10, 2),               
    NumberOfBedroom INT DEFAULT 1,           
    NumberOfBathroom INT DEFAULT 1,          
    Overview NVARCHAR(MAX),                  
    CommonPriceForBuying DECIMAL(18, 2),     
    CommonPriceForRent DECIMAL(18, 2),       
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Thay cột cũ bằng Foreign Key trỏ sang bảng FurnitureTypes
    FurnitureTypeId INT DEFAULT 0,           
    CONSTRAINT FK_ApartmentTypes_Furniture FOREIGN KEY (FurnitureTypeId) 
    REFERENCES FurnitureTypes(Id)
);
GO

-- =============================================
-- BATCH 1: Biến thể cho Căn hộ Studio (30m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Căn hộ Studio - Trống (Basic)', 30.00, 1, 1, N'Gói bàn giao thô, tự do sáng tạo không gian.', 2000000000, 7000000, 0),
(N'Căn hộ Studio - Nội thất Cơ bản', 30.00, 1, 1, N'Bao gồm thiết kế bếp và điều hòa âm trần.', 2200000000, 8500000, 1),
(N'Căn hộ Studio - Đầy đủ nội thất', 30.00, 1, 1, N'Xách vali vào ở ngay, đầy đủ giường tủ sofa.', 2400000000, 10000000, 2);
GO

-- =============================================
-- BATCH 2: Biến thể cho Căn hộ 1PN (45m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Căn hộ 1PN - Nội thất Cơ bản', 45.00, 1, 1, N'Phòng ngủ tách biệt, nội thất tiêu chuẩn.', 3200000000, 12000000, 1),
(N'Căn hộ 1PN - Đầy đủ nội thất', 45.00, 1, 1, N'Nội thất hiện đại, tối ưu diện tích.', 3400000000, 14000000, 2),
(N'Căn hộ 1PN - Nội thất Cao cấp', 45.00, 1, 1, N'Vật liệu hạng sang, phong cách Zen Nhật.', 3700000000, 16000000, 3);
GO

-- =============================================
-- BATCH 3: Biến thể cho Căn hộ 2PN (65m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Căn hộ 2PN - Nội thất Cơ bản', 65.00, 2, 2, N'Lựa chọn kinh tế cho gia đình trẻ.', 4800000000, 18000000, 1),
(N'Căn hộ 2PN - Đầy đủ nội thất', 65.00, 2, 2, N'Không gian ấm cúng, đủ tiện nghi.', 5100000000, 21000000, 2),
(N'Căn hộ 2PN - Nội thất Cao cấp', 65.00, 2, 2, N'Trang bị hệ thống Smart Home.', 5500000000, 25000000, 3);
GO

-- =============================================
-- BATCH 4: Biến thể cho Căn hộ 2PN+1 (80m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Căn hộ 2PN+1 - Nội thất Cơ bản', 80.00, 2, 2, N'Không gian +1 để trống tự thiết kế.', 5800000000, 22000000, 1),
(N'Căn hộ 2PN+1 - Đầy đủ nội thất', 80.00, 2, 2, N'Nội thất đồng bộ cho cả nhà.', 6200000000, 25000000, 2),
(N'CATIVE 2PN+1 - Nội thất Cao cấp', 80.00, 2, 2, N'Gói nội thất chuyên gia cao cấp.', 6600000000, 28000000, 3);
GO

-- =============================================
-- BATCH 5: Biến thể cho Căn hộ 3PN (100m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Căn hộ 3PN - Nội thất Cao cấp', 100.00, 3, 2, N'Sang trọng, hiện đại, view thoáng.', 7500000000, 28000000, 3),
(N'Căn hộ 3PN - Nội thất Siêu sang', 100.00, 3, 2, N'Đẳng cấp thượng lưu.', 8500000000, 35000000, 4);
GO

-- =============================================
-- BATCH 6: Biến thể cho Căn hộ 3PN+1 (120m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Căn hộ 3PN+1 - Nội thất Cao cấp', 120.00, 3, 3, N'Diện tích cực đại, tiện nghi tối đa.', 9500000000, 35000000, 3),
(N'Căn hộ 3PN+1 - Nội thất Siêu sang', 120.00, 3, 3, N'Bản giới hạn dành cho chủ nhân tinh hoa.', 11000000000, 45000000, 4);
GO

-- Thêm loại hình Shophouse cho tầng 1
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES (N'Shophouse Thương Mại - Tầng Đế', 150.00, 0, 1, N'Mặt bằng kinh doanh rộng rãi, vị trí đắc địa tại tầng 1.', 15000000000, 60000000, 0);
GO

-- 14
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

-- 14.1 từ tầng 2 - 30 mỗi tầng thì có 12 căn, có 6 loại căn, ramdom furniture
DECLARE @Floor INT = 2;
DECLARE @RoomIndex INT;

WHILE @Floor <= 30
BEGIN
    SET @RoomIndex = 1;
    WHILE @RoomIndex <= 12
    BEGIN
        INSERT INTO Apartments (RoomNumber, FloorNumber, Direction, Status, ApartmentTypeId)
        VALUES (
            (@Floor * 100) + @RoomIndex, -- Ví dụ: Tầng 2 có 201, 202... Tầng 30 có 3001, 3002...
            @Floor,
            CASE 
                WHEN @RoomIndex % 4 = 1 THEN N'Đông Nam'
                WHEN @RoomIndex % 4 = 2 THEN N'Tây Bắc'
                WHEN @RoomIndex % 4 = 3 THEN N'Tây Nam'
                ELSE N'Đông Bắc'
            END,
            0, -- Status sạch tinh tươm cho Nghĩa dễ quản lý
            CASE 
                -- Trục dọc: Căn số 1,2 luôn là Studio (ID 1-3)
                WHEN @RoomIndex BETWEEN 1 AND 2 THEN (ABS(CHECKSUM(NEWID())) % 3) + 1 
                -- Trục dọc: Căn số 3,4 luôn là 1PN (ID 4-6)
                WHEN @RoomIndex BETWEEN 3 AND 4 THEN (ABS(CHECKSUM(NEWID())) % 3) + 4
                -- Trục dọc: Căn số 5,6 luôn là 2PN (ID 7-9)
                WHEN @RoomIndex BETWEEN 5 AND 6 THEN (ABS(CHECKSUM(NEWID())) % 3) + 7
                -- Trục dọc: Căn số 7,8 luôn là 2PN+1 (ID 10-12)
                WHEN @RoomIndex BETWEEN 7 AND 8 THEN (ABS(CHECKSUM(NEWID())) % 3) + 10
                -- Trục dọc: Căn số 9,10 luôn là 3PN (ID 13-14)
                WHEN @RoomIndex BETWEEN 9 AND 10 THEN (ABS(CHECKSUM(NEWID())) % 2) + 13
                -- Trục dọc: Căn số 11,12 luôn là 3PN+1 (ID 15-16)
                ELSE (ABS(CHECKSUM(NEWID())) % 2) + 15
            END
        );
        SET @RoomIndex = @RoomIndex + 1;
    END
    SET @Floor = @Floor + 1;
END
GO

-- Chèn 4 căn Shophouse tại các vị trí góc của tầng 1
-- Giả sử ApartmentTypeId = 17 là loại Shophouse ông vừa tạo
INSERT INTO Apartments (RoomNumber, FloorNumber, Direction, Status, ApartmentTypeId)
VALUES 
    (101, 1, N'Đông Nam', 0, 17), -- Góc 1
    (104, 1, N'Tây Bắc', 0, 17), -- Góc 2
    (107, 1, N'Tây Nam', 0, 17), -- Góc 3
    (110, 1, N'Đông Bắc', 0, 17); -- Góc 4
GO


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
	CreatedById INT NOT NULL,                -- account_id (FK - Người/staff tạo hợp đồng)
    -- Các ràng buộc khóa ngoại
    CONSTRAINT FK_Contracts_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    CONSTRAINT FK_Contracts_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts(Id),
    CONSTRAINT FK_Contracts_Accounts_Creator FOREIGN KEY (CreatedById) REFERENCES Accounts(Id)
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

-- 18.1 ae nhà Staff apartment
-- 1. Đội 2k5 (6 Nam - 5 Nữ) - ID: 3, 29-38
INSERT INTO StaffInfo (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
(N'Nguyễn Văn Nam', N'Nam', '2005-01-15', '001205000003', 3),
(N'Trần Hoàng Long', N'Nam', '2005-03-20', '001205000029', 29),
(N'Phạm Minh Đức', N'Nam', '2005-05-10', '001205000030', 30),
(N'Lê Anh Tuấn', N'Nam', '2005-07-25', '001205000031', 31),
(N'Vũ Quang Huy', N'Nam', '2005-09-12', '001205000032', 32),
(N'Đỗ Tiến Đạt', N'Nam', '2005-11-05', '001205000033', 33),
(N'Hoàng Thu Trang', N'Nữ', '2005-02-14', '001305000034', 34),
(N'Phan Thanh Thảo', N'Nữ', '2005-04-30', '001305000035', 35),
(N'Bùi Minh Anh', N'Nữ', '2005-06-18', '001305000036', 36),
(N'Ngô Phương Linh', N'Nữ', '2005-08-22', '001305000037', 37),
(N'Lê Thị Kim Ngân', N'Nữ', '2005-12-25', '001305000038', 38);

-- 18.2 anh em nhà Staff Services
-- 2. Đội 2k (5 Nam - 6 Nữ) - ID: 4, 39-48
INSERT INTO StaffInfo (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
(N'Lý Gia Thành', N'Nam', '2000-02-12', '001000000004', 4),
(N'Phan Đình Phùng', N'Nam', '2000-04-25', '001000000039', 39),
(N'Cao Thái Sơn', N'Nam', '2000-06-10', '001000000040', 40),
(N'Đinh Công Tráng', N'Nam', '2000-08-30', '001000000041', 41),
(N'Trịnh Minh Thế', N'Nam', '2000-10-15', '001000000042', 42),
(N'Nguyễn Thị Tuyết Nhung', N'Nữ', '2000-01-20', '001100000043', 43),
(N'Trần Mỹ Tâm', N'Nữ', '2000-03-08', '001100000044', 44),
(N'Lê Cẩm Ly', N'Nữ', '2000-05-15', '001100000045', 45),
(N'Phạm Quỳnh Anh', N'Nữ', '2000-07-22', '001100000046', 46),
(N'Vũ Cát Tường', N'Nữ', '2000-09-11', '001100000047', 47),
(N'Hồ Ngọc Hà', N'Nữ', '2000-12-05', '001100000048', 48);
GO
--18.3 staff sercurity
INSERT INTO StaffInfo (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
-- 9 NAM (Thế kỷ 20, Nam là số 0)
(N'Nguyễn Quý Đức', N'Nam', '1970-05-12', '001070000005', 5),
(N'Trần Trọng Nghĩa', N'Nam', '1972-08-20', '001072000049', 49),
(N'Phạm Thế Duyệt', N'Nam', '1974-03-15', '001074000050', 50),
(N'Lê Khả Phiêu', N'Nam', '1975-12-01', '001075000051', 51),
(N'Vũ Khoan', N'Nam', '1976-06-18', '001076000052', 52),
(N'Hoàng Trung Hải', N'Nam', '1977-09-25', '001077000053', 53),
(N'Nguyễn Sinh Hùng', N'Nam', '1978-11-11', '001078000054', 54),
(N'Phan Văn Khải', N'Nam', '1979-02-28', '001079000055', 55),
(N'Trương Tấn Sang', N'Nam', '1980-04-05', '001080000056', 56),

-- 2 NỮ (Thế kỷ 20, Nữ là số 1)
(N'Nguyễn Thị Kim Ngân', N'Nữ', '1975-10-20', '001175000057', 57),
(N'Tòng Thị Phóng', N'Nữ', '1978-01-01', '001178000058', 58);
GO

-- 19 Visitor logs
-- Chức năng dành cho Security (Bảo vệ) thực hiện
CREATE TABLE VisitorLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,        -- visitor_log_id (PK)
    VisitorName NVARCHAR(255) NOT NULL,      -- Tên người vào
    IdentityCard VARCHAR(20) NOT NULL,       -- Số CCCD/Passport (Thêm mới, không để UNIQUE)
    PhoneNumber VARCHAR(20) NOT NULL,        -- SĐT người vào
    ApartmentId INT NOT NULL,                -- ID phòng khách ghé thăm (FK)
    CreatedByStaffId INT NOT NULL,           -- ID bảo vệ thực hiện check-in (FK)
    CheckInTime DATETIME DEFAULT GETDATE(),  -- Thời điểm vào
    Note NVARCHAR(MAX),                      -- Ghi chú thêm

    -- Khóa ngoại nối tới bảng căn hộ
    CONSTRAINT FK_Visitor_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    -- Khóa ngoại nối tới bảng nhân viên
    CONSTRAINT FK_Visitor_Staff FOREIGN KEY (CreatedByStaffId) REFERENCES Accounts(Id)
);

-- 20 Appoinment
-- Note: Cái này do staff tạo nhé hehe - Change Request 10.
CREATE TABLE Appointments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Đối tượng khách hàng (Người nhận thông báo) - biết đâu thằng cha đấy chưa có tk ? 
    UserId INT NULL, 
    
    -- Nhân viên được giao nhiệm vụ gặp mặt - mới tạo thì giao ai ?
    AssignedTo INT NULL, 
    
    -- Người tạo lịch hẹn (Staff/Admin)
    CreatedBy INT NOT NULL, 
    
    -- Nội dung & Địa điểm
    Location NVARCHAR(255) NOT NULL,
    Title NVARCHAR(100), -- Ví dụ: "Ký hợp đồng thuê căn hộ A101"
    Note NVARCHAR(MAX),  -- Để ghi chú kết quả sau cuộc gặp
    
    -- Thời gian
    MeetingDate DATE NOT NULL,
    StartTime TIME NOT NULL, -- From
    EndTime TIME NOT NULL,   -- To
    
    -- Trạng thái: 0: Suspended (Hủy), 1: Pending (Sắp tới), 2: Completed (Đã gặp)
    Status NVARCHAR(20) DEFAULT 'Pending', 
    
    -- Audit log
    CreatedAt DATETIME DEFAULT GETDATE(),

    -- Các ràng buộc khóa ngoại (FK) trỏ về bảng Accounts
    CONSTRAINT FK_Appt_User FOREIGN KEY (UserId) REFERENCES Accounts(Id),
    CONSTRAINT FK_Appt_Assigned FOREIGN KEY (AssignedTo) REFERENCES Accounts(Id),
    CONSTRAINT FK_Appt_Creator FOREIGN KEY (CreatedBy) REFERENCES Accounts(Id)
);
-- =============================================
-- BATCH 13.1: CHI TIẾT LỊCH HẸN THUÊ/MUA NHÀ
-- Created & Assigned: ID 3 (Chuyên viên kinh doanh)
-- =============================================
-- =============================================
-- BATCH 13: LỊCH HẸN VỚI KHÁCH VÃNG LAI (APPOINTMENTS)
-- Creator & Assigned: ID 3
-- UserId: NULL (Khách chưa có tài khoản)
-- =============================================

INSERT INTO Appointments (UserId, AssignedTo, CreatedBy, Location, Title, Note, MeetingDate, StartTime, EndTime, Status)
VALUES 
-- 1. Lịch hẹn đã xong (Completed)
(NULL, 3, 3, N'Sảnh tòa nhà A', N'Tư vấn mặt bằng Shophouse', N'test cho vui thôi hẹ hẹ', '2026-03-10', '09:00:00', '10:00:00', 'Completed'),

-- 2. Lịch hẹn sắp tới (Pending)
(NULL, 3, 3, N'Phòng họp tầng 2', N'Ký nháy biên bản bàn giao thiết bị', N'test cho vui thôi hẹ hẹ', '2026-04-05', '14:30:00', '15:30:00', 'Pending'),

-- 3. Một kèo bị hủy (Suspended)
(NULL, 3, 3, N'Café Highland chân đế', N'Trao đổi về thủ tục làm thẻ cư dân', N'test cho vui thôi hẹ hẹ', '2026-03-20', '10:00:00', '11:00:00', 'Suspended'),

-- 4. Tiếp khách tại căn mẫu (Pending)
(NULL, 3, 3, N'Căn hộ mẫu Studio (Type 1)', N'Dẫn khách xem view ban công', N'test cho vui thôi hẹ hẹ', '2026-04-10', '08:00:00', '09:00:00', 'Pending'),

-- 5. Hẹn khảo sát Shophouse (Completed)
(NULL, 3, 3, N'Dãy Shophouse 17', N'Khảo sát vị trí đặt biển quảng cáo', N'test cho vui thôi hẹ hẹ', '2026-03-15', '16:00:00', '17:00:00', 'Completed'),

-- 6. Hẹn bàn công việc gấp (Pending)
(NULL, 3, 3, N'Văn phòng Ban quản lý', N'Tiếp đối tác cung cấp cây cảnh', N'test cho vui thôi hẹ hẹ', '2026-04-15', '13:00:00', '14:00:00', 'Pending');
GO

INSERT INTO Appointments (UserId, AssignedTo, CreatedBy, Location, Title, Note, MeetingDate, StartTime, EndTime, Status)
VALUES 
-- 1. Hẹn xem nhà thực tế (Showrooming)
(NULL, 3, 3, N'Căn A-12.05 (2PN+1)', N'Xem thực tế hướng ban công & Tiện ích tầng 12', N'Khách đang cân nhắc giữa căn 2PN và 3PN. Hẹ hẹ.', '2026-04-01', '09:00:00', '10:30:00', 'Pending'),

-- 2. Hẹn đàm phán hợp đồng thuê Shophouse (Negotiation)
(NULL, 3, 3, N'Văn phòng Ban quản lý TEMS', N'Thương thảo điều khoản miễn phí 2 tháng tiền nhà Shophouse 17', N'Khách muốn mở quán Cafe, cần check kỹ hệ thống thoát nước. Hẹ hẹ.', '2026-04-02', '14:00:00', '15:30:00', 'Pending'),

-- 3. Hẹn ký đặt cọc mua căn hộ (Deposit)
(NULL, 3, 3, N'Sảnh Reception tòa S1', N'Nhận cọc thiện chí căn Studio ID 1', N'Khách đã ưng bộ ảnh Nghĩa add vào DB, muốn chốt ngay. Hẹ hẹ.', '2026-04-03', '16:00:00', '16:30:00', 'Pending');
GO


-- 21 Noti
-- cái này được tạo mỗi khi có trigger kiểu Khi người dùng đồng ý chẳng hạn, thì có thể được tạo thông qua xử lý 
-- trong service thay vì lại ngoi lên rồi lại bắn vào cái API khác
-- VD: staff ấn accept cái booking, bên BE, FE => API(controller) => service => repo booking update =>Noti repo add 
-- thay vì tạo API cho cái Noti này. thế thì nó là thông báo nào nhể ? chia làm 1 hay 2 cái noti, chắc 2 cái đi, 1 cái là đã được accept
-- 1 cái là +1 hóa đơn chưa tạo.
-- chưa phân tích cái bảng này nên ... cũng hơi choke. 
CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- AI NHẬN?
    ReceiverId INT NULL,         -- NULL nếu là thông báo chung cho cả hệ thống
    TargetRole NVARCHAR(50) NULL, -- Gửi cho tất cả "ADMIN" hoặc "STAFF" (NULL nếu gửi cá nhân)

    -- NỘI DUNG
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Type NVARCHAR(50),           -- Loại: 'APPOINTMENT', 'CONTRACT', 'SYSTEM', 'PAYMENT'
    
    -- TRẠNG THÁI
    IsRead BIT DEFAULT 0,        -- 0: Chưa đọc, 1: Đã đọc
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- LIÊN KẾT (Tùy chọn)
    RelatedUrl NVARCHAR(255),    -- Link để nhấn vào là bay tới trang Hợp đồng/Lịch hẹn đó luôn/mấy cái lung tung/ giống facebook :)))
    
    CONSTRAINT FK_Notification_Receiver FOREIGN KEY (ReceiverId) REFERENCES Accounts(Id)
);

--22 Chi phí phát sinh - kiểu lỡ làm hỏng mẹ nhà/cháy nhà
-- Flow cái này sẽ là: Resident gọi Staff lên để kiểm tra, Hoặc Staff kiểm tra định kì, sau đó nếu có vấn đề
-- Thì staff sẽ nói chuyện với Chủ hộ rồi bắt đầu gọi thợ
-- gọi thợ lên xong thì sửa, sửa hết bao tiền thì báo lại cho bên Staff
CREATE TABLE Expenses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Nội dung chi phí
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    
    -- Liên kết
    ApartmentId INT NOT NULL,       -- Căn hộ nào phát sinh chi phí
    CreatedBy INT NOT NULL,         -- Nhân viên/Admin nào nhập khoản này
    
    -- Tài chính
    Amount DECIMAL(18, 2) NOT NULL, -- Tổng chi phí
    
    -- Thời gian
    ExpenseDate DATE, -- Ngày thực tế phát sinh chi phí
    CreatedAt DATETIME DEFAULT GETDATE(), -- Ngày tạo record trên hệ thống
    
    -- Trạng thái
    -- 0: Unpaid (Chưa thanh toán), 1: Paid (Đã thanh toán), 2: Cancelled (Hủy bỏ)
    Status INT DEFAULT 0, 
    
    -- Ràng buộc
    CONSTRAINT FK_Expenses_Apartments FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id),
    CONSTRAINT FK_Expenses_Creator FOREIGN KEY (CreatedBy) REFERENCES Accounts(Id)
);

-- Bảng 23 IoT_Sync_Logs 
CREATE TABLE IoT_Sync_Logs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Căn hộ được ghi log
    ApartmentId INT NOT NULL, 

    -- Chỉ số chốt cuối ngày (BE lấy số cũ + random tăng thêm)
    ElectricityEndNum DECIMAL(10, 2) NOT NULL, 
    WaterEndNum DECIMAL(10, 2) NOT NULL,

    -- Ngày ghi log
    LogDate DATETIME DEFAULT GETDATE(),
    -- Ràng buộc khóa ngoại
    CONSTRAINT FK_IoT_Apartment FOREIGN KEY (ApartmentId) REFERENCES Apartments(Id)
);

-- bảng 25 && 26 : để lưu các ảnh liên quan đến loại căn hộ và Service Resource
-- Bảng lưu bộ sưu tập ảnh cho từng loại căn hộ
CREATE TABLE ApartmentTypeImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ApartmentTypeId INT NOT NULL,           -- FK nối sang ApartmentTypes
    ImageUrl NVARCHAR(MAX) NOT NULL,        -- URL ảnh (Cloudinary)
    
    CONSTRAINT FK_Images_ApartmentTypes FOREIGN KEY (ApartmentTypeId) REFERENCES ApartmentTypes(Id) ON DELETE CASCADE
);

-- Dùng bảng tạm để chứa list URL cho đỡ phải viết lặp lại
DECLARE @Images TABLE (Url NVARCHAR(MAX));
INSERT INTO @Images VALUES 
('https://storage.googleapis.com/digital-platform/hinh_anh_can_ho_studio_the_miami_vinhomes_smart_stity_thiet_ke_moi_nhat_so_1_998c066427/hinh_anh_can_ho_studio_the_miami_vinhomes_smart_stity_thiet_ke_moi_nhat_so_1_998c066427.jpg'),
('https://cf.bstatic.com/xdata/images/hotel/max1024x768/498841159.jpg?k=70bbfccecd98db25fed4df51fa6ffdce7c6e792c3852ef0f963835188ddd2d55&o=&hp=1'),
('https://homemaster.com.vn/wp-content/uploads/2021/08/Thiet-ke-noi-that-can-ho-Studio-Vinhome-Smart-City-6.jpg'),
('https://tse4.mm.bing.net/th/id/OIP.GUbUI0X0fFj8QamlK-CQVgHaFD?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://cdn.fazwaz.com/wbr/RlErQEoYYWbsaVXmgXE37PrVjwM/0x0/gallery/180952/screenshot-2023-01-06-110515.png'),
('https://th.bing.com/th/id/R.9e8ed3846b22048aa1e9a9ffd34cda9d?rik=ycyi6kAReBjrTA&riu=http%3a%2f%2fchungcudep.net%2fwp-content%2fuploads%2f2024%2f03%2fanh-thuc-te-can-ho-studio-vinhomes-smart-city-5.jpg&ehk=JMMVbxy9YwdeMfeKxe5MCNtmOBN75Dq0azO1hO8Qtu0%3d&risl=&pid=ImgRaw&r=0');

-- Chèn cho Type 1
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 1, Url FROM @Images;

-- Chèn cho Type 2
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 2, Url FROM @Images;

-- Chèn cho Type 3
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 3, Url FROM @Images;
GO


-- =============================================
-- BATCH 12.2: ĐỒNG BỘ ẢNH CHO CĂN HỘ LOẠI 4, 5, 6
-- Mỗi loại đều nhận đủ 6 URL ảnh nội thất xịn xò
-- =============================================

-- Khai báo bảng tạm chứa list URL mới của Nghĩa
DECLARE @NewImages TABLE (Url NVARCHAR(MAX));
INSERT INTO @NewImages VALUES 
('https://tse3.mm.bing.net/th/id/OIP.iX9MS_QVnV4DF-5Efs28KgHaFG?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://chungcuvinhomessmartcity.com.vn/wp-content/uploads/thiet-ke-can-1pn-smart-city-1024x683.jpg'),
('https://chungcuvinhomessmartcity.com.vn/wp-content/uploads/phong-khach-can-1pn-smart-city-1536x1024.jpg'),
('https://tse4.mm.bing.net/th/id/OIP.DKhS0BRkKDDXgxnzBJ0XlwHaFj?w=1500&h=1125&rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse3.mm.bing.net/th/id/OIP.EouuPwHK7f8m8BQ0GrjrZwHaEK?w=1110&h=623&rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://media-cdn.tripadvisor.com/media/photo-s/16/5f/2a/7f/herla-apartment-at-masteri.jpg');

-- Chèn cho Type 4
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 4, Url FROM @NewImages;

-- Chèn cho Type 5
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 5, Url FROM @NewImages;

-- Chèn cho Type 6
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 6, Url FROM @NewImages;
GO

-- =============================================
-- BATCH 12.3: ĐỒNG BỘ ẢNH CHO CĂN HỘ LOẠI 7, 8, 9
-- Sử dụng bộ 6 ảnh nội thất cao cấp cuối cùng
-- =============================================

-- Khai báo bảng tạm chứa 6 URL mới của Nghĩa
DECLARE @FinalImages TABLE (Url NVARCHAR(MAX));
INSERT INTO @FinalImages VALUES 
('https://tse4.mm.bing.net/th/id/OIP.U45OUjWN7GFGPO_qnbZywgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse4.mm.bing.net/th/id/OIP.bhD6IYk9KUDNIczlJ7uJUgHaEq?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse4.mm.bing.net/th/id/OIP.rz6FxfhfXJYp0B0xGM6JmQHaF7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse4.mm.bing.net/th/id/OIP.oLA213IqKkVjoOpZtvlNUwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://nowhomes.com.sg/wp-content/uploads/809aa2c5-c1a0-43fe-952f-1320c17287e0.jpg'),
('https://tse4.mm.bing.net/th/id/OIP.kGAe0Hn1Zp0MSShJjzrnpgHaE8?w=1200&h=800&rs=1&pid=ImgDetMain&o=7&rm=3');

-- Chèn cho Type 7
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 7, Url FROM @FinalImages;

-- Chèn cho Type 8
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 8, Url FROM @FinalImages;

-- Chèn cho Type 9
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 9, Url FROM @FinalImages;
GO

-- =============================================
-- BATCH 12.4: ĐỒNG BỘ ẢNH CHO CĂN HỘ LOẠI 10, 11, 12
-- Hoàn tất bộ sưu tập ảnh cho toàn bộ dự án TEMS
-- =============================================

-- Khai báo bảng tạm chứa 6 URL cuối cùng
DECLARE @LastImages TABLE (Url NVARCHAR(MAX));
INSERT INTO @LastImages VALUES 
('https://tse1.mm.bing.net/th/id/OIP.0oai9U1qCmD_T26KP1OExQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://th.bing.com/th/id/R.16cecbead17d779a8c6256a9682cccbb?rik=0fbp4CQcxQMGOw&riu=http%3a%2f%2fchungcudep.net%2fwp-content%2fuploads%2f2024%2f03%2fanh-thuc-te-can-ho-2pn-1-vinhomes-smart-city-2.jpg&ehk=vBkTG7piSQLQiEVHJkR9SKw5CV%2f4pfhA4PooFrRPRDE%3d&risl=&pid=ImgRaw&r=0'),
('https://geleximcoanbinhcity.com/wp-content/uploads/2020/05/gfgufgfef3r6389r2.png'),
('https://tse2.mm.bing.net/th/id/OIP.nFbW7gJb4GxIVrpJgdqeMgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://th.bing.com/th/id/R.9e1b0137e4977dbb6fef73cd71a41804?rik=3Wu2%2fevtPMeUfQ&riu=http%3a%2f%2fchungcudep.net%2fwp-content%2fuploads%2f2024%2f03%2fanh-thuc-te-can-ho-2pn-1-vinhomes-smart-city-4.jpg&ehk=G9eR1efc7PQWwvl5XlbqiP94ciqjqA4vv1xHu67rzvA%3d&risl=&pid=ImgRaw&r=0'),
('https://macrolinkmedini.com/wp-content/uploads/2024/12/3-1-scaled.jpeg'),
('https://tse1.mm.bing.net/th/id/OIP.Ms4mLzUfaGTPIQJ6pmDPAwHaEK?w=1200&h=675&rs=1&pid=ImgDetMain&o=7&rm=3');

-- Chèn cho Type 10
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 10, Url FROM @LastImages;

-- Chèn cho Type 11
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 11, Url FROM @LastImages;

-- Chèn cho Type 12
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 12, Url FROM @LastImages;
GO

-- =============================================
-- BATCH 12.5: ĐỒNG BỘ ẢNH CHO CĂN HỘ LOẠI 13, 14
-- Những mảnh ghép cuối cùng cho Gallery căn hộ
-- =============================================

-- Khai báo bảng tạm chứa 6 URL mới nhất
DECLARE @ExtraImages TABLE (Url NVARCHAR(MAX));
INSERT INTO @ExtraImages VALUES 
('https://tse4.mm.bing.net/th/id/OIP.kbElRE6sOfz-1HhZn8oZFgHaGx?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://trannghia.net/wp-content/uploads/2021/02/thong-tin-chi-tiet-can-ho-3-phong-ngu-vinhomes-smart-city-7.jpg'),
('https://th.bing.com/th/id/R.94a9152355df8282b2c55eb971785aef?rik=ASHBNXhEWePgRQ&riu=http%3a%2f%2fchungcudep.net%2fwp-content%2fuploads%2f2024%2f03%2fanh-thuc-te-can-ho-3pn-vinhomes-smart-city-8.jpg&ehk=TVT1%2fSAQFqgJ23OjBq2EmO4ocDzF4nfF9HqAhOTTaJY%3d&risl=&pid=ImgRaw&r=0'),
('https://tse3.mm.bing.net/th/id/OIP.q4Ysl6zB6Al08WuXGjBH_QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://bigt.vn/wp-content/uploads/2023/01/can-ho-smart-city-1400x788.jpeg'),
('https://5.imimg.com/data5/SELLER/Default/2023/7/322962253/WU/PN/MH/41511730/4d-residential-commercial-rendering-1000x1000.jpg');

-- Chèn cho Type 13
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 13, Url FROM @ExtraImages;

-- Chèn cho Type 14
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 14, Url FROM @ExtraImages;
GO

-- =============================================
-- BATCH 12.6: ĐỒNG BỘ ẢNH CHO CĂN HỘ LOẠI 15, 16
-- Tiếp tục phủ kín bộ sưu tập ảnh cho dự án
-- =============================================

-- Khai báo bảng tạm chứa 6 URL tiếp theo
DECLARE @FinalBatchImages TABLE (Url NVARCHAR(MAX));
INSERT INTO @FinalBatchImages VALUES 
('https://tse2.mm.bing.net/th/id/OIP.6y4JYLXSo9TajnEQmZlsVgHaEL?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse4.mm.bing.net/th/id/OIP.NhUXNxMgMonA-oPp7KFydgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse1.mm.bing.net/th/id/OIP.mh4v77zT6Mp2AEIl2WYOPQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse2.mm.bing.net/th/id/OIP.I8GqWztvD7zbzSD-aoFXxQHaEI?w=800&h=446&rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse1.mm.bing.net/th/id/OIP.TtguqKxqSoXhHkWsqiP-lQHaFs?w=1024&h=788&rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://tse2.mm.bing.net/th/id/OIP.FPNl3UCN5Uu2BW6ojmEBLQHaE8?w=1080&h=720&rs=1&pid=ImgDetMain&o=7&rm=3');

-- Chèn cho Type 15
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 15, Url FROM @FinalBatchImages;

-- Chèn cho Type 16
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 16, Url FROM @FinalBatchImages;
GO
-- =============================================
-- BATCH 12.7: GALLERY ẢNH CHO SHOPHOUSE (ID 17)
-- Tập trung vào mặt tiền kinh doanh và không gian mở
-- =============================================

-- Khai báo bảng tạm chứa 6 URL Shophouse của Nghĩa
DECLARE @ShophouseImages TABLE (Url NVARCHAR(MAX));
INSERT INTO @ShophouseImages VALUES 
('https://tse4.mm.bing.net/th/id/OIP.XoRkV63tNpae7ZSQZ52yMAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://anlacmoonlight.vn/wp-content/uploads/2023/05/shophouse-vinhomes-smart-city-thiet-ke-dien-tich-tu-35m2-170m2.jpg'),
('https://shophousevinhomes.vn/wp-content/uploads/2023/10/Shophouse-Vinhomes-Smart-City-3-2.jpg'),
('https://tse3.mm.bing.net/th/id/OIP.gha3ZpH4wdN9UuYLwwSM-wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'),
('https://i.pinimg.com/736x/ff/af/ae/ffafae4f009c77ad980e027adf3dd5f4.jpg'),
('https://greenhousing.com.vn/wp-content/uploads/2024/01/Shophouse-cua-du-an-Vinhomes-Smart-City.jpg');

-- Chèn cho Type 17
INSERT INTO ApartmentTypeImages (ApartmentTypeId, ImageUrl)
SELECT 17, Url FROM @ShophouseImages;
GO


-- Batch 1: 
-- 1.1 lưu contract
INSERT INTO Contracts (ApartmentId, AccountId, ContractType, StartDate, EndDate, MonthlyRent, Status, CreatedAt, CreatedById)
VALUES 
-- Cư dân 1 (Acc 2): Tạo 28/11/2025, dọn vào 01/12/2025
(1, 2, N'Sale', '2025-12-01', NULL, NULL, 1, '2025-11-28 09:00:00', 3),

-- Cư dân 2 (Acc 6): Tạo 03/12/2025, dọn vào 05/12/2025
(2, 6, N'Sale', '2025-12-05', NULL, NULL, 1, '2025-12-03 14:20:00', 29),

-- Cư dân 3 (Acc 7): Tạo 08/12/2025, dọn vào 10/12/2025
(3, 7, N'Sale', '2025-12-10', NULL, NULL, 1, '2025-12-08 11:15:00', 3),

-- Cư dân 4 (Acc 8) - Đại gia mua 3 căn cùng lúc 15/12/2025
(4, 8, N'Sale', '2025-12-15', NULL, NULL, 1, '2025-12-13 10:30:00', 29),
(5, 8, N'Sale', '2025-12-15', NULL, NULL, 1, '2025-12-13 11:45:00', 29),
(6, 8, N'Sale', '2025-12-15', NULL, NULL, 1, '2025-12-13 13:00:00', 29);
GO

-- 1.1.1cái dưới này để update những apartment để lưu là nhà đấy đã có người nhé



-- FAKE COMPLAINTS (THÁNG 12/2025 -> THÁNG 02/2026)
INSERT INTO Complaints (Content, MadeByUserId, CreatedAt)
VALUES 
-- THÁNG 12/2025 (Mới dọn vào nên hay kêu ca dịch vụ)
(N'Thủ tục bàn giao căn hộ còn chậm, tôi phải chờ đợi khá lâu ở sảnh.', 2, '2025-12-05 10:30:00'),
(N'Nước sinh hoạt có dấu hiệu bị đục trong ngày đầu tiên sử dụng.', 6, '2025-12-07 14:15:00'),
(N'App quản lý chưa cập nhật đúng số điện thoại của tôi.', 7, '2025-12-12 09:00:00'),
(N'Hành lang tầng 4 có mùi sơn khó chịu, cần xử lý thông gió.', 8, '2025-12-20 16:45:00'),
(N'Wifi khu vực công cộng của tòa nhà sóng quá yếu.', 8, '2025-12-25 20:10:00'),

-- THÁNG 01/2026 (Bắt đầu phát sinh vấn đề vận hành)
(N'Cửa thoát hiểm tầng 5 bị kẹt, không đóng lại được.', 2, '2026-01-05 08:30:00'),
(N'Nhà hàng xóm hát Karaoke quá giờ quy định vào cuối tuần.', 2, '2026-01-15 22:45:00'),
(N'Rác thải tại hầm gửi xe chưa được thu gom đúng giờ.', 6, '2026-01-10 07:20:00'),
(N'Thang máy số 3 có tiếng kêu lạ khi di chuyển lên tầng cao.', 7, '2026-01-18 13:00:00'),
(N'Bảo vệ bãi xe có thái độ không đúng mực khi hướng dẫn vị trí đỗ.', 8, '2026-01-22 17:55:00'),

-- THÁNG 02/2026 (Vấn đề kỹ thuật và phí bôi trơn)
(N'Vòi hoa sen trong phòng tắm bị rò rỉ nước.', 6, '2026-02-05 11:30:00'),
(N'Hệ thống báo cháy giả kêu vang lúc 2 giờ sáng gây hoảng loạn.', 7, '2026-02-12 02:15:00'),
(N'Tôi thấy có gián ở khu vực đổ rác chung của tầng.', 7, '2026-02-20 09:40:00'),
(N'Đèn hành lang trước cửa nhà tôi bị cháy chưa thấy ai thay.', 8, '2026-02-14 19:20:00'),
(N'Phí quản lý tháng này tính có vẻ không khớp với diện tích căn hộ.', 2, '2026-02-28 10:00:00');
GO

INSERT INTO Replies (Content, ComplaintId, RepliedByUserId, CreatedAt)
VALUES 
-- Phản hồi cho tháng 12/2025
(N'Ban quản lý chân thành xin lỗi về sự chậm trễ này. Chúng tôi đang tăng cường nhân sự để hoàn tất bàn giao sớm nhất.', 1, 3, '2025-12-06 14:30:00'),
(N'Bộ phận kỹ thuật đã kiểm tra và sục rửa đường ống. Quý cư dân vui lòng xả nước trong 5 phút để ổn định lại.', 2, 29, '2025-12-08 18:20:00'),
(N'Thông tin của ông/bà đã được cập nhật lại trên hệ thống. Quý khách vui lòng đăng nhập lại app để kiểm tra.', 3, 3, '2025-12-14 10:15:00'),
(N'Chúng tôi đã cho lắp thêm quạt thông gió tại hành lang tầng 4. Mùi sơn sẽ sớm biến mất.', 4, 29, '2025-12-22 09:30:00'),
(N'Kỹ thuật đã kiểm tra các trạm phát Wifi công cộng và reset lại hệ thống để đảm bảo đường truyền.', 5, 29, '2025-12-27 15:45:00'),

-- Phản hồi cho tháng 01/2026
(N'Đã cử đội bảo trì thay lò xo và tra dầu cho cửa thoát hiểm tầng 5. Hiện tại cửa đã hoạt động bình thường.', 6, 29, '2026-01-07 11:20:00'),
(N'Ban quản lý đã nhắc nhở và yêu cầu hộ dân liên quan cam kết không gây ồn quá giờ quy định.', 7, 3, '2026-01-16 16:00:00'),
(N'Chúng tôi đã điều chỉnh lại lịch thu gom rác tại hầm. Xin lỗi quý cư dân vì sự bất tiện này.', 8, 3, '2026-01-12 09:45:00'),
(N'Đội kỹ thuật thang máy sẽ tiến hành bảo trì tổng quát thang số 3 vào đêm nay.', 9, 29, '2026-01-20 10:30:00'),
(N'Ban quản lý đã làm việc với đơn vị bảo vệ và đình chỉ công tác nhân viên có thái độ thiếu chuyên nghiệp.', 10, 3, '2026-01-24 14:10:00'),

-- Phản hồi cho tháng 02/2026
(N'Kỹ thuật sẽ có mặt tại căn hộ của ông/bà vào 14h chiều nay để thay thế vòi hoa sen mới.', 11, 29, '2026-02-06 09:20:00'),
(N'Sự cố do bụi bẩn bám vào đầu báo cháy. Chúng tôi đã tiến hành vệ sinh toàn bộ cảm biến của tầng.', 12, 29, '2026-02-13 14:50:00'),
(N'Đã tiến hành phun thuốc khử trùng và diệt côn trùng định kỳ cho khu vực thu gom rác.', 13, 29, '2026-02-22 10:15:00'),
(N'Nhân viên điện nước đã thay bóng đèn mới tại hành lang tầng của ông/bà.', 14, 29, '2026-02-16 08:30:00'),
(N'Bộ phận kế toán đã kiểm tra lại diện tích. Chúng tôi sẽ gửi lại bảng tính chi tiết cho ông/bà vào sáng mai.', 15, 3, '2026-03-02 11:00:00');
GO

-- =============================================
-- BATCH 7: BOOKING DỊCH VỤ (TENNIS & GOLF)
-- Dữ liệu cho Acc 7 (Hoàng) và Acc 8 (Lan Anh)
-- =============================================

INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, Status, TotalAmount)
VALUES 
-- THÁNG 01/2026
(4, 7, '2026-01-04 09:00:00', '2026-01-05 17:00:00', '2026-01-05 19:00:00', 1, 400000.00), -- Tennis 2h
(7, 8, '2026-01-06 20:00:00', '2026-01-07 06:00:00', '2026-01-07 08:00:00', 1, 1000000.00), -- Golf 2h
(4, 7, '2026-01-11 09:00:00', '2026-01-12 17:00:00', '2026-01-12 19:00:00', 1, 400000.00),
(7, 8, '2026-01-13 20:00:00', '2026-01-14 06:00:00', '2026-01-14 08:00:00', 1, 1000000.00),
(5, 7, '2026-01-18 09:00:00', '2026-01-19 17:00:00', '2026-01-19 19:00:00', 1, 400000.00),
(8, 8, '2026-01-20 20:00:00', '2026-01-21 06:00:00', '2026-01-21 08:00:00', 1, 1000000.00),
(5, 7, '2026-01-25 09:00:00', '2026-01-26 17:00:00', '2026-01-26 19:00:00', 1, 400000.00),
(8, 8, '2026-01-27 20:00:00', '2026-01-28 06:00:00', '2026-01-28 08:00:00', 1, 1000000.00),

-- THÁNG 02/2026
(4, 7, '2026-02-01 08:00:00', '2026-02-02 17:00:00', '2026-02-02 19:00:00', 1, 400000.00),
(7, 8, '2026-02-03 19:00:00', '2026-02-04 06:00:00', '2026-02-04 08:00:00', 1, 1000000.00),
(4, 7, '2026-02-04 10:00:00', '2026-02-05 17:00:00', '2026-02-05 19:00:00', 1, 400000.00),
(7, 8, '2026-02-06 18:00:00', '2026-02-07 07:00:00', '2026-02-07 09:00:00', 1, 1000000.00),
(5, 7, '2026-02-08 09:00:00', '2026-02-09 17:00:00', '2026-02-09 19:00:00', 1, 400000.00),
(8, 8, '2026-02-10 20:00:00', '2026-02-11 06:00:00', '2026-02-11 08:00:00', 1, 1000000.00),
(5, 7, '2026-02-11 11:00:00', '2026-02-12 17:30:00', '2026-02-12 19:30:00', 1, 400000.00),
(8, 8, '2026-02-13 21:00:00', '2026-02-14 06:30:00', '2026-02-14 08:30:00', 1, 1000000.00);
GO

INSERT INTO ServiceInvoices (ServiceBookingId, Amount, Status, CreatedAt, PaymentDate)
VALUES 
-- HÓA ĐƠN THÁNG 01/2026
(1, 400000.00, 1, '2026-01-04 11:30:00', '2026-01-04 12:15:00'), -- BookAt: 09:00
(2, 1000000.00, 1, '2026-01-06 22:45:00', '2026-01-06 23:10:00'), -- BookAt: 20:00
(3, 400000.00, 1, '2026-01-11 12:00:00', '2026-01-11 12:45:00'),
(4, 1000000.00, 1, '2026-01-13 23:00:00', '2026-01-13 23:50:00'),
(5, 400000.00, 1, '2026-01-18 11:15:00', '2026-01-18 11:55:00'),
(6, 1000000.00, 1, '2026-01-20 23:30:00', '2026-01-21 00:15:00'),
(7, 400000.00, 1, '2026-01-25 12:20:00', '2026-01-25 13:00:00'),
(8, 1000000.00, 1, '2026-01-27 22:50:00', '2026-01-28 08:30:00'),

-- HÓA ĐƠN THÁNG 02/2026
(9, 400000.00, 1, '2026-02-01 10:45:00', '2026-02-01 11:30:00'),
(10, 1000000.00, 1, '2026-02-03 21:15:00', '2026-02-03 21:55:00'),
(11, 400000.00, 1, '2026-02-04 13:00:00', '2026-02-04 14:20:00'),
(12, 1000000.00, 1, '2026-02-06 21:00:00', '2026-02-06 22:05:00'),
(13, 400000.00, 1, '2026-02-08 12:30:00', '2026-02-08 13:10:00'),
(14, 1000000.00, 1, '2026-02-10 23:15:00', '2026-02-11 08:00:00'),
(15, 400000.00, 1, '2026-02-11 14:00:00', '2026-02-11 15:45:00'),
(16, 1000000.00, 1, '2026-02-13 23:55:00', '2026-02-14 09:15:00');
GO

-- =============================================
-- BATCH 9: CHI PHÍ PHÁT SINH (EXPENSES)
-- Áp dụng cho các căn hộ có người ở: 1, 2, 3, 4, 5, 6
-- =============================================

INSERT INTO Expenses (Title, Description, ApartmentId, CreatedBy, Amount, ExpenseDate, CreatedAt, Status)
VALUES 
-- THÁNG 12/2025 (Hỗ trợ lắp đặt, sửa chữa nhỏ khi mới dọn vào)
(N'Thay bóng đèn sảnh', N'Thay bóng đèn LED 12W bị hỏng tại sảnh vào', 1, 3, 55000.00, '2025-12-10', '2025-12-10 09:00:00', 1),
(N'Sửa vòi nước bồn rửa', N'Xử lý rò rỉ vòi nước phòng bếp', 2, 29, 120000.00, '2025-12-15', '2025-12-15 14:30:00', 1),
(N'Thông tắc thoát sàn', N'Vệ sinh lưới lọc thoát sàn nhà vệ sinh', 3, 29, 80000.00, '2025-12-20', '2025-12-20 10:00:00', 1),
(N'Kiểm tra ổ cắm', N'Xử lý ổ cắm bị lỏng tại phòng khách', 4, 3, 45000.00, '2025-12-22', '2025-12-22 16:00:00', 1),

-- THÁNG 01/2026 (Bảo trì định kỳ sau 1 tháng sử dụng)
(N'Bảo trì điều hòa', N'Vệ sinh lưới lọc và kiểm tra gas', 1, 29, 250000.00, '2026-01-10', '2026-01-10 08:00:00', 1),
(N'Thay pin khóa cửa', N'Thay pin cho khóa cửa thông minh (4 viên AA)', 2, 3, 100000.00, '2026-01-15', '2026-01-15 09:15:00', 1),
(N'Sửa bản lề cửa', N'Cân chỉnh bản lề cửa phòng ngủ bị xệ', 5, 29, 150000.00, '2026-01-20', '2026-01-20 13:45:00', 1),
(N'Vệ sinh ban công', N'Dịch vụ vệ sinh công nghiệp khu vực ban công', 6, 3, 200000.00, '2026-01-25', '2026-01-25 15:00:00', 1),

-- THÁNG 02/2026 (Phát sinh đột xuất)
(N'Diệt côn trùng', N'Phun thuốc diệt gián và kiến định kỳ', 3, 29, 300000.00, '2026-02-05', '2026-02-05 10:30:00', 1),
(N'Sửa chuông cửa', N'Kiểm tra kết nối chuông cửa màn hình', 4, 3, 180000.00, '2026-02-12', '2026-02-12 11:00:00', 1),
(N'Thay dây sen', N'Thay dây vòi hoa sen bị nứt', 1, 29, 95000.00, '2026-02-18', '2026-02-18 16:20:00', 1),
(N'Sửa vòi xịt vệ sinh', N'Thay đầu vòi xịt mới', 5, 3, 70000.00, '2026-02-25', '2026-02-25 09:00:00', 1);
GO


-- =============================================
-- BATCH 10: RE-GEN VISITOR LOGS (FIX STAFF ID)
-- Staff hợp lệ: 5, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58
-- =============================================

INSERT INTO VisitorLogs (VisitorName, IdentityCard, PhoneNumber, ApartmentId, CreatedByStaffId, CheckInTime, Note)
VALUES 
-- CĂN 1 (Acc 2)
(N'Nguyễn Văn Nam', '001095001234', '0912345678', 1, 5, '2026-01-05 09:30:00', N'Bạn chủ nhà đến chơi, mang theo túi trái cây.'),
(N'Lê Thị Huệ', '038198004321', '0988776655', 1, 58, '2026-02-14 19:00:00', N'Ship hoa ngày Valentine, khách bảo cF ở sảnh.'),
(N'Nguyễn Tuấn Shipper', '001098005544', '0901223344', 1, 49, '2026-02-10 11:45:00', N'Giao cơm trưa ShopeeFood, khách xuống lấy tại sảnh.'),

-- CĂN 2 (Acc 6)
(N'Trần Minh Tâm', '079092005566', '0909123456', 2, 50, '2026-01-15 14:15:00', N'Nhân viên bảo trì máy lọc nước ngoài luồng.'),
(N'Phạm Hoàng Long', '001090008899', '0934556677', 2, 51, '2026-02-20 10:00:00', N'Người quen gửi đồ ở quê lên, gửi tại bàn bảo vệ.'),
(N'Trần Văn Thợ', '034085001122', '0988112233', 2, 5, '2026-01-12 08:00:00', N'Thợ điện lạnh vào bảo trì điều hòa phòng khách.'),

-- CĂN 3 (Acc 7)
(N'Hoàng Thanh Trúc', '031195001122', '0977112233', 3, 52, '2026-01-20 18:30:00', N'Em gái chủ nhà đến ăn cơm tối.'),
(N'Vũ Đình Phán', '001085006677', '0911223344', 3, 53, '2026-02-05 08:45:00', N'Thợ lắp mạng Viettel, vào kiểm tra đường dây.'),
(N'Điện Máy Xanh - Team A', '079090001234', '0123456789', 3, 5, '2026-01-22 14:00:00', N'Giao tủ lạnh mới, 2 người vào lắp đặt tầng 3.'),

-- CĂN 4 (Acc 8)
(N'Đặng Quốc Bảo', '001070002233', '0966554433', 4, 54, '2026-01-10 11:00:00', N'Họ hàng dưới quê lên thăm nhà mới.'),
(N'Lê Decor', '001092003344', '0977665544', 4, 55, '2026-02-05 09:15:00', N'Đội thợ dán giấy dán tường cho căn hộ mới mua.'),

-- CĂN 5 (Acc 8)
(N'Lý Gia Thành', '001088009988', '0944332211', 5, 58, '2026-01-25 15:30:00', N'Đối tác làm việc, bàn chuyện kinh doanh.'),
(N'DHL Express - Hùng', '038088009900', '0944009988', 5, 5, '2026-02-18 10:30:00', N'Giao bưu phẩm quốc tế, cần ký nhận tận tay.'),

-- CĂN 6 (Acc 8)
(N'Ngô Kiến Huy', '079099001122', '0922113344', 6, 56, '2026-02-12 16:45:00', N'Giao hàng nội thất decor, cần lên phòng lắp đặt.'),
(N'FPT Telecom - Kỹ thuật', '001099004455', '0911554433', 6, 57, '2026-02-25 15:20:00', N'Nhân viên kỹ thuật FPT vào kiểm tra tín hiệu mạng.');
GO

-- =============================================
-- BATCH 15.1: BỔ SUNG LOGS THỢ KỸ THUẬT & SỬA CHỮA
-- Mục tiêu: Đủ 43 records tổng cộng cho VisitorLogs
-- =============================================

INSERT INTO VisitorLogs (VisitorName, IdentityCard, PhoneNumber, ApartmentId, CreatedByStaffId, CheckInTime, Note)
VALUES 
-- CĂN 1 (Thêm thợ)
(N'Thợ Khóa Minh', '001090001111', '0911001122', 1, 5, '2026-03-01 08:30:00', N'Thay ổ khóa thông minh cho chủ nhà.'),
(N'Nhôm Kính Thành Tâm', '001091002222', '0912223344', 1, 58, '2026-03-05 14:00:00', N'Sửa bản lề cửa ra ban công bị xệ.'),

-- CĂN 2 (Thêm thợ)
(N'Rèm Cửa An Gia', '079092003333', '0903334455', 2, 5, '2026-03-10 09:15:00', N'Lắp đặt bộ rèm cầu vồng phòng ngủ.'),
(N'Vệ Sinh Công Nghiệp', '079093004444', '0904445566', 2, 50, '2026-03-12 13:45:00', N'Vệ sinh sau xây dựng, 3 người vào.'),

-- CĂN 3 (Thêm thợ)
(N'Thợ Sơn Hà Nội', '001085005555', '0915556677', 3, 5, '2026-03-15 10:00:00', N'Sơn lại mảng tường bị ngấm nước ở bếp.'),
(N'Kỹ thuật Hafele', '001086006666', '0916667788', 3, 52, '2026-03-18 15:30:00', N'Bảo hành bếp từ, kiểm tra bo mạch.'),

-- CĂN 4 (Thêm thợ)
(N'Đồ Gỗ Mộc Lan', '001070007777', '0917778899', 4, 5, '2026-03-20 08:00:00', N'Lắp thêm kệ tivi và tủ trang trí.'),
(N'Diệt Côn Trùng PestControl', '001071008888', '0918889900', 4, 54, '2026-03-21 16:00:00', N'Phun thuốc diệt gián và mối định kỳ.'),

-- CĂN 5 (Thêm thợ)
(N'Điện Nước 24/7', '038088001111', '0941112222', 5, 5, '2026-03-22 21:00:00', N'Sửa sự cố chập điện ổ cắm phòng khách (Khẩn cấp).'),
(N'Thợ Sàn Gỗ Toàn Thắng', '038089002222', '0942223333', 5, 58, '2026-03-23 09:30:00', N'Xử lý sàn gỗ bị phồng do ngấm nước mưa.'),

-- CĂN 6 (Thêm thợ)
(N'Thông Tắc Cống - Anh Hùng', '079099003333', '0923334444', 6, 5, '2026-03-24 10:45:00', N'Thông tắc bồn cầu và đường ống thoát sàn.'),
(N'Kỹ thuật Daikin', '079100004444', '0924445555', 6, 56, '2026-03-25 14:20:00', N'Bảo trì định kỳ hệ thống điều hòa Multi.'),

-- PHÂN TÁCH TIẾP CHO CÁC CĂN (Gen ngẫu nhiên cho đủ số lượng)
(N'Thợ Trần Thạch Cao', '001095009999', '0966998877', 1, 49, '2026-03-26 08:30:00', N'Vá lỗ khoét trần thạch cao sau khi sửa ống.'),
(N'Lắp Đặt Giàn Phơi', '001096008888', '0966887766', 2, 51, '2026-03-26 09:00:00', N'Lắp giàn phơi thông minh ngoài ban công.'),
(N'Kính Cường Lực', '001097007777', '0966776655', 3, 53, '2026-03-26 09:30:00', N'Lắp vách kính phòng tắm đứng.'),
(N'Đá Hoa Cương Thành Công', '001098006666', '0966665544', 4, 55, '2026-03-26 10:00:00', N'Ốp lại mặt đá bếp bị nứt.'),
(N'Kỹ thuật Camera', '001099005555', '0966554433', 5, 57, '2026-03-26 10:30:00', N'Lắp đặt camera IP trong căn hộ.'),
(N'Giúp Việc Theo Giờ - JupViec', '001100004444', '0966443322', 6, 58, '2026-03-26 11:00:00', N'Nhân viên dọn dẹp vệ sinh căn hộ định kỳ.'),
(N'Thợ Sửa Khóa Vương', '001101003333', '0966332211', 1, 5, '2026-03-26 11:30:00', N'Chủ nhà quên mã số, hỗ trợ mở khóa cửa.'),
(N'Kỹ thuật Ariston', '001102002222', '0966221100', 2, 50, '2026-03-26 13:00:00', N'Kiểm tra bình nóng lạnh không ra nước nóng.'),
(N'Thợ May Bọc Ghế Sofa', '001103001111', '0966110099', 3, 5, '2026-03-26 13:30:00', N'Đến lấy mẫu vải để bọc lại bộ Sofa.'),
(N'Vệ Sinh Máy Giặt', '001104000000', '0966009988', 4, 52, '2026-03-26 14:00:00', N'Vệ sinh lồng giặt cửa ngang.'),
(N'Thợ Lưới An Toàn', '001105009876', '0966987654', 5, 5, '2026-03-26 14:30:00', N'Lắp lưới an toàn ban công cho trẻ nhỏ.'),
(N'Kỹ thuật Khóa Yale', '001106008765', '0966876543', 6, 54, '2026-03-26 15:00:00', N'Cài đặt thêm vân tay cho người giúp việc.'),
(N'Thợ Hàn Inox', '001107007654', '0966765432', 1, 56, '2026-03-26 15:30:00', N'Hàn lại chân giá kệ máy giặt.'),
(N'Kỹ thuật SmartHome', '001108006543', '0966654321', 2, 5, '2026-03-26 16:00:00', N'Cấu hình lại hệ thống đèn thông minh.'),
(N'Thợ Đắp Phào Chỉ', '001109005432', '0966543210', 3, 58, '2026-03-26 16:30:00', N'Trang trí phào chỉ tân cổ điển phòng khách.');
GO


DECLARE @CurrentId INT = 1;
DECLARE @MaxId INT = 58;

WHILE @CurrentId <= @MaxId
BEGIN
    -- 1. Thông báo Hệ thống (SYSTEM)
    INSERT INTO Notifications (ReceiverId, TargetRole, Title, Message, Type, IsRead, CreatedAt, RelatedUrl)
    VALUES (
        @CurrentId, NULL, 
        N'Bảo trì hệ thống định kỳ', 
        N'Hệ thống TEMS sẽ tiến hành bảo trì máy chủ vào lúc 01:00 AM ngày 30/03. Vui lòng đăng xuất trước thời gian này.', 
        'SYSTEM', 0, '2026-03-24 08:00:00', NULL
    );

    -- 2. Thông báo Thanh toán (PAYMENT)
    INSERT INTO Notifications (ReceiverId, TargetRole, Title, Message, Type, IsRead, CreatedAt, RelatedUrl)
    VALUES (
        @CurrentId, NULL, 
        N'Nhắc nhở thanh toán hóa đơn', 
        N'Hệ thống ghi nhận bạn có hóa đơn dịch vụ tháng 02 chưa được đối soát hoàn toàn. Vui lòng kiểm tra lại mục Hóa đơn.', 
        'PAYMENT', 0, '2026-03-25 10:30:00', NULL
    );

    -- 3. Thông báo Hợp đồng/Quy định (CONTRACT)
    INSERT INTO Notifications (ReceiverId, TargetRole, Title, Message, Type, IsRead, CreatedAt, RelatedUrl)
    VALUES (
        @CurrentId, NULL, 
        N'Cập nhật nội quy tòa nhà', 
        N'Ban quản lý vừa cập nhật quy định về việc nuôi thú cưng và sử dụng khu vực sinh hoạt chung. Vui lòng xem chi tiết tại văn phòng.', 
        'CONTRACT', 0, '2026-03-26 09:15:00', NULL
    );

    SET @CurrentId = @CurrentId + 1;
END;
GO

CREATE TABLE GetInTouch (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    -- Thông tin khách hàng cung cấp
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    [Message] NVARCHAR(MAX) NOT NULL,
    -- Audit log
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- BATCH 14.4: 50 RECORDS - DATA TEST CHUẨN CÔNG TY
-- 20 Spam/Nghịch - 30 Khách hàng tiềm năng
-- =============================================

DECLARE @i INT = 1;

WHILE @i <= 50
BEGIN
    INSERT INTO GetInTouch (FullName, Email, PhoneNumber, [Message], CreatedAt)
    VALUES (
        -- Tên khách hàng
        CASE 
            WHEN @i <= 20 THEN N'User_Test_' + CAST(@i AS NVARCHAR)
            ELSE N'Nguyễn ' + 
                 CASE WHEN @i % 3 = 0 THEN N'Văn ' WHEN @i % 3 = 1 THEN N'Thị ' ELSE N'Hoàng ' END + 
                 CAST(@i AS NVARCHAR)
        END,
        
        -- Email
        CASE 
            WHEN @i <= 20 THEN 'test.spam.' + CAST(@i AS VARCHAR) + '@trashmail.com'
            ELSE 'khachhang.' + CAST(@i AS VARCHAR) + '@gmail.com'
        END,
        
        -- Số điện thoại
        CASE 
            WHEN @i <= 20 THEN '000000000' + CAST(@i % 10 AS VARCHAR)
            ELSE '09' + CAST(10000000 + @i AS VARCHAR)
        END,
        
        -- Nội dung Message
        CASE 
            -- Nhóm 20 cái "Spam/Nghịch" (Giảm hài, tăng tính thực tế của rác hệ thống)
            WHEN @i BETWEEN 1 AND 5 THEN N'asdfghjklqwertyuiop' -- Spam phím
            WHEN @i BETWEEN 6 AND 10 THEN N'Check check 1 2 3...' -- Dev test
            WHEN @i BETWEEN 11 AND 15 THEN N'Dịch vụ tăng like, tăng sub giá rẻ liên hệ 0123...' -- Quảng cáo rác
            WHEN @i BETWEEN 16 AND 20 THEN N'................................' -- Khách ghost
            
            -- Nhóm 30 cái "Nghiêm túc" (Hẳn hoi)
            WHEN @i BETWEEN 21 AND 30 THEN N'Tôi muốn nhận thông tin về phí quản lý hằng tháng của tòa S1.'
            WHEN @i BETWEEN 31 AND 40 THEN N'Vui lòng gửi bảng báo giá các căn Studio hướng Đông cho tôi.'
            WHEN @i BETWEEN 41 AND 45 THEN N'Sân Tennis số 3 khi nào bảo trì xong vậy admin?'
            ELSE N'Tôi muốn đăng ký xem nhà thực tế căn Shophouse vào cuối tuần này.'
        END,
        
        -- Thời gian
        DATEADD(MINUTE, -@i * 30, GETDATE())
    );
    
    SET @i = @i + 1;
END
GO

-- =============================================
-- BATCH 21: TẠO 50 HỢP ĐỒNG MUA BÁN (SALE)
-- ApartmentId: 10 -> 59
-- AccountId (Người mua): 59 -> 108
-- CreatedById: Random từ {3, 29-38}
-- =============================================

DECLARE @i INT = 0; -- Biến chạy từ 0 đến 49
DECLARE @StaffId INT;
DECLARE @CreatedDate DATETIME;
DECLARE @StartDate DATE;

-- Bảng tạm chứa danh sách Staff ID có quyền tạo hợp đồng
DECLARE @StaffList TABLE (SId INT);
INSERT INTO @StaffList VALUES (3), (29), (30), (31), (32), (33), (34), (35), (36), (37), (38);

WHILE @i < 50
BEGIN
    -- Lấy ngẫu nhiên 1 Staff phụ trách tạo hợp đồng
    SELECT TOP 1 @StaffId = SId FROM @StaffList ORDER BY NEWID();

    -- Gen ngày tạo trong tháng 12/2025 (từ ngày 01 đến ngày 25)
    SET @CreatedDate = DATEADD(DAY, ABS(CHECKSUM(NEWID()) % 25), '2025-12-01 08:00:00');
    
    -- Ngày hiệu lực (StartDate) sau ngày tạo từ 1-5 ngày
    SET @StartDate = DATEADD(DAY, ABS(CHECKSUM(NEWID()) % 5) + 1, @CreatedDate);

    INSERT INTO Contracts (
        ApartmentId, 
        AccountId, 
        ContractType, 
        StartDate, 
        EndDate, 
        MonthlyRent, 
        [Status], 
        CreatedAt, 
        CreatedById
    )
    VALUES (
        10 + @i,      -- ApartmentId bắt đầu từ 10
        59 + @i,      -- AccountId bắt đầu từ 59
        N'Sale',      -- Loại hợp đồng: Mua đứt
        @StartDate,   -- Ngày hiệu lực
        NULL,         -- Mua đứt nên không có ngày hết hạn
        0.00,         -- Không phát sinh tiền thuê hàng tháng
        1,            -- Trạng thái: Hiệu lực
        @CreatedDate, -- Ngày tạo record
        @StaffId      -- Staff tạo
    );

    SET @i = @i + 1;
END
GO

UPDATE A
SET A.[Status] = 1
FROM Apartments A
INNER JOIN Contracts C ON A.Id = C.ApartmentId
WHERE C.[Status] = 1                         -- Hợp đồng đang hiệu lực
  AND C.StartDate <= GETDATE()              -- Đã đến ngày bắt đầu
  AND (C.EndDate IS NULL OR C.EndDate >= GETDATE()); -- Chưa hết hạn hoặc mua đứt
GO

INSERT INTO StayAtHistory (ResidentId, ApartmentId, MoveIn, MoveOut)
SELECT 
    R.Id,           -- ResidentId (Lấy từ bảng Residents)
    C.ApartmentId,  -- ApartmentId (Lấy từ bảng Contracts)
    C.StartDate,    -- MoveIn (Lấy chính xác ngày StartDate của hợp đồng)
    NULL            -- MoveOut (Để NULL vì đang ở)
FROM Contracts C
INNER JOIN Residents R ON C.AccountId = R.AccountId
WHERE C.ContractType = N'Sale' 
  AND C.[Status] = 1; -- Chỉ lấy những hợp đồng đang có hiệu lực
GO

-- 2.2 Lưu Iot_syn - fake data

-- 2.2.1. Tạo danh sách 3 mốc thời gian: Ngày đầu tháng 1, 2, 3 năm 2026
WITH MonthSeries AS (
    SELECT DATEFROMPARTS(2026, 1, 1) AS CheckDate, 1 AS MonthIndex -- Chốt cho tháng 12/2025
    UNION ALL
    SELECT DATEFROMPARTS(2026, 2, 1), 2                             -- Chốt cho tháng 01/2026
    UNION ALL
    SELECT DATEFROMPARTS(2026, 3, 1), 3                             -- Chốt cho tháng 02/2026
)
-- Add data cho tất cả các căn phòng. - miễn sao phòng đấy đang có người :))) - Mình tạm thời chỉ để mua trước đã cho dễ quản lý. 
-- 2.2.2 Phóng dữ liệu vào bảng IoT_Sync_Logs cho các căn đã có chủ (Status = 1)
INSERT INTO IoT_Sync_Logs (ApartmentId, ElectricityEndNum, WaterEndNum, LogDate)
SELECT 
    a.Id AS ApartmentId,
    -- Số điện tăng tiến: (Tháng * 300) + Random 50-100
    CAST((m.MonthIndex * 300) + (ABS(CHECKSUM(NEWID())) % 51 + 50) AS DECIMAL(10,2)),
    -- Số nước tăng tiến: (Tháng * 15) + Random 1-5
    CAST((m.MonthIndex * 15) + (ABS(CHECKSUM(NEWID())) % 5 + 1) AS DECIMAL(10,2)),
    m.CheckDate
FROM Apartments a
CROSS JOIN MonthSeries m
WHERE a.Status = 1;
GO


--3.2.1 -- tháng 1
-- Tính hóa đơn tháng 01/2026 (Xuất vào ngày 02/02/2026)
INSERT INTO UtilitiesInvoices (ApartmentId, BillingMonth, BillingYear, TotalElectricUsed, TotalWaterUsed, TotalAmount, Status, CreatedAt)
SELECT 
    Curr.ApartmentId,
    1 AS BillingMonth,
    2026 AS BillingYear,
    (Curr.ElectricityEndNum - ISNULL(Prev.ElectricityEndNum, 0)) AS ElecUsed,
    (Curr.WaterEndNum - ISNULL(Prev.WaterEndNum, 0)) AS WaterUsed,
    ( (Curr.ElectricityEndNum - ISNULL(Prev.ElectricityEndNum, 0)) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'ELEC_01') ) +
    ( (Curr.WaterEndNum - ISNULL(Prev.WaterEndNum, 0)) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'WAT_01') ) +
    ( (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'MNG_FEE') ) AS TotalAmount,
    0 AS Status,
    DATEFROMPARTS(2026, 2, 2) AS CreatedAt -- Hóa đơn T1 được tạo vào mùng 2 tháng 2
FROM 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-02-01') AS Curr
LEFT JOIN 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-01-01') AS Prev 
    ON Curr.ApartmentId = Prev.ApartmentId;
GO

--3.2.2 -- tháng 12 năm ngoái
-- =============================================
-- BATCH 3.1: XUẤT HÓA ĐƠN THÁNG 12/2025 (TẠO NGÀY 02/01/2026)
-- =============================================
INSERT INTO UtilitiesInvoices (ApartmentId, BillingMonth, BillingYear, TotalElectricUsed, TotalWaterUsed, TotalAmount, Status, CreatedAt)
SELECT 
    Curr.ApartmentId,
    12 AS BillingMonth, -- Hóa đơn cho tháng 12
    2025 AS BillingYear,
    (Curr.ElectricityEndNum - 0) AS ElecUsed, -- Tháng đầu tiên coi như từ 0
    (Curr.WaterEndNum - 0) AS WaterUsed,
    ( (Curr.ElectricityEndNum - 0) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'ELEC_01') ) +
    ( (Curr.WaterEndNum - 0) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'WAT_01') ) +
    ( (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'MNG_FEE') ) AS TotalAmount,
    0 AS Status,
    DATEFROMPARTS(2026, 1, 2) AS CreatedAt -- Tạo vào mùng 2 tháng 1
FROM 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-01-01') AS Curr;
GO

--3.2.2 -- tháng 2 
-- =============================================
-- BATCH 3.2: XUẤT HÓA ĐƠN THÁNG 02/2026 (TẠO NGÀY 02/03/2026)
-- =============================================
INSERT INTO UtilitiesInvoices (ApartmentId, BillingMonth, BillingYear, TotalElectricUsed, TotalWaterUsed, TotalAmount, Status, CreatedAt)
SELECT 
    Curr.ApartmentId,
    2 AS BillingMonth, -- Hóa đơn cho tháng 2
    2026 AS BillingYear,
    (Curr.ElectricityEndNum - Prev.ElectricityEndNum) AS ElecUsed,
    (Curr.WaterEndNum - Prev.WaterEndNum) AS WaterUsed,
    ( (Curr.ElectricityEndNum - Prev.ElectricityEndNum) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'ELEC_01') ) +
    ( (Curr.WaterEndNum - Prev.WaterEndNum) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'WAT_01') ) +
    ( (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'MNG_FEE') ) AS TotalAmount,
    0 AS Status,
    DATEFROMPARTS(2026, 3, 2) AS CreatedAt -- Tạo vào mùng 2 tháng 3
FROM 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-03-01') AS Curr
JOIN 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-02-01') AS Prev 
    ON Curr.ApartmentId = Prev.ApartmentId;
GO


-- =============================================
-- BATCH 22.2: FIX LỖI VÀ TẠO CHI PHÍ BỰA
-- =============================================

DECLARE @i INT = 10;
DECLARE @ReasonId INT;
DECLARE @StaffId INT;

-- 1. Tạo bảng tạm chứa lý do
DECLARE @BuaReasons TABLE (
    Id INT IDENTITY(1,1), 
    Title NVARCHAR(200), 
    DescDetail NVARCHAR(MAX), 
    MinPrice DECIMAL(18,2)
);

-- 2. Chèn 10 lý do bất hủ (Đã fix lỗi cú pháp)
INSERT INTO @BuaReasons (Title, DescDetail, MinPrice)
VALUES 
(N'Phí phạt hát Karaoke quá giờ', N'Hát bài "Cắt đôi nỗi sầu" lúc 2 giờ sáng làm cả tầng mất ngủ.', 500000),
(N'Phí dắt lợn cảnh đi thang máy', N'Lợn làm bẩn sàn thang máy S2, cần thuê đội khử mùi chuyên sâu.', 200000),
(N'Phí "Ship hộ" sầu riêng', N'BQL hỗ trợ khênh 10 thùng sầu riêng lên tầng 20 giúp cư dân.', 150000),
(N'Tiền đền bù vỡ kính sảnh', N'Cư dân mải nhìn gái xinh đập đầu vào cửa kính làm nứt kính.', 1200000),
(N'Phí cứu hộ mèo trên cây', N'Kỹ thuật dùng thang dây cứu mèo của cư dân bị kẹt 3 ngày.', 300000),
(N'Phí xử lý mùi mắm tôm', N'Nấu mắm tôm không bật máy hút mùi làm cả tầng ngất ngây.', 100000),
(N'Phí phạt sạc xe điện trong nhà', N'Vi phạm quy định PCCC nghiêm trọng.', 2000000),
(N'Phí thuê loa kéo quẩy party', N'Mượn loa BQL tổ chức sinh nhật tại khu BBQ.', 400000),
(N'Tiền thông tắc bồn cầu (Vỏ sầu)', N'Phát hiện vỏ sầu riêng trong đường ống thoát nước.', 600000),
(N'Phí trông trẻ (Lễ tân hộ)', N'Trông hộ bé con để mẹ xuống sảnh nhận trà sữa.', 50000);

-- 3. Vòng lặp chèn dữ liệu
WHILE @i <= 59
BEGIN
    -- Lấy ngẫu nhiên lý do từ 1 đến 10
    SET @ReasonId = (ABS(CHECKSUM(NEWID())) % 10) + 1;
    
    -- Lấy ngẫu nhiên Staff ID từ danh sách Nghĩa đưa
    SELECT TOP 1 @StaffId = SId 
    FROM (VALUES (3),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38)) AS Staff(SId) 
    ORDER BY NEWID();

    -- Thực hiện INSERT
    INSERT INTO Expenses (Title, Description, ApartmentId, CreatedBy, Amount, ExpenseDate, [Status])
    SELECT 
        Title, 
        DescDetail + N' (Ghi chú: Cư dân hứa không tái phạm. Hẹ hẹ.)', 
        @i, 
        @StaffId, 
        MinPrice + (ABS(CHECKSUM(NEWID()) % 5) * 20000), -- Tăng ngẫu nhiên tí tiền
        '2026-03-25', 
        0
    FROM @BuaReasons 
    WHERE Id = @ReasonId;

    SET @i = @i + 1;
END
GO

INSERT INTO Complaints (Content, MadeByUserId, CreatedAt)
VALUES 
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 59)', 59, '2026-03-25 21:53:00'),
(N'Tại sao tôi nấu mắm tôm lại bị phạt? Đây là tinh túy ẩm thực dân tộc! Tôi sẽ kiện lên phường! (Gửi từ cư dân tài khoản 60)', 60, '2026-03-26 01:28:00'),
(N'Tại sao tôi lại bị phạt phí hát Karaoke? Tôi chỉ bật loa nghe kinh phật lúc 2h sáng thôi mà? BQL xem lại đi! (Gửi từ cư dân tài khoản 61)', 61, '2026-03-26 06:23:00'),
(N'Tại sao tôi lại bị phạt phí hát Karaoke? Tôi chỉ bật loa nghe kinh phật lúc 2h sáng thôi mà? BQL xem lại đi! (Gửi từ cư dân tài khoản 62)', 62, '2026-03-26 04:05:00'),
(N'Tại sao không cho tôi sạc xe điện trong nhà? Tôi hứa sẽ canh chừng mà, sạc ở hầm bất tiện lắm! (Gửi từ cư dân tài khoản 63)', 63, '2026-03-25 14:42:00'),
(N'Tôi yêu cầu kiểm tra lại camera, tôi đập đầu vào kính là do kính quá trong suốt, lỗi tại BQL lau kính quá sạch! (Gửi từ cư dân tài khoản 64)', 64, '2026-03-25 11:35:00'),
(N'Bảo vệ tòa nhà nhìn tôi hơi kỹ mỗi khi tôi đi nhậu về muộn, tôi cảm thấy bị xâm phạm quyền riêng tư! (Gửi từ cư dân tài khoản 65)', 65, '2026-03-25 09:58:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 66)', 66, '2026-03-25 10:49:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 67)', 67, '2026-03-25 10:15:00'),
(N'Con lợn cảnh của tôi nó sạch hơn cả cái thang máy này, tại sao lại thu phí khử mùi? Vô lý hết sức! (Gửi từ cư dân tài khoản 68)', 68, '2026-03-26 00:54:00'),
(N'Hóa đơn tiền nước tháng này cao bất thường, tôi nghi ngờ hàng xóm đấu trộm vòi sang nhà tôi. (Gửi từ cư dân tài khoản 69)', 69, '2026-03-25 21:03:00'),
(N'Phí cứu hộ mèo 300k là quá đắt! Con mèo nó tự trèo xuống được, anh kỹ thuật chỉ đứng nhìn thôi mà? (Gửi từ cư dân tài khoản 70)', 70, '2026-03-26 03:21:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 71)', 71, '2026-03-26 07:08:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 72)', 72, '2026-03-25 22:51:00'),
(N'Lễ tân trông trẻ hộ có 1 tiếng mà thu 50k? Đắt hơn cả grab, tôi không chấp nhận hóa đơn này. (Gửi từ cư dân tài khoản 73)', 73, '2026-03-25 19:50:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 74)', 74, '2026-03-25 23:53:00'),
(N'Lễ tân trông trẻ hộ có 1 tiếng mà thu 50k? Đắt hơn cả grab, tôi không chấp nhận hóa đơn này. (Gửi từ cư dân tài khoản 75)', 75, '2026-03-25 09:34:00'),
(N'Con lợn cảnh của tôi nó sạch hơn cả cái thang máy này, tại sao lại thu phí khử mùi? Vô lý hết sức! (Gửi từ cư dân tài khoản 76)', 76, '2026-03-25 19:47:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 77)', 77, '2026-03-25 17:16:00'),
(N'Bảo vệ tòa nhà nhìn tôi hơi kỹ mỗi khi tôi đi nhậu về muộn, tôi cảm thấy bị xâm phạm quyền riêng tư! (Gửi từ cư dân tài khoản 78)', 78, '2026-03-25 16:52:00'),
(N'Lễ tân trông trẻ hộ có 1 tiếng mà thu 50k? Đắt hơn cả grab, tôi không chấp nhận hóa đơn này. (Gửi từ cư dân tài khoản 79)', 79, '2026-03-25 13:54:00'),
(N'Hóa đơn tiền nước tháng này cao bất thường, tôi nghi ngờ hàng xóm đấu trộm vòi sang nhà tôi. (Gửi từ cư dân tài khoản 80)', 80, '2026-03-26 01:59:00'),
(N'Tại sao không cho tôi sạc xe điện trong nhà? Tôi hứa sẽ canh chừng mà, sạc ở hầm bất tiện lắm! (Gửi từ cư dân tài khoản 81)', 81, '2026-03-25 08:39:00'),
(N'Đề nghị lắp thêm gương trong thang máy để tôi còn check-in, thang máy gì mà tối như hũ nút. (Gửi từ cư dân tài khoản 82)', 82, '2026-03-25 10:32:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 83)', 83, '2026-03-25 15:32:00'),
(N'Tại sao không cho tôi sạc xe điện trong nhà? Tôi hứa sẽ canh chừng mà, sạc ở hầm bất tiện lắm! (Gửi từ cư dân tài khoản 84)', 84, '2026-03-25 20:51:00'),
(N'Phí cứu hộ mèo 300k là quá đắt! Con mèo nó tự trèo xuống được, anh kỹ thuật chỉ đứng nhìn thôi mà? (Gửi từ cư dân tài khoản 85)', 85, '2026-03-25 09:35:00'),
(N'Lễ tân trông trẻ hộ có 1 tiếng mà thu 50k? Đắt hơn cả grab, tôi không chấp nhận hóa đơn này. (Gửi từ cư dân tài khoản 86)', 86, '2026-03-25 23:20:00'),
(N'Phí cứu hộ mèo 300k là quá đắt! Con mèo nó tự trèo xuống được, anh kỹ thuật chỉ đứng nhìn thôi mà? (Gửi từ cư dân tài khoản 87)', 87, '2026-03-25 08:12:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 88)', 88, '2026-03-25 15:46:00'),
(N'Tại sao không cho tôi sạc xe điện trong nhà? Tôi hứa sẽ canh chừng mà, sạc ở hầm bất tiện lắm! (Gửi từ cư dân tài khoản 89)', 89, '2026-03-25 10:13:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 90)', 90, '2026-03-26 01:21:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 91)', 91, '2026-03-25 16:00:00'),
(N'Nhà tầng trên làm gì mà cứ 12h đêm là có tiếng kéo ghế với tiếng bi sắt rơi thế? Đề nghị xử lý gấp! (Gửi từ cư dân tài khoản 92)', 92, '2026-03-25 12:15:00'),
(N'Con lợn cảnh của tôi nó sạch hơn cả cái thang máy này, tại sao lại thu phí khử mùi? Vô lý hết sức! (Gửi từ cư dân tài khoản 93)', 93, '2026-03-25 23:47:00'),
(N'Con lợn cảnh của tôi nó sạch hơn cả cái thang máy này, tại sao lại thu phí khử mùi? Vô lý hết sức! (Gửi từ cư dân tài khoản 94)', 94, '2026-03-25 10:59:00'),
(N'Đề nghị lắp thêm gương trong thang máy để tôi còn check-in, thang máy gì mà tối như hũ nút. (Gửi từ cư dân tài khoản 95)', 95, '2026-03-26 02:07:00'),
(N'Đề nghị lắp thêm gương trong thang máy để tôi còn check-in, thang máy gì mà tối như hũ nút. (Gửi từ cư dân tài khoản 96)', 96, '2026-03-25 22:52:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 97)', 97, '2026-03-25 12:27:00'),
(N'Tôi yêu cầu kiểm tra lại camera, tôi đập đầu vào kính là do kính quá trong suốt, lỗi tại BQL lau kính quá sạch! (Gửi từ cư dân tài khoản 98)', 98, '2026-03-25 23:16:00'),
(N'Tôi yêu cầu kiểm tra lại camera, tôi đập đầu vào kính là do kính quá trong suốt, lỗi tại BQL lau kính quá sạch! (Gửi từ cư dân tài khoản 99)', 99, '2026-03-26 06:07:00'),
(N'Lễ tân trông trẻ hộ có 1 tiếng mà thu 50k? Đắt hơn cả grab, tôi không chấp nhận hóa đơn này. (Gửi từ cư dân tài khoản 100)', 100, '2026-03-26 06:39:00'),
(N'Tôi yêu cầu kiểm tra lại camera, tôi đập đầu vào kính là do kính quá trong suốt, lỗi tại BQL lau kính quá sạch! (Gửi từ cư dân tài khoản 101)', 101, '2026-03-26 05:42:00'),
(N'Con lợn cảnh của tôi nó sạch hơn cả cái thang máy này, tại sao lại thu phí khử mùi? Vô lý hết sức! (Gửi từ cư dân tài khoản 102)', 102, '2026-03-26 00:14:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 103)', 103, '2026-03-25 23:19:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 104)', 104, '2026-03-26 05:02:00'),
(N'Căn hộ bên cạnh nuôi chó sủa ầm ĩ, tôi yêu cầu BQL cách âm lại tường cho nhà tôi miễn phí. (Gửi từ cư dân tài khoản 105)', 105, '2026-03-26 00:21:00'),
(N'Con lợn cảnh của tôi nó sạch hơn cả cái thang máy này, tại sao lại thu phí khử mùi? Vô lý hết sức! (Gửi từ cư dân tài khoản 106)', 106, '2026-03-25 21:07:00'),
(N'Lễ tân trông trẻ hộ có 1 tiếng mà thu 50k? Đắt hơn cả grab, tôi không chấp nhận hóa đơn này. (Gửi từ cư dân tài khoản 107)', 107, '2026-03-25 21:43:00'),
(N'Bảo vệ tòa nhà nhìn tôi hơi kỹ mỗi khi tôi đi nhậu về muộn, tôi cảm thấy bị xâm phạm quyền riêng tư! (Gửi từ cư dân tài khoản 108)', 108, '2026-03-25 21:12:00');
GO

DECLARE @ComplaintId INT = 20;
DECLARE @StaffId INT;
DECLARE @ReplyContent NVARCHAR(MAX);
DECLARE @ComplaintText NVARCHAR(MAX);
DECLARE @CreatedAt DATETIME;

WHILE @ComplaintId <= 66
BEGIN
    -- 1. Lấy ngẫu nhiên Staff ID phản hồi
    SELECT TOP 1 @StaffId = SId 
    FROM (VALUES (3),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38)) AS Staff(SId) 
    ORDER BY NEWID();

    -- 2. Lấy nội dung khiếu nại và ngày tạo để tính ngày Rep
    SELECT @ComplaintText = Content, @CreatedAt = CreatedAt 
    FROM Complaints WHERE Id = @ComplaintId;

    -- 3. Logic chọn nội dung Rep dựa trên từ khóa trong khiếu nại
    SET @ReplyContent = CASE 
        WHEN @ComplaintText LIKE N'%chó sủa%' THEN N'BQL đã ghi nhận và làm việc với chủ hộ nuôi thú cưng. Về việc cách âm, đây là kết cấu tòa nhà nên BQL không thể hỗ trợ miễn phí. Mong cư dân thông cảm.'
        WHEN @ComplaintText LIKE N'%mắm tôm%' THEN N'Mắm tôm là tinh túy nhưng mùi hương hơi quá đà ảnh hưởng hàng xóm. BQL giữ nguyên mức phạt để đảm bảo không gian chung.'
        WHEN @ComplaintText LIKE N'%Karaoke%' OR @ComplaintText LIKE N'%kinh phật%' THEN N'Âm thanh sau 22h đều tính là vi phạm tiếng ồn, bất kể nội dung là gì. Cư dân vui lòng dùng tai nghe hoặc giảm âm lượng nhé.'
        WHEN @ComplaintText LIKE N'%xe điện%' THEN N'Quy định PCCC của thành phố nghiêm cấm sạc xe điện tại căn hộ. Cư dân vui lòng xuống hầm để đảm bảo an toàn cháy nổ cho cả tòa nhà.'
        WHEN @ComplaintText LIKE N'%lau kính%' OR @ComplaintText LIKE N'%camera%' THEN N'Cảm ơn lời khen của cư dân về việc vệ sinh kính. Tuy nhiên, cư dân vui lòng quan sát kỹ khi di chuyển để tránh chấn thương.'
        WHEN @ComplaintText LIKE N'%nhậu về muộn%' OR @ComplaintText LIKE N'%riêng tư%' THEN N'Bảo vệ chỉ đang thực hiện đúng quy trình quan sát an ninh. Nếu cư dân thấy phiền, BQL sẽ nhắc nhở bộ phận an ninh điều chỉnh thái độ.'
        WHEN @ComplaintText LIKE N'%bi sắt%' OR @ComplaintText LIKE N'%kéo ghế%' THEN N'BQL sẽ gửi thông báo nhắc nhở hộ tầng trên kiểm tra lại việc di chuyển đồ đạc vào ban đêm.'
        WHEN @ComplaintText LIKE N'%lợn cảnh%' THEN N'Thang máy là khu vực công cộng, việc thú cưng gây mùi cần được xử lý triệt để. Phí này dùng để thuê đơn vị khử khuẩn chuyên dụng.'
        WHEN @ComplaintText LIKE N'%tiền nước%' THEN N'Kỹ thuật sẽ qua kiểm tra đồng hồ nước nhà bạn vào sáng mai. Cư dân vui lòng có mặt tại nhà nhé.'
        WHEN @ComplaintText LIKE N'%mèo%' THEN N'Việc dùng thiết bị chuyên dụng và nhân sự kỹ thuật có chi phí vận hành riêng. Mức phí này đã được quy định trong danh mục cứu hộ.'
        WHEN @ComplaintText LIKE N'%trông trẻ%' THEN N'Đây là dịch vụ hỗ trợ ngoài giờ của lễ tân, không thuộc quản lý trực tiếp của tòa nhà. Cư dân vui lòng tự thỏa thuận với nhân viên.'
        WHEN @ComplaintText LIKE N'%gương%' THEN N'BQL đã tiếp nhận góp ý và sẽ xem xét lắp thêm gương vào đợt bảo trì quý tới. Chúc cư dân có những tấm ảnh check-in đẹp!'
        ELSE N'BQL đã tiếp nhận thông tin của cư dân và đang trong quá trình xác minh xử lý. Chúng tôi sẽ phản hồi chi tiết sớm nhất.'
    END;

    -- 4. INSERT vào bảng Replies (Ngày Rep sau 1-2 ngày)
    INSERT INTO Replies (Content, ComplaintId, RepliedByUserId, CreatedAt)
    VALUES (
        @ReplyContent + N' (Phản hồi từ Admin/Staff ID: ' + CAST(@StaffId AS NVARCHAR) + N')',
        @ComplaintId,
        @StaffId,
        DATEADD(HOUR, ABS(CHECKSUM(NEWID()) % 24) + 24, @CreatedAt) -- Cộng thêm 24-48 tiếng
    );

    SET @ComplaintId = @ComplaintId + 1;
END
GO

-- =============================================
-- BATCH 25: TẠO DỮ LIỆU ĐẶT DỊCH VỤ (BOOKING SERVICES)
-- Đảm bảo không trùng giờ trên cùng một ResourceId
-- =============================================

-- 1. Đặt sân Tennis số 1 (ResourceId = 4) cho hội dậy sớm tập thể dục
INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, [Status], TotalAmount)
VALUES 
(4, 59, '2026-03-20 08:00', '2026-03-26 06:00', '2026-03-26 08:00', 1, 200000), -- Ca 1
(4, 60, '2026-03-20 09:00', '2026-03-26 08:00', '2026-03-26 10:00', 1, 200000), -- Ca 2 (Nối tiếp)
(4, 61, '2026-03-21 10:00', '2026-03-26 16:00', '2026-03-26 18:00', 1, 250000); -- Ca chiều

-- 2. Đặt Vườn BBQ Khu A (ResourceId = 1) cho hội quẩy tối
INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, [Status], TotalAmount)
VALUES 
(1, 62, '2026-03-22 14:00', '2026-03-26 17:00', '2026-03-26 19:00', 1, 150000), -- Ca sớm
(1, 63, '2026-03-22 15:00', '2026-03-26 19:30', '2026-03-26 21:30', 1, 150000); -- Ca muộn (Nghỉ 30p dọn dẹp)

-- 3. Đặt Sân Golf Làn 1 (ResourceId = 7) cho các "Chủ tịch"
INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, [Status], TotalAmount)
VALUES 
(7, 64, '2026-03-24 07:00', '2026-03-26 09:00', '2026-03-26 11:00', 1, 500000),
(7, 65, '2026-03-24 08:00', '2026-03-26 13:00', '2026-03-26 15:00', 1, 500000);

-- 4. Hội trường S1 (ResourceId = 11) - Họp tổ dân phố hoặc sinh nhật
INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, [Status], TotalAmount)
VALUES 
(11, 66, '2026-03-20 10:00', '2026-03-27 18:00', '2026-03-27 21:00', 1, 1000000);

-- 5. Phòng Spa VIP 1 (ResourceId = 9) - Cư dân thư giãn
INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, [Status], TotalAmount)
VALUES 
(9, 67, '2026-03-25 20:00', '2026-03-26 14:00', '2026-03-26 15:30', 1, 300000),
(9, 68, '2026-03-25 21:00', '2026-03-26 16:00', '2026-03-26 17:30', 1, 300000);

-- 6. Tự động hóa tạo thêm 40 bản ghi khác cho các ngày khác nhau (Không trùng giờ)
DECLARE @AccId INT = 69;
DECLARE @ResId INT = 1;
DECLARE @DayOffset INT = 0;

WHILE @AccId <= 108
BEGIN
    INSERT INTO BookingServices (ResourceId, AccountId, BookAt, BookFrom, BookTo, [Status], TotalAmount)
    VALUES (
        @ResId, 
        @AccId, 
        DATEADD(DAY, -2, GETDATE()), 
        DATEADD(HOUR, 18, DATEADD(DAY, @DayOffset, '2026-03-28 00:00')), -- Book lúc 18h tối
        DATEADD(HOUR, 20, DATEADD(DAY, @DayOffset, '2026-03-28 00:00')), -- Kết thúc lúc 20h
        1, 
        200000
    );

    SET @AccId = @AccId + 1;
    SET @ResId = (@ResId % 15) + 1; -- Đảo qua các ResourceId từ 1-15
    IF @ResId = 6 SET @ResId = 7; -- Bỏ qua ResourceId 6 (đang bảo trì)
    
    -- Cứ mỗi 2 người đặt thì tăng thêm 1 ngày để tránh trùng giờ trên cùng 1 Resource
    IF @AccId % 2 = 0 SET @DayOffset = @DayOffset + 1; 
END
GO

DECLARE @BookingId INT = 17;
DECLARE @TotalAmount DECIMAL(18, 2);
DECLARE @BookDate DATETIME;
DECLARE @Status INT;
DECLARE @PayDate DATETIME;

WHILE @BookingId <= 66
BEGIN
    -- 1. Lấy số tiền và ngày đặt từ bảng BookingServices
    SELECT @TotalAmount = TotalAmount, @BookDate = BookAt 
    FROM BookingServices WHERE Id = @BookingId;

    -- 2. Giả lập trạng thái thanh toán (để data đa dạng)
    -- 70% Đã thanh toán (Status = 1), 30% Chưa thanh toán (Status = 0)
    SET @Status = CASE WHEN ABS(CHECKSUM(NEWID()) % 10) < 7 THEN 1 ELSE 0 END;

    -- 3. Nếu đã thanh toán thì ngày trả tiền là sau ngày Book 5-30 phút (cho nó thực tế)
    SET @PayDate = CASE 
        WHEN @Status = 1 THEN DATEADD(MINUTE, ABS(CHECKSUM(NEWID()) % 25) + 5, @BookDate)
        ELSE NULL 
    END;

    -- 4. INSERT vào bảng ServiceInvoices
    INSERT INTO ServiceInvoices (ServiceBookingId, Amount, [Status], PaymentDate, CreatedAt)
    VALUES (
        @BookingId, 
        @TotalAmount, 
        @Status, 
        @PayDate, 
        @BookDate -- Hóa đơn xuất ngay lúc cư dân bấm Book
    );

    SET @BookingId = @BookingId + 1;
END
GO


UPDATE UtilitiesInvoices
SET Status = 1
WHERE Status = 0;