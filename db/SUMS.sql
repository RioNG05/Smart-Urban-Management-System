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
    (N'BookingServices_U_02', N'Accept/Reject Booking Request'),
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
--bảng 2
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- role id
    RoleName NVARCHAR(50) NOT NULL UNIQUE, -- role name (Vd: 'ADMIN', 'RESIDENT')
);

-- Chèn dữ liệu cho bảng Roles (Bao gồm RoleName và ContextPath)
INSERT INTO Roles (RoleName)
VALUES 
(N'MANAGER'),      -- Toàn quyền hệ thống
(N'RESIDENT'),   -- Cư dân (Sử dụng App)
(N'STAFF_APARTMENT'),  -- Quản lý căn hộ, hợp đồng
(N'STAFF_SERVICE'),    -- Quản lý tiện ích, hóa đơn
(N'STAFF_SECURITY'),   -- An ninh, check-in khách,  khiếu nại
(N'USER');       -- Người dùng vãng lai/hết hạn hợp đồng
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
    'BookingServices_R_01', 
    'BookingServices_U_02'
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
    'BookingServices_R_01', 
    'BookingServices_U_02'
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


-- bảng 4
CREATE TABLE Accounts (
    Id INT IDENTITY(1,1) PRIMARY KEY,       -- accountid PK
    Email VARCHAR(100) NOT NULL UNIQUE,     -- email 
    Username VARCHAR(50) NOT NULL UNIQUE,   -- username
    Password VARCHAR(255) NOT NULL,         -- password (nên lưu dưới dạng Hash như BCrypt)
    PhoneNumber VARCHAR(15) NULL,           -- số điện thoại (cho phép null)
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
('staff.guard@tems.com','guardstaff', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 5, 1);    -- Nhân viên an ninh
GO

-- add thêm resident. 
-- Giả định RoleId = 2 là RESIDENT
INSERT INTO Accounts (Email, Username, Password, RoleId, IsActive)
VALUES 
('thao.tran@gmail.com', 'thao01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1),
('hoang.le@gmail.com','hoang01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1),
('lan.anh@gmail.com','lan01', '$2a$10$2t8T/IEmhhSuXuVFsqDhKeB5PUYq07eCrJuUJrVcLmrKSAn8co99W', 2, 1);
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
(N'Bếp nướng BBQ', 'BBQ', 2000000.00, N'Turn', N'Thuê khu vực nướng ngoài trời (tối đa 4 giờ). Bao gồm dụng cụ nướng và hỗ trợ nhóm than.'),
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

--thêm data
DECLARE @Floor INT = 1;
DECLARE @RoomIndex INT;

WHILE @Floor <= 10
BEGIN
    SET @RoomIndex = 1;
    WHILE @RoomIndex <= 12
    BEGIN
        INSERT INTO Apartments (RoomNumber, FloorNumber, Direction, Status, ApartmentTypeId)
        VALUES (
            (@Floor * 100) + @RoomIndex, -- RoomNumber: 101, 102... 201, 202...
            @Floor,                      -- FloorNumber
            CASE 
                WHEN @RoomIndex % 4 = 1 THEN N'Đông Nam'
                WHEN @RoomIndex % 4 = 2 THEN N'Tây Bắc'
                WHEN @RoomIndex % 4 = 3 THEN N'Tây Nam'
                ELSE N'Đông Bắc'
            END,                         -- Direction (Xoay vòng hướng)
            CASE 
                WHEN @RoomIndex % 3 = 0 THEN 1 
                ELSE 0 
            END,                         -- Status (Mix ngẫu nhiên 0 và 1)
            CASE 
                WHEN @RoomIndex BETWEEN 1 AND 3 THEN 1 -- Căn 01, 02, 03: Loại Studio
                WHEN @RoomIndex BETWEEN 4 AND 6 THEN 2 -- Căn 04, 05, 06: Loại 1PN
                WHEN @RoomIndex BETWEEN 7 AND 9 THEN 3 -- Căn 07, 08, 09: Loại 2PN
                ELSE 4                                 -- Căn 10, 11, 12: Loại 3PN
            END                          -- ApartmentTypeId (Cố định theo số đuôi phòng)
        );
        SET @RoomIndex = @RoomIndex + 1;
    END
    SET @Floor = @Floor + 1;
END
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
    CONSTRAINT FK_Visitor_Staff FOREIGN KEY (CreatedByStaffId) REFERENCES StaffInfo(Id)
);

-- 20 Appoinment
-- Note: Cái này do staff tạo nhé hehe - Change Request 10.
CREATE TABLE Appointments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Đối tượng khách hàng (Người nhận thông báo)
    UserId INT NOT NULL, 
    
    -- Nhân viên được giao nhiệm vụ gặp mặt
    AssignedTo INT NOT NULL, 
    
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
    ExpenseDate DATE DEFAULT GETDATE(), -- Ngày thực tế phát sinh chi phí
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
