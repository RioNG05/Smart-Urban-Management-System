USE master;
GO

-- 1. Kiểm tra và xóa Database nếu đã tồn tại
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SmartCity_DB')
BEGIN
    CREATE DATABASE SmartCity_DB;
END
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

-- Insert 4 complaints for Account IDs: 2, 6, 7, 8
INSERT INTO Complaints (Content, MadeByUserId, CreatedAt)
VALUES 
(N'The upstairs apartment frequently makes loud noises after 11 PM, affecting residents'' rest and sleep.', 2, GETDATE()),

(N'The hallway on the 7th floor has not been cleaned properly for the past 2 days.', 6, GETDATE()),

(N'Elevator in Block B experiences strong vibrations when moving between the 10th and 15th floors; technical inspection is required.', 7, GETDATE()),

(N'The lighting system in the basement motorbike parking area is broken, making it difficult to commute at night.', 8, GETDATE());
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
(N'Elevator Maintenance Notice - Block S1', 
N'Management Office informs that maintenance for elevator No. 2 in Block S1 will take place on March 15, 2024, from 00:00 to 04:00 AM. We apologize for this inconvenience.',
'https://tse4.mm.bing.net/th/id/OIP.WIHz1g556WcPRXcu3nbpDwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', 1),

(N'Weekend Food Festival', 
N'All residents are cordially invited to join the Food Festival at the BBQ area this weekend.', 
'https://nld.mediacdn.vn/291774122806476800/2022/8/25/le-hoi-am-thuc-anh-hoang-trieu22-16614300460151286487996.jpg', 1),

(N'Scheduled Pest Control Plan',
N'On Saturday morning (March 14, 2026), the management will conduct pest control spraying in hallways, basements, and common areas. Residents are advised to close windows and stay indoors during this time.', 
 'https://th.bing.com/th/id/R.8ce64a608b9ddfba419f579b41972c42?rik=cqTsV6Eq4cFSYg&pid=ImgRaw&r=0', 1),

(N'B1 Basement Lighting System Upgrade', 
 N'New LED sensor lights will be installed in the B1 basement from March 16 to March 18. Construction will not affect parking areas, but please proceed with caution near marked zones.', 
 'https://th.bing.com/th/id/R.fcbdd54c679a0511fa44735e3728ff91?rik=FuErExljl0HfuA&pid=ImgRaw&r=0', 1);
GO

-- 6-7. Clubs & Safety
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES 
(N'Grand Opening: The Sakura Table Tennis Club', 
N'To promote fitness and networking, the Table Tennis Club is now open on the 1st floor of Block S2. Residents are invited to register at 6:00 PM daily.', 
'https://tse1.mm.bing.net/th/id/OIP.5m7n2yXOj-HM6B1HzuFVeQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', 1),

(N'Routine Fire Safety Drill', 
N'On Sunday morning (March 20, 2026), Management will coordinate with local authorities for a fire drill. Simulated sirens will be used; please remain calm.', 
'https://tse3.mm.bing.net/th/id/OIP.EFtqYeJQYXxWfFTBTclBNwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', 1);

-- 8-10. Regulations & Events
INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES (N'Scheduled Power Outage for Substation Maintenance', 
N'To ensure stable operation during summer, the utility company will temporarily cut power in the lobby and basement areas from 01:00 to 03:00 AM on March 22, 2026.', 
'https://visaho.vn/upload_images/images/2022/03/30/bao-tri-dien-toa-nha-1-min.jpg', 1);

INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES (N'Reminder: Pet Ownership Regulations in Common Areas', 
N'Residents must use leashes and muzzles when bringing pets to public areas and ensure environmental hygiene. Violations will be handled according to building regulations.', 
'https://i.ebayimg.com/images/g/-9gAAOSwhV9mwF4j/s-l960.jpg', 1);

INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES (N'International Women''s Day Celebration - March 8th', 
N'Management sends best wishes to all female residents. On the morning of March 8th, every female resident passing through the lobby will receive a rose as a token of appreciation.', 
'https://tse4.mm.bing.net/th/id/OIP.5fntcb0-8rMEbyeRGa1zWgHaEo?rs=1&pid=ImgDetMain&o=7&rm=3', 1);
GO
-- =============================================
-- BATCH 16.1: BỔ SUNG 20 BÀI VIẾT NEWS (TỔNG 30)
-- Nội dung: Thông báo, Sự kiện, Mẹo vặt cư dân
-- =============================================

INSERT INTO News (Title, Content, ImageUrl, CreatedByUserId)
VALUES 
-- 11. Parking Fee Notice
(N'2026 Parking Fee Schedule Update', 
N'Effective April 1, 2026, motorbike parking fees remain unchanged, while fees for the second car onwards will undergo a slight adjustment. Please see the lobby bulletin board for details.', 
'https://tse4.mm.bing.net/th/id/OIP.p61hM9_C3eNcRQUo7dBZLAHaEd?rs=1&pid=ImgDetMain&o=7&rm=3', 1),

-- 12. Energy Saving Tips
(N'5 Tips to Save Electricity During Hot Season', 
N'Using light-colored curtains, performing regular AC maintenance, and utilizing natural light will significantly reduce your electricity bill.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQISs5eaae3w4Wx3-EcCNNpbiGTgef1eXuJSw&s', 1),

-- 13. Football Championship
(N'Opening Ceremony: TEMS Residents Football Championship', 
N'The tournament features 12 teams from blocks S1 and S2. The opening match kicks off at 3:00 PM this Saturday at the urban area football field.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWGK8uq1tHrb9BM-QnZbUicS3EXX7gPxCk4g&s', 1),

-- 14. Noise Regulation
(N'Reminder: Noise Regulations After 10:00 PM', 
N'To ensure a quiet environment for residents, please refrain from drilling, loud singing, or high-volume karaoke after 10:00 PM.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LLrL9hjmp1n69hd9eP97YfR8TeWSEmFWQw&s', 1),

-- 15. Swimming Class
(N'Free Swimming Classes for Resident Children', 
N'The "Safe Summer" program offers basic swimming lessons at the outdoor pool every Tuesday, Thursday, and Saturday morning.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS58alheI0CHjups94Qglyn-FLe2WJ8KhVOEw&s', 1),

-- 16. Water Filter Maintenance
(N'Scheduled Building Water Filtration System Inspection', 
N'The technical team will clean the freshwater tanks starting at 11:00 PM tonight. Water may appear slightly cloudy for the first 5-10 minutes after supply resumes.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-zgJHN8c2WERoRIiEL4DsZd9ea00scEu07w&s', 1),

-- 17. Green Exchange Day
(N'Green Living Festival: Exchange Old Batteries for Plants', 
N'Let''s protect the environment together by bringing used batteries to the reception desk in exchange for lovely succulent pots.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWtHe2KhjAQ0COD1uVf4i7GAjwZ_HN3Q5F6Q&s', 1),

-- 18. Fraud Warning
(N'Scam Alert: Impersonation of Utility Company Employees', 
N'Be aware of individuals calling to request electricity payments via personal accounts. Please only pay via the official App or at the bank.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftPfa1-Zg1q9DowvB0UntIgglpk0diXfpbw&s', 1),

-- 19. Investment Seminar
(N'Personal Finance Workshop for Young Residents', 
N'Leading speakers will share insights on optimizing cash flow and debt management next Wednesday evening at the community hall.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbZnh_YbJ6fcTKi2hnlMSouXnqBq7TgpSuaA&s', 1),

-- 20. Spa Promotion
(N'30% Off Herbal Massage at the Resident Spa', 
N'Welcoming new residents, the Spa (ID 9, 10) is offering deep discounts on skincare and acupressure packages throughout March.', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiVKcqyxJfwqZRbjBEvHSckx1Fmq93M1f3yw&s', 1),

-- 21-30. Quick Updates
(N'April Bulky Waste Collection Schedule', N'Residents wishing to dispose of old beds or cabinets, please register before April 5.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nzT8tYwc95h0r7tu8peoY5F6b_exo2lEdg&s', 1),
(N'Balcony Drainage Cleaning for Rainy Season', N'Management recommends checking balcony floor drains to prevent localized flooding.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_slxYfoxTTHdeAMQYgehv82AlpwBeJVEFzA&s', 1),
(N'S2 Lobby Yoga Club Recruiting Members', N'Early morning classes to refresh your mind, starting at 5:30 AM.', 'https://static.hotdeal.vn/images/822/822188/500x500/190116-khoa-hoc-yoga-8-buoi-tai-clb-yoga-newlife.jpg', 1),
(N'Yale Smart Lock Usage Guide', N'Video tutorial on how to change master codes and add fingerprints for domestic helpers.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyIuQ1fHt-1j4jOME6VD4h2Poz_YX0akMAXA&s', 1),
(N'Fresh Food Partnership in the Lobby', N'Organic vegetable stalls from Da Lat will serve residents every early morning.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk10CsnRAVZAjxiSvRKc1SUZ72UPeSElqiPQ&s', 1),
(N'Early Mid-Autumn Festival for Children', N'Exciting lantern parade and lion dance performance at the central plaza.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5vSien6-6fEwacR3Yb_Wbf4jA3eOzmRyi3g&s', 1),
(N'Reminder: Service Fee Payment Deadline', N'Residents please complete service fee payments by the 10th of each month to avoid service interruption.', 'https://thdlog.com/wp-content/uploads/2025/08/3-2.jpg', 1),
(N'New Outdoor Gym Equipment Installation', N'Added 5 sit-up benches and pull-up bars at the lakeside park area.', 'https://thethaominhphu.com/wp-content/uploads/2017/12/cong-vien.jpg', 1),
(N'Security Camera Maintenance: Floors 15-20', N'Technicians will check camera angles and clarity this afternoon.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT52nGCq_ZEVDxWMF6Ixg0IxfvlxZkZgdGe0w&s', 1),
(N'Thank You for Participating in the Quality Survey', N'The satisfaction survey results will be announced by Management next weekend.', 'https://lh4.googleusercontent.com/proxy/NAUmYxcTIQD2UXuCm5lBQZX79hnM_zYkPrY7FywECqqSWCm-tr7GdecW09zGYw9yECtodDgUExwyoNTKq1hdligKPkDdExcN5u-ih8jdtw', 1);
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
('Gym & Yoga Facilities', 'GYM_YOGA', 0.00, 'Resident Only', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 'High-end fitness centers and dedicated yoga studios.', 0), -- Gym thường mua thẻ tháng, không cần đặt giờ
('Education System', 'EDU_K12', 0.00, 'Semester', 'https://vcdn1-vnexpress.vnecdn.net/2023/12/13/v1-5551-1702452332.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=vTDtn5c45HktGxyMQtP20w', 'International standard curriculums for the next generation.', 0),
('Smart Parking', 'SMART_PARK', 0.00, 'Month', 'https://sliving.vn/static/bg-parking-55d4ba544730bb343bfb7709c4c8e50b.jpg', 'Automated parking systems with real-time slot tracking.', 0),
('BBQ Park', 'BBQ_PARK', 100000.00, 'Hour', 'https://vinhomebysalereal.vn/wp-content/uploads/2024/08/khu-bbq-garden-vinhomes-ocean-park-3.jpg', 'Dedicated outdoor BBQ areas equipped with grills.', 1); -- BBQ cần đặt chỗ trước
--batch 3
INSERT INTO Services (ServiceName, ServiceCode, FeePerUnit, UnitType, ImageUrl, Description, IsBookable)
VALUES 
('Tennis Court', 'TENNIS_PRO', 200000.00, 'Hour', 'https://congchungnguyenhue.com/Uploaded/Images/Original/2024/01/21/khu-do-thi-viet-hung-5_2101080916.jpg', 'Professional-grade courts with night lighting.', 1),
('Golf Course', 'GOLF_MINI', 500000.00, 'Hour', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b', 'Premium mini-golf courses for practice and leisure.', 1),
('Sauna & Spa', 'SPA_SAUNA', 300000.00, 'Hour', 'https://vccinews.vn/upload/photos/2026/1/large/vbf-202612210123d2y.jpg', 'Luxury sauna and spa facilities with wellness treatments.', 1),
('Community Hall', 'COMM_HALL', 100000.00, 'Hour', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', 'Spacious halls for meetings and social gatherings.', 1);

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
(N'Residential Electricity', 'ELEC_01', 2500.00, 'kWh', N'Electricity charges based on meter readings.'),
(N'Residential Water', 'WAT_01', 15000.00, 'm3', N'Water charges based on cubic meter usage.'),
(N'Building Management Fee', 'MNG_FEE', 500000.00, N'Month', N'Fixed monthly management and maintenance fee.');
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
-- 1. BBQ Resources (ServiceId = 8)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('BBQ_ZONE_A_01', N'BBQ Garden - Zone A (By the pool)', 8, 1, 'https://tse2.mm.bing.net/th/id/OIP.h5ojHmBqqkvXC7rtk65zugHaE_?rs=1&pid=ImgDetMain&o=7&rm=3'),
('BBQ_ZONE_A_02', N'BBQ Garden - Zone A (By the pool)', 8, 1, 'https://tse3.mm.bing.net/th/id/OIP.MM31qoW70iNVwsmLz-Hz7gHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('BBQ_ZONE_B_01', N'BBQ Garden - Zone B (Central Park)', 8, 1, 'https://tse3.mm.bing.net/th/id/OIP.TZwV6kcD_-PTgZpUBqdNjgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 2. Tennis Resources (ServiceId = 9)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('TENNIS_CT_01', N'Court No. 1', 9, 1, 'https://serena.com.vn/wp-content/uploads/2022/11/Tennis-3-scaled.jpg'),
('TENNIS_CT_02', N'Court No. 2', 9, 1, 'https://tse4.mm.bing.net/th/id/OIP.aQ6v_dIX8jWYZ1HkgddqFQHaE8?w=660&h=440&rs=1&pid=ImgDetMain&o=7&rm=3'),
('TENNIS_CT_03', N'Court No. 3 (Under Maintenance)', 9, 0, 'https://tse1.mm.bing.net/th/id/OIP.H_xYMV4JvL_i3xV6ul8yvgHaEK?w=880&h=495&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 3. Golf Resources (ServiceId = 10)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('GOLF_LANE_01', N'Golf Driving Range - Lane 1', 10, 1, 'https://bizweb.dktcdn.net/100/454/998/files/cau-truc-san-golf-1024x579.png?v=1721027003853'),
('GOLF_LANE_02', N'Golf Driving Range - Lane 2', 10, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcrmlQG5DEvy2M6vSPwGkG_I4rETEqw8rMTw&s');
GO

-- 4. Spa Resources (ServiceId = 11)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('SPA_ROOM_01', N'VIP Room 1', 11, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJh0-BFAcK5wtH4FGe4aIO10v7ilfoYmzaGw&s'),
('SPA_ROOM_02', N'VIP Room 2', 11, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOjkrNdKBZb_A0uEOni0fzVsxLf1o4ysw0iw&s');
GO

-- 5. Community Hall Resources (ServiceId = 12)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES 
( 'HALL_S1_01', N'Floor 1, S1 Building - Grand Hall A', 12, 1, 'https://tse2.mm.bing.net/th/id/OIP.lbReQ7jzsltz0GqdDn-9zQHaEv?rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_S1_02', N'Floor 1, S1 Building - Community Room B', 12, 1, 'https://tse4.mm.bing.net/th/id/OIP.RujXzLwGtbOHnCkxClwwkAHaEL?rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_S2_01', N'Floor 1, S2 Building - Central Hall', 12, 1, 'https://tse2.mm.bing.net/th/id/OIP.hwEPNJ3f-qftLAPYzeOm6AAAAA?w=440&h=293&rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_S2_02', N'Floor 2, S2 Building - Resident Meeting Room', 12, 1, 'https://tse4.mm.bing.net/th/id/OIP.MsblINLo0plg08VE4JpKUQHaE8?w=550&h=367&rs=1&pid=ImgDetMain&o=7&rm=3'),
( 'HALL_COMMON', N'Plaza Area - Community House', 12, 1, 'https://tse2.mm.bing.net/th/id/OIP.lbReQ7jzsltz0GqdDn-9zQHaEv?rs=1&pid=ImgDetMain&o=7&rm=3' );
GO

-- ko book được ở dưới
-- 6. Green Park Resources (ServiceId = 1)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('PARK_CENTRAL', N'Central Park - Regulating Lake Area', 1, 1, 'https://www.annhome.vn/wp-content/uploads/2020/04/Cong-vien-van-hoa-nghe-thuat-Vinhomes-Grand-Park.jpg'),
('PARK_NORTH', N'North Park - Japanese Garden', 1, 1, 'https://tse3.mm.bing.net/th/id/OIP.BKk52dVdASyotQKc71uphQHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3');
GO

-- 7. Swimming Pool Resources (ServiceId = 2)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('POOL_S1_INF', N'S1 Building - 4th Floor (Infinity Pool)', 2, 1, 'https://tse1.mm.bing.net/th/id/OIP.L-JwO9EXN-dbA54tKnmaJQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'),
('POOL_S2_KIDS', N'S2 Building - Ground Floor (Kids Pool)', 2, 1, 'https://tse2.mm.bing.net/th/id/OIP.rxQdhbvDkL9D-xHrlVC89wHaEJ?w=740&h=415&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 8. Shopping Center Resources (ServiceId = 3)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('MALL_MAIN_A', N'Vincom Mall - Lobby A', 3, 1, 'https://tse1.mm.bing.net/th/id/OIP.nIgOdEIPzK6iH_fn5VhZuAHaE9?rs=1&pid=ImgDetMain&o=7&rm=3'),
('SHOP_HOUSE_S1', N'S1 Building Podium - Shophouse Row', 3, 1, 'https://tse4.mm.bing.net/th/id/OIP.WjjQk3n_qC6-i6VNfJAFUgHaFj?w=800&h=600&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 9. Children’s Playground Resources (ServiceId = 4)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('KIDS_OUT_01', N'Outdoor Playground - Beside S2 Building', 4, 1, 'https://th.bing.com/th/id/OIP.v177-wHiXxZGJbcntYuQGQHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'),
('KIDS_IN_01', N'Indoor Playroom - S1 Building', 4, 1, 'https://tse2.mm.bing.net/th/id/OIP.uESWc2hfOLwnToCMDsAGawHaE8?w=700&h=467&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 10. Gym & Yoga Resources (ServiceId = 5)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('GYM_CENTER_01', N'S1 Building - 2nd Floor (Main Gym)', 5, 1, 'https://tse3.mm.bing.net/th/id/OIP.b3ggclKqEU-oa6NNiTeiJAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'),
('YOGA_STUDIO_01', N'S1 Building - 2nd Floor (Yoga & Meditation Studio)', 5, 1, 'https://th.bing.com/th/id/OIP.H1MFdEfZszyHyFS_yZ7YrAHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 11. Education System Resources (ServiceId = 6)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('EDU_VINS_PRIMARY', N'Vinschool Primary School Campus', 6, 1, 'https://tse1.mm.bing.net/th/id/OIP.Au3G2PnYSDyOnIr3uuEDPgHaEB?rs=1&pid=ImgDetMain&o=7&rm=3'),
('EDU_VINS_KINDERGARTEN', N'Vinschool Kindergarten Campus', 6, 1, 'https://tse2.mm.bing.net/th/id/OIP.NGX75odDxZJrt6V3C0fB5wHaEa?rs=1&pid=ImgDetMain&o=7&rm=3');
GO

-- 12. Smart Parking Resources (ServiceId = 7)
INSERT INTO ServiceResources (ResourceCode, Location, ServiceId, IsAvailable, ImageUrl)
VALUES  
('PARK_B1_S1', N'Basement B1 - S1 Building (Parking)', 7, 1, 'https://img.freepik.com/premium-photo/smart-parking-system-with-realtime-availability-reservation-features_1327465-68653.jpg?w=1800'),
('PARK_B1_S2', N'Basement B1 - S2 Building (Parking)', 7, 1, 'https://tse4.mm.bing.net/th/id/OIP.Y-kEhNTZMaxfwEyFxAHYogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3');
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
-- BATCH 1: Studio Apartment Variations (30m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'Studio Apartment - Unfurnished (Basic)', 30.00, 1, 1, N'Raw handover package, free to customize your living space.', 2000000000, 7000000, 0),
(N'Studio Apartment - Basic Furniture', 30.00, 1, 1, N'Includes kitchen cabinets and concealed ceiling air conditioning.', 2200000000, 8500000, 1),
(N'Studio Apartment - Fully Furnished', 30.00, 1, 1, N'Move-in ready with complete bed, wardrobe, and sofa set.', 2400000000, 10000000, 2);
GO

-- =============================================
-- BATCH 2: 1-Bedroom Apartment Variations (45m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'1BR Apartment - Basic Furniture', 45.00, 1, 1, N'Separate bedroom with standard interior finishes.', 3200000000, 12000000, 1),
(N'1BR Apartment - Fully Furnished', 45.00, 1, 1, N'Modern interior design, optimized for space efficiency.', 3400000000, 14000000, 2),
(N'1BR Apartment - Premium Furniture', 45.00, 1, 1, N'High-end materials featuring Japanese Zen style.', 3700000000, 16000000, 3);
GO

-- =============================================
-- BATCH 3: 2-Bedroom Apartment Variations (65m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'2BR Apartment - Basic Furniture', 65.00, 2, 2, N'An economical choice for young families.', 4800000000, 18000000, 1),
(N'2BR Apartment - Fully Furnished', 65.00, 2, 2, N'Cozy atmosphere with full modern amenities.', 5100000000, 21000000, 2),
(N'2BR Apartment - Premium Furniture', 65.00, 2, 2, N'Equipped with an integrated Smart Home system.', 5500000000, 25000000, 3);
GO

-- =============================================
-- BATCH 4: 2-Bedroom+1 Apartment Variations (80m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'2BR+1 Apartment - Basic Furniture', 80.00, 2, 2, N'+1 multi-purpose space left open for personal design.', 5800000000, 22000000, 1),
(N'2BR+1 Apartment - Fully Furnished', 80.00, 2, 2, N'Harmonious interior synchronization for the whole family.', 6200000000, 25000000, 2),
(N'2BR+1 Apartment - Premium Furniture', 80.00, 2, 2, N'High-end professional interior design package.', 6600000000, 28000000, 3);
GO

-- =============================================
-- BATCH 5: 3-Bedroom Apartment Variations (100m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'3BR Apartment - Premium Furniture', 100.00, 3, 2, N'Luxurious, modern, and featuring a panoramic view.', 7500000000, 28000000, 3),
(N'3BR Apartment - Luxury Furniture', 100.00, 3, 2, N'Elite class living standards for prestigious residents.', 8500000000, 35000000, 4);
GO

-- =============================================
-- BATCH 6: 3-Bedroom+1 Apartment Variations (120m2)
-- =============================================
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES 
(N'3BR+1 Apartment - Premium Furniture', 120.00, 3, 3, N'Maximum living area with top-tier convenience.', 9500000000, 35000000, 3),
(N'3BR+1 Apartment - Luxury Furniture', 120.00, 3, 3, N'Limited edition unit for sophisticated owners.', 11000000000, 45000000, 4);
GO

-- Commercial Shophouse for Ground Floor
INSERT INTO ApartmentTypes (Name, DesignSqrt, NumberOfBedroom, NumberOfBathroom, Overview, CommonPriceForBuying, CommonPriceForRent, FurnitureTypeId)
VALUES (N'Commercial Shophouse - Ground Floor', 150.00, 0, 1, N'Spacious retail premises in a prime ground-floor location.', 15000000000, 60000000, 0);
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

-- 14.1 Generate apartments from Floor 2 to 30 (12 units per floor)
DECLARE @Floor INT = 2;
DECLARE @RoomIndex INT;

WHILE @Floor <= 30
BEGIN
    SET @RoomIndex = 1;
    WHILE @RoomIndex <= 12
    BEGIN
        INSERT INTO Apartments (RoomNumber, FloorNumber, Direction, Status, ApartmentTypeId)
        VALUES (
            (@Floor * 100) + @RoomIndex, 
            @Floor,
            CASE 
                WHEN @RoomIndex % 4 = 1 THEN N'South East'
                WHEN @RoomIndex % 4 = 2 THEN N'North West'
                WHEN @RoomIndex % 4 = 3 THEN N'South West'
                ELSE N'North East'
            END,
            0, -- Available status
            CASE 
                -- Studio (ID 1-3)
                WHEN @RoomIndex BETWEEN 1 AND 2 THEN (ABS(CHECKSUM(NEWID())) % 3) + 1 
                -- 1BR (ID 4-6)
                WHEN @RoomIndex BETWEEN 3 AND 4 THEN (ABS(CHECKSUM(NEWID())) % 3) + 4
                -- 2BR (ID 7-9)
                WHEN @RoomIndex BETWEEN 5 AND 6 THEN (ABS(CHECKSUM(NEWID())) % 3) + 7
                -- 2BR+1 (ID 10-12)
                WHEN @RoomIndex BETWEEN 7 AND 8 THEN (ABS(CHECKSUM(NEWID())) % 3) + 10
                -- 3BR (ID 13-14)
                WHEN @RoomIndex BETWEEN 9 AND 10 THEN (ABS(CHECKSUM(NEWID())) % 2) + 13
                -- 3BR+1 (ID 15-16)
                ELSE (ABS(CHECKSUM(NEWID())) % 2) + 15
            END
        );
        SET @RoomIndex = @RoomIndex + 1;
    END
    SET @Floor = @Floor + 1;
END
GO

-- Insert 4 Shophouse units at corner locations on the 1st Floor
-- Assuming ApartmentTypeId = 17 is the Shophouse type previously created
INSERT INTO Apartments (RoomNumber, FloorNumber, Direction, Status, ApartmentTypeId)
VALUES 
    (101, 1, N'South East', 0, 17), -- Corner 1
    (104, 1, N'North West', 0, 17), -- Corner 2
    (107, 1, N'South West', 0, 17), -- Corner 3
    (110, 1, N'North East', 0, 17); -- Corner 4
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

-- 18.1 Staff Apartment Team (2k5 Generation)
-- 6 Males - 5 Females | Account IDs: 3, 29-38
INSERT INTO StaffInfo (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
(N'Nguyen Van Nam', N'Male', '2005-01-15', '001205000003', 3),
(N'Tran Hoang Long', N'Male', '2005-03-20', '001205000029', 29),
(N'Pham Minh Duc', N'Male', '2005-05-10', '001205000030', 30),
(N'Le Anh Tuan', N'Male', '2005-07-25', '001205000031', 31),
(N'Vu Quang Huy', N'Male', '2005-09-12', '001205000032', 32),
(N'Do Tien Dat', N'Male', '2005-11-05', '001205000033', 33),
(N'Hoang Thu Trang', N'Female', '2005-02-14', '001305000034', 34),
(N'Phan Thanh Thao', N'Female', '2005-04-30', '001305000035', 35),
(N'Bui Minh Anh', N'Female', '2005-06-18', '001305000036', 36),
(N'Ngo Phuong Linh', N'Female', '2005-08-22', '001305000037', 37),
(N'Le Thi Kim Ngan', N'Female', '2005-12-25', '001305000038', 38);
GO

-- 18.2 Staff Services Team (2k Generation)
-- 5 Males - 6 Females | Account IDs: 4, 39-48
INSERT INTO StaffInfo (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
(N'Ly Gia Thanh', N'Male', '2000-02-12', '001000000004', 4),
(N'Phan Dinh Phung', N'Male', '2000-04-25', '001000000039', 39),
(N'Cao Thai Son', N'Male', '2000-06-10', '001000000040', 40),
(N'Dinh Cong Trang', N'Male', '2000-08-30', '001000000041', 41),
(N'Trinh Minh The', N'Male', '2000-10-15', '001000000042', 42),
(N'Nguyen Thị Tuyet Nhung', N'Female', '2000-01-20', '001100000043', 43),
(N'Tran My Tam', N'Female', '2000-03-08', '001100000044', 44),
(N'Le Cam Ly', N'Female', '2000-05-15', '001100000045', 45),
(N'Pham Quynh Anh', N'Female', '2000-07-22', '001100000046', 46),
(N'Vu Cat Tuong', N'Female', '2000-09-11', '001100000047', 47),
(N'Ho Ngoc Ha', N'Female', '2000-12-05', '001100000048', 48);
GO

-- 18.3 Staff Security Team (20th Century)
INSERT INTO StaffInfo (FullName, Gender, DateOfBirth, IdentityId, AccountId)
VALUES 
-- 9 Males
(N'Nguyen Quy Duc', N'Male', '1970-05-12', '001070000005', 5),
(N'Tran Trong Nghia', N'Male', '1972-08-20', '001072000049', 49),
(N'Pham Thế Duyet', N'Male', '1974-03-15', '001074000050', 50),
(N'Le Kha Phieu', N'Male', '1975-12-01', '001075000051', 51),
(N'Vu Khoan', N'Male', '1976-06-18', '001076000052', 52),
(N'Hoang Trung Hai', N'Male', '1977-09-25', '001077000053', 53),
(N'Nguyen Sinh Hung', N'Male', '1978-11-11', '001078000054', 54),
(N'Phan Van Khai', N'Male', '1979-02-28', '001079000055', 55),
(N'Truong Tan Sang', N'Male', '1980-04-05', '001080000056', 56),

-- 2 Females
(N'Nguyen Thi Kim Ngan', N'Female', '1975-10-20', '001175000057', 57),
(N'Tong Thi Phong', N'Female', '1978-01-01', '001178000058', 58);
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
-- 1. Completed Appointment
(NULL, 3, 3, N'Building A Lobby', N'Shophouse Floor Plan Consultation', N'Internal system testing - Scenario A', '2026-03-10', '09:00:00', '10:00:00', 'Completed'),

-- 2. Upcoming Appointment (Pending)
(NULL, 3, 3, N'Meeting Room - 2nd Floor', N'Equipment Handover Minutes Signing', N'Internal system testing - Scenario B', '2026-04-05', '14:30:00', '15:30:00', 'Pending'),

-- 3. Cancelled/Suspended Appointment
(NULL, 3, 3, N'Highlands Coffee - Ground Floor', N'Resident Card Procedure Discussion', N'Internal system testing - Scenario C', '2026-03-20', '10:00:00', '11:00:00', 'Suspended'),

-- 4. Showing Model Unit (Pending)
(NULL, 3, 3, N'Studio Model Unit (Type 1)', N'Balcony View Inspection for Client', N'Internal system testing - Scenario D', '2026-04-10', '08:00:00', '09:00:00', 'Pending'),

-- 5. Shophouse Site Survey (Completed)
(NULL, 3, 3, N'Shophouse Row 17', N'Signage Placement Survey', N'Internal system testing - Scenario E', '2026-03-15', '16:00:00', '17:00:00', 'Completed'),

-- 6. Urgent Business Meeting (Pending)
(NULL, 3, 3, N'Management Office', N'Landscape Supplier Meeting', N'Internal system testing - Scenario F', '2026-04-15', '13:00:00', '14:00:00', 'Pending');
GO

INSERT INTO Appointments (UserId, AssignedTo, CreatedBy, Location, Title, Note, MeetingDate, StartTime, EndTime, Status)
VALUES 
-- 1. Property Viewing (Showrooming)
(NULL, 3, 3, N'Unit A-12.05 (2BR+1)', N'Site Inspection: Balcony View & 12th Floor Amenities', N'Client is deciding between 2BR and 3BR units. System test scenario.', '2026-04-01', '09:00:00', '10:30:00', 'Completed'),

-- 2. Lease Negotiation (Shophouse)
(NULL, 3, 3, N'TEMS Management Office', N'Shophouse 17: Negotiation on 2-month Rent-free Period', N'Client plans to open a Cafe; needs to verify the drainage system. System test scenario.', '2026-04-02', '14:00:00', '15:30:00', 'Completed'),

-- 3. Sales Deposit (Booking)
(NULL, 3, 3, N'S1 Building Reception', N'Earnest Money Deposit for Studio Unit (ID 1)', N'Client approved the database photos and wants to finalize the booking. System test scenario.', '2026-04-03', '16:00:00', '16:30:00', 'Pending');
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


-- FAKE COMPLAINTS (DEC 2025 -> FEB 2026)
INSERT INTO Complaints (Content, MadeByUserId, CreatedAt)
VALUES 
-- DECEMBER 2025 (New residents, mostly about handover and initial services)
(N'The apartment handover procedure is slow; I had to wait in the lobby for a long time.', 2, '2025-12-05 10:30:00'),
(N'The tap water appeared cloudy on the first day of use.', 6, '2025-12-07 14:15:00'),
(N'The management app has not updated my phone number correctly.', 7, '2025-12-12 09:00:00'),
(N'The 4th-floor hallway has an unpleasant paint smell; ventilation needs to be addressed.', 8, '2025-12-20 16:45:00'),
(N'The public Wi-Fi signal in the building is too weak.', 8, '2025-12-25 20:10:00'),

-- JANUARY 2026 (Operational issues arise)
(N'The emergency exit door on the 5th floor is jammed and cannot be closed.', 2, '2026-01-05 08:30:00'),
(N'The neighbor is singing karaoke past the regulated hours during the weekend.', 2, '2026-01-15 22:45:00'),
(N'Waste at the parking basement was not collected on time.', 6, '2026-01-10 07:20:00'),
(N'Elevator No. 3 makes a strange noise when moving to high floors.', 7, '2026-01-18 13:00:00'),
(N'The parking security guard was rude when giving parking instructions.', 8, '2026-01-22 17:55:00'),

-- FEBRUARY 2026 (Technical issues and fee disputes)
(N'The showerhead in the bathroom is leaking water.', 6, '2026-02-05 11:30:00'),
(N'A false fire alarm went off at 2 AM, causing panic.', 7, '2026-02-12 02:15:00'),
(N'I saw cockroaches in the common trash disposal area on this floor.', 7, '2026-02-20 09:40:00'),
(N'The hallway light in front of my door is burnt out and has not been replaced.', 8, '2026-02-14 19:20:00'),
(N'This month''s management fee does not seem to match the apartment area.', 2, '2026-02-28 10:00:00');
GO

-- REPLIES TO COMPLAINTS (DEC 2025 -> MAR 2026)
INSERT INTO Replies (Content, ComplaintId, RepliedByUserId, CreatedAt)
VALUES 
-- Responses for December 2025
(N'The Management Board sincerely apologizes for this delay. We are increasing our staff to complete the handover as soon as possible.', 1, 3, '2025-12-06 14:30:00'),
(N'The technical department has inspected and flushed the pipes. Please let the water run for 5 minutes for stability.', 2, 29, '2025-12-08 18:20:00'),
(N'Your information has been updated in our system. Please log out and back into the app to check.', 3, 3, '2025-12-14 10:15:00'),
(N'We have installed additional ventilation fans in the 4th-floor hallway. The paint smell will dissipate soon.', 4, 29, '2025-12-22 09:30:00'),
(N'Technicians have inspected the public Wi-Fi stations and reset the system to ensure stable connectivity.', 5, 29, '2025-12-27 15:45:00'),

-- Responses for January 2026
(N'A maintenance team has replaced the springs and lubricated the 5th-floor emergency exit door. It is now functioning normally.', 6, 29, '2026-01-07 11:20:00'),
(N'The Management Board has issued a reminder and requested the relevant household to commit to noise regulations.', 7, 3, '2026-01-16 16:00:00'),
(N'We have adjusted the waste collection schedule at the basement. Apologies for the inconvenience.', 8, 3, '2026-01-12 09:45:00'),
(N'The elevator technical team will perform general maintenance on Elevator No. 3 tonight.', 9, 29, '2026-01-20 10:30:00'),
(N'The Management Board has addressed this with the security unit and suspended the staff member involved.', 10, 3, '2026-01-24 14:10:00'),

-- Responses for February 2026
(N'A technician will be at your apartment at 2:00 PM today to replace the showerhead.', 11, 29, '2026-02-06 09:20:00'),
(N'The issue was caused by dust on the smoke detector. We have cleaned all sensors on your floor.', 12, 29, '2026-02-13 14:50:00'),
(N'Regular disinfection and pest control have been carried out for the common trash area.', 13, 29, '2026-02-22 10:15:00'),
(N'Maintenance staff have replaced the burnt-out light bulb in your hallway.', 14, 29, '2026-02-16 08:30:00'),
(N'The accounting department has re-checked the floor area. We will send you a detailed calculation tomorrow morning.', 15, 3, '2026-03-02 11:00:00');
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
-- DECEMBER 2025 (Initial Move-in Repairs & Support)
(N'Lobby Bulb Replacement', N'Replaced broken 12W LED bulb in the entrance lobby', 1, 3, 55000.00, '2025-12-10', '2025-12-10 09:00:00', 1),
(N'Faucet Repair', N'Fixed water leakage in the kitchen sink faucet', 2, 29, 120000.00, '2025-12-15', '2025-12-15 14:30:00', 1),
(N'Floor Drain Unclogging', N'Cleaned the floor drain filter in the bathroom', 3, 29, 80000.00, '2025-12-20', '2025-12-20 10:00:00', 1),
(N'Outlet Inspection', N'Fixed a loose electrical outlet in the living room', 4, 3, 45000.00, '2025-12-22', '2025-12-22 16:00:00', 1),

-- JANUARY 2026 (Monthly Routine Maintenance)
(N'AC Maintenance', N'Cleaned air filters and checked refrigerant gas levels', 1, 29, 250000.00, '2026-01-10', '2026-01-10 08:00:00', 1),
(N'Smart Lock Battery Replacement', N'Replaced 4 AA batteries for the smart door lock', 2, 3, 100000.00, '2026-01-15', '2026-01-15 09:15:00', 1),
(N'Door Hinge Repair', N'Adjusted a sagging bedroom door hinge', 5, 29, 150000.00, '2026-01-20', '2026-01-20 13:45:00', 1),
(N'Balcony Deep Cleaning', N'Industrial cleaning service for the balcony area', 6, 3, 200000.00, '2026-01-25', '2026-01-25 15:00:00', 1),

-- FEBRUARY 2026 (Incidental Maintenance)
(N'Pest Control', N'Periodic treatment for cockroaches and ants', 3, 29, 300000.00, '2026-02-05', '2026-02-05 10:30:00', 1),
(N'Doorbell Repair', N'Checked the connection for the video doorbell system', 4, 3, 180000.00, '2026-02-12', '2026-02-12 11:00:00', 1),
(N'Shower Hose Replacement', N'Replaced a cracked showerhead hose', 1, 29, 95000.00, '2026-02-18', '2026-02-18 16:20:00', 1),
(N'Bidet Sprayer Repair', N'Replaced the bidet sprayer head', 5, 3, 70000.00, '2026-02-25', '2026-02-25 09:00:00', 1);
GO

-- =============================================
-- BATCH 10: RE-GEN VISITOR LOGS (FIX STAFF ID)
-- Staff hợp lệ: 5, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58
-- =============================================

INSERT INTO VisitorLogs (VisitorName, IdentityCard, PhoneNumber, ApartmentId, CreatedByStaffId, CheckInTime, Note)
VALUES 
-- UNIT 1 (Acc 2)
(N'Nguyen Van Nam', '001095001234', '0912345678', 1, 5, '2026-01-05 09:30:00', N'Owner''s friend visiting, brought a gift bag of fruits.'),
(N'Le Thi Hue', '038198004321', '0988776655', 1, 58, '2026-02-14 19:00:00', N'Valentine flower delivery, waiting for the resident in the lobby.'),
(N'Nguyen Tuan Shipper', '001098005544', '0901223344', 1, 49, '2026-02-10 11:45:00', N'ShopeeFood delivery, resident picking up at the lobby.'),

-- UNIT 2 (Acc 6)
(N'Tran Minh Tam', '079092005566', '0909123456', 2, 50, '2026-01-15 14:15:00', N'External water purifier maintenance staff.'),
(N'Pham Hoang Long', '001090008899', '0934556677', 2, 51, '2026-02-20 10:00:00', N'Acquaintance dropped off a package, stored at the security desk.'),
(N'Tran Van Tho', '034085001122', '0988112233', 2, 5, '2026-01-12 08:00:00', N'AC technician performing maintenance in the living room.'),

-- UNIT 3 (Acc 7)
(N'Hoang Thanh Truc', '031195001122', '0977112233', 3, 52, '2026-01-20 18:30:00', N'Owner''s sister visiting for dinner.'),
(N'Vu Dinh Phan', '001085006677', '0911223344', 3, 53, '2026-02-05 08:45:00', N'Viettel technician checking internet lines.'),
(N'Dien May Xanh - Team A', '079090001234', '0123456789', 3, 5, '2026-01-22 14:00:00', N'New refrigerator delivery, 2 people installing on the 3rd floor.'),

-- UNIT 4 (Acc 8)
(N'Dang Quoc Bao', '001070002233', '0966554433', 4, 54, '2026-01-10 11:00:00', N'Relatives from hometown visiting the new house.'),
(N'Le Decor', '001092003344', '0977665544', 4, 55, '2026-02-05 09:15:00', N'Wallpaper installation team for the newly purchased unit.'),

-- UNIT 5 (Acc 8)
(N'Ly Gia Thanh', '001088009988', '0944332211', 5, 58, '2026-01-25 15:30:00', N'Business partner visiting for a meeting.'),
(N'DHL Express - Hung', '038088009900', '0944009988', 5, 5, '2026-02-18 10:30:00', N'International package delivery, requires hand-signed receipt.'),

-- UNIT 6 (Acc 8)
(N'Ngo Kien Huy', '079099001122', '0922113344', 6, 56, '2026-02-12 16:45:00', N'Interior decor delivery, moving to the unit for assembly.'),
(N'FPT Telecom - Tech', '001099004455', '0911554433', 6, 57, '2026-02-25 15:20:00', N'FPT technician checking network signal.');
GO
-- =============================================
-- BATCH 15.1: BỔ SUNG LOGS THỢ KỸ THUẬT & SỬA CHỮA
-- Mục tiêu: Đủ 43 records tổng cộng cho VisitorLogs
-- =============================================

INSERT INTO VisitorLogs (VisitorName, IdentityCard, PhoneNumber, ApartmentId, CreatedByStaffId, CheckInTime, Note)
VALUES 
-- UNIT 1 (Technicians)
(N'Minh Locksmith', '001090001111', '0911001122', 1, 5, '2026-03-01 08:30:00', N'Replacing smart lock for the owner.'),
(N'Thanh Tam Glass & Alu', '001091002222', '0912223344', 1, 58, '2026-03-05 14:00:00', N'Fixing sagging balcony door hinges.'),

-- UNIT 2 (Technicians)
(N'An Gia Curtains', '079092003333', '0903334455', 2, 5, '2026-03-10 09:15:00', N'Installing rainbow blinds in the bedroom.'),
(N'Industrial Cleaning Services', '079093004444', '0904445566', 2, 50, '2026-03-12 13:45:00', N'Post-construction cleaning (Team of 3).'),

-- UNIT 3 (Technicians)
(N'Hanoi Painting Team', '001085005555', '0915556677', 3, 5, '2026-03-15 10:00:00', N'Repainting water-damaged wall section in the kitchen.'),
(N'Hafele Technician', '001086006666', '0916667788', 3, 52, '2026-03-18 15:30:00', N'Induction hob warranty service and PCB inspection.'),

-- UNIT 4 (Technicians)
(N'Moc Lan Woodworks', '001070007777', '0917778899', 4, 5, '2026-03-20 08:00:00', N'Installing additional TV shelf and decorative cabinet.'),
(N'PestControl Services', '001071008888', '0918889900', 4, 54, '2026-03-21 16:00:00', N'Periodic spraying for cockroaches and termites.'),

-- UNIT 5 (Technicians)
(N'24/7 Plumbing & Electric', '038088001111', '0941112222', 5, 5, '2026-03-22 21:00:00', N'Emergency repair: Short circuit in living room outlet.'),
(N'Toan Thang Wood Flooring', '038089002222', '0942223333', 5, 58, '2026-03-23 09:30:00', N'Fixing floorboards warped due to rainwater soaking.'),

-- UNIT 6 (Technicians)
(N'Drain Unclogging - Mr. Hung', '079099003333', '0923334444', 6, 5, '2026-03-24 10:45:00', N'Unclogging toilet and floor drainage pipes.'),
(N'Daikin Technician', '079100004444', '0924445555', 6, 56, '2026-03-25 14:20:00', N'Periodic maintenance for Multi-split AC system.'),

-- ADDITIONAL RANDOM GENERATED LOGS
(N'Gypsum Ceiling Worker', '001095009999', '0966998877', 1, 49, '2026-03-26 08:30:00', N'Patching ceiling holes after pipe repairs.'),
(N'Drying Rack Installer', '001096008888', '0966887766', 2, 51, '2026-03-26 09:00:00', N'Installing smart laundry drying rack on balcony.'),
(N'Tempered Glass Team', '001097007777', '0966776655', 3, 53, '2026-03-26 09:30:00', N'Installing bathroom glass partition.'),
(N'Thanh Cong Granite', '001098006666', '0966665544', 4, 55, '2026-03-26 10:00:00', N'Repairing cracked granite kitchen countertop.'),
(N'Camera Technician', '001099005555', '0966554433', 5, 57, '2026-03-26 10:30:00', N'Installing IP cameras inside the apartment.'),
(N'JupViec Hourly Maid', '001100004444', '0966443322', 6, 58, '2026-03-26 11:00:00', N'Periodic apartment cleaning service.'),
(N'Vuong Locksmith', '001101003333', '0966332211', 1, 5, '2026-03-26 11:30:00', N'Assisting owner with forgotten passcode access.'),
(N'Ariston Technician', '001102002222', '0966221100', 2, 50, '2026-03-26 13:00:00', N'Checking water heater for no hot water issue.'),
(N'Sofa Upholstery Worker', '001103001111', '0966110099', 3, 5, '2026-03-26 13:30:00', N'Collecting fabric samples for sofa reupholstery.'),
(N'Washing Machine Cleaner', '001104000000', '0966009988', 4, 52, '2026-03-26 14:00:00', N'Deep cleaning front-load washing machine drum.'),
(N'Safety Net Installer', '001105009876', '0966987654', 5, 5, '2026-03-26 14:30:00', N'Installing balcony safety net for child protection.'),
(N'Yale Lock Technician', '001106008765', '0966876543', 6, 54, '2026-03-26 15:00:00', N'Registering additional fingerprints for the maid.'),
(N'Inox Welder', '001107007654', '0966765432', 1, 56, '2026-03-26 15:30:00', N'Repairing washing machine rack stand.'),
(N'SmartHome Technician', '001108006543', '0966654321', 2, 5, '2026-03-26 16:00:00', N'Reconfiguring smart lighting system.'),
(N'Molding Decorator', '001109005432', '0966543210', 3, 58, '2026-03-26 16:30:00', N'Installing neoclassical wall moldings in living room.');
GO


DECLARE @CurrentId INT = 1;
DECLARE @MaxId INT = 58;

WHILE @CurrentId <= @MaxId
BEGIN
    -- 1. System Maintenance Notification (SYSTEM)
    INSERT INTO Notifications (ReceiverId, TargetRole, Title, Message, Type, IsRead, CreatedAt, RelatedUrl)
    VALUES (
        @CurrentId, NULL, 
        N'Scheduled System Maintenance', 
        N'The TEMS system will undergo server maintenance at 01:00 AM on March 30th. Please log out before this time.', 
        'SYSTEM', 0, '2026-03-24 08:00:00', NULL
    );

    -- 2. Payment Reminder Notification (PAYMENT)
    INSERT INTO Notifications (ReceiverId, TargetRole, Title, Message, Type, IsRead, CreatedAt, RelatedUrl)
    VALUES (
        @CurrentId, NULL, 
        N'Invoice Payment Reminder', 
        N'Our system indicates that your February service invoice has not been fully reconciled. Please check the Invoices section.', 
        'PAYMENT', 0, '2026-03-25 10:30:00', NULL
    );

    -- 3. Contract & Regulation Update (CONTRACT)
    INSERT INTO Notifications (ReceiverId, TargetRole, Title, Message, Type, IsRead, CreatedAt, RelatedUrl)
    VALUES (
        @CurrentId, NULL, 
        N'Building Regulations Update', 
        N'The Management Board has updated regulations regarding pets and the use of common areas. Please see details at the office.', 
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
-- BATCH 14.4: 50 RECORDS - INDUSTRY STANDARD TEST DATA
-- 20 Spam/System Noise - 30 Potential Leads
-- =============================================

DECLARE @i INT = 1;

WHILE @i <= 50
BEGIN
    INSERT INTO GetInTouch (FullName, Email, PhoneNumber, [Message], CreatedAt)
    VALUES (
        -- Customer Name
        CASE 
            WHEN @i <= 20 THEN N'User_Test_' + CAST(@i AS NVARCHAR)
            ELSE N'Nguyen ' + 
                 CASE WHEN @i % 3 = 0 THEN N'Van ' WHEN @i % 3 = 1 THEN N'Thi ' ELSE N'Hoang ' END + 
                 CAST(@i AS NVARCHAR)
        END,
        
        -- Email
        CASE 
            WHEN @i <= 20 THEN 'test.spam.' + CAST(@i AS VARCHAR) + '@trashmail.com'
            ELSE 'customer.' + CAST(@i AS VARCHAR) + '@gmail.com'
        END,
        
        -- Phone Number
        CASE 
            WHEN @i <= 20 THEN '000000000' + CAST(@i % 10 AS VARCHAR)
            ELSE '09' + CAST(10000000 + @i AS VARCHAR)
        END,
        
        -- Message Content
        CASE 
            -- Group: 20 Spam/Noise records (System clutter simulation)
            WHEN @i BETWEEN 1 AND 5 THEN N'asdfghjklqwertyuiop' -- Keyboard smashing
            WHEN @i BETWEEN 6 AND 10 THEN N'System check 1 2 3... Internal Dev Test' -- Dev test
            WHEN @i BETWEEN 11 AND 15 THEN N'Cheap SEO services, increase likes/subs. Contact 0123...' -- Spam advertising
            WHEN @i BETWEEN 16 AND 20 THEN N'................................' -- Ghost/Empty message
            
            -- Group: 30 "Serious" Leads (Genuine inquiries)
            WHEN @i BETWEEN 21 AND 30 THEN N'I would like to receive information regarding the monthly management fees for Building S1.'
            WHEN @i BETWEEN 31 AND 40 THEN N'Please send me the price list for East-facing Studio units.'
            WHEN @i BETWEEN 41 AND 45 THEN N'When will the maintenance for Tennis Court No. 3 be completed?'
            ELSE N'I would like to book a site visit for a Shophouse unit this weekend.'
        END,
        
        -- Timestamp (Distributed over the last 25 hours)
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
    SELECT DATEFROMPARTS(2026, 3, 1), 3 
     UNION ALL
    SELECT DATEFROMPARTS(2026, 4, 1), 4    -- Chốt cho tháng 02/2026
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

--3.2.2 -- tháng 3 
-- =============================================
-- BATCH 3.2: XUẤT HÓA ĐƠN THÁNG 02/2026 (TẠO NGÀY 02/03/2026)
-- =============================================
INSERT INTO UtilitiesInvoices (ApartmentId, BillingMonth, BillingYear, TotalElectricUsed, TotalWaterUsed, TotalAmount, Status, CreatedAt)
SELECT 
    Curr.ApartmentId,
    3 AS BillingMonth, -- Hóa đơn cho tháng 2
    2026 AS BillingYear,
    (Curr.ElectricityEndNum - Prev.ElectricityEndNum) AS ElecUsed,
    (Curr.WaterEndNum - Prev.WaterEndNum) AS WaterUsed,
    ( (Curr.ElectricityEndNum - Prev.ElectricityEndNum) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'ELEC_01') ) +
    ( (Curr.WaterEndNum - Prev.WaterEndNum) * (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'WAT_01') ) +
    ( (SELECT BasePrice FROM MandatoryServices WHERE ServiceCode = 'MNG_FEE') ) AS TotalAmount,
    0 AS Status,
    DATEFROMPARTS(2026, 4, 2) AS CreatedAt -- Tạo vào mùng 2 tháng 3
FROM 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-04-01') AS Curr
JOIN 
    (SELECT * FROM IoT_Sync_Logs WHERE LogDate = '2026-03-01') AS Prev 
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
(N'Late Night Karaoke Fine', N'Singing "Cut Sorrow in Half" at 2 AM, causing sleep deprivation for the entire floor.', 500000),
(N'Pet Pig Elevator Fee', N'Pet pig soiled the S2 elevator floor; specialized deep cleaning and deodorizing required.', 200000),
(N'Durian Delivery Support', N'Management assisted in carrying 10 crates of durian to the 20th floor for the resident.', 150000),
(N'Lobby Glass Compensation', N'Resident was distracted by a pretty girl and walked into the glass door, causing a crack.', 1200000),
(N'Cat Rescue Service', N'Technical team used rope ladders to rescue a resident''s cat trapped in a tree for 3 days.', 300000),
(N'Shrimp Paste Odor Penalty', N'Cooking shrimp paste without using the exhaust fan, overwhelming the entire floor.', 100000),
(N'Indoor EV Charging Fine', N'Serious violation of Fire Safety and Prevention regulations.', 2000000),
(N'Party Speaker Rental', N'Borrowing the Management Board''s portable speaker for a birthday party at the BBQ area.', 400000),
(N'Toilet Clog Repair (Durian)', N'Discovered durian husks inside the main drainage pipe.', 600000),
(N'Temporary Childcare Fee', N'Receptionist babysitting while the mother went down to the lobby to pick up milk tea.', 50000);

-- 3. Data Insertion Loop
WHILE @i <= 59
BEGIN
    -- Randomly pick a reason from 1 to 10
    SET @ReasonId = (ABS(CHECKSUM(NEWID())) % 10) + 1;
    
    -- Randomly pick a Staff ID from the list provided by Nghia
    SELECT TOP 1 @StaffId = SId 
    FROM (VALUES (3),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38)) AS Staff(SId) 
    ORDER BY NEWID();

    -- Execute INSERT
    INSERT INTO Expenses (Title, Description, ApartmentId, CreatedBy, Amount, ExpenseDate, [Status])
    SELECT 
        Title, 
        DescDetail + N' (Note: Resident promised not to repeat the violation. Sys-Test.)', 
        @i, 
        @StaffId, 
        MinPrice + (ABS(CHECKSUM(NEWID()) % 5) * 20000), -- Randomly increase price slightly
        '2026-03-25', 
        0
    FROM @BuaReasons 
    WHERE Id = @ReasonId;

    SET @i = @i + 1;
END
GO

INSERT INTO Complaints (Content, MadeByUserId, CreatedAt)
VALUES 
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 59)', 59, '2026-03-25 21:53:00'),
(N'Why was I fined for cooking shrimp paste? This is the essence of national cuisine! I will take this to the local authorities! (Sent from resident account 60)', 60, '2026-03-26 01:28:00'),
(N'Why was I fined for Karaoke? I was just playing Buddhist chants at 2 AM! Management needs to re-evaluate this! (Sent from resident account 61)', 61, '2026-03-26 06:23:00'),
(N'Why was I fined for Karaoke? I was just playing Buddhist chants at 2 AM! Management needs to re-evaluate this! (Sent from resident account 62)', 62, '2026-03-26 04:05:00'),
(N'Why am I not allowed to charge my EV at home? I promise to keep an eye on it; charging in the basement is too inconvenient! (Sent from resident account 63)', 63, '2026-03-25 14:42:00'),
(N'I demand a CCTV review. I hit my head because the glass was too transparent; it is the Management''s fault for cleaning it too well! (Sent from resident account 64)', 64, '2026-03-25 11:35:00'),
(N'The building security stares at me too closely whenever I come home late from drinking; I feel my privacy is being violated! (Sent from resident account 65)', 65, '2026-03-25 09:58:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 66)', 66, '2026-03-25 10:49:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 67)', 67, '2026-03-25 10:15:00'),
(N'My pet pig is cleaner than this elevator; why am I being charged a deodorizing fee? This is absolutely ridiculous! (Sent from resident account 68)', 68, '2026-03-26 00:54:00'),
(N'The water bill this month is unusually high; I suspect the neighbor is illegally tapping into my line. (Sent from resident account 69)', 69, '2026-03-25 21:03:00'),
(N'300k for cat rescue is too expensive! The cat could have climbed down itself; the technician just stood there and watched! (Sent from resident account 70)', 70, '2026-03-26 03:21:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 71)', 71, '2026-03-26 07:08:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 72)', 72, '2026-03-25 22:51:00'),
(N'The receptionist watched my child for just 1 hour and charged 50k? That''s more expensive than a Grab; I do not accept this invoice. (Sent from resident account 73)', 73, '2026-03-25 19:50:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 74)', 74, '2026-03-25 23:53:00'),
(N'The receptionist watched my child for just 1 hour and charged 50k? That''s more expensive than a Grab; I do not accept this invoice. (Sent from resident account 75)', 75, '2026-03-25 09:34:00'),
(N'My pet pig is cleaner than this elevator; why am I being charged a deodorizing fee? This is absolutely ridiculous! (Sent from resident account 76)', 76, '2026-03-25 19:47:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 77)', 77, '2026-03-25 17:16:00'),
(N'The building security stares at me too closely whenever I come home late from drinking; I feel my privacy is being violated! (Sent from resident account 78)', 78, '2026-03-25 16:52:00'),
(N'The receptionist watched my child for just 1 hour and charged 50k? That''s more expensive than a Grab; I do not accept this invoice. (Sent from resident account 79)', 79, '2026-03-25 13:54:00'),
(N'The water bill this month is unusually high; I suspect the neighbor is illegally tapping into my line. (Sent from resident account 80)', 80, '2026-03-26 01:59:00'),
(N'Why am I not allowed to charge my EV at home? I promise to keep an eye on it; charging in the basement is too inconvenient! (Sent from resident account 81)', 81, '2026-03-25 08:39:00'),
(N'I suggest installing more mirrors in the elevator for check-ins; it is currently as dark as a coal cellar. (Sent from resident account 82)', 82, '2026-03-25 10:32:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 83)', 83, '2026-03-25 15:32:00'),
(N'Why am I not allowed to charge my EV at home? I promise to keep an eye on it; charging in the basement is too inconvenient! (Sent from resident account 84)', 84, '2026-03-25 20:51:00'),
(N'300k for cat rescue is too expensive! The cat could have climbed down itself; the technician just stood there and watched! (Sent from resident account 85)', 85, '2026-03-25 09:35:00'),
(N'The receptionist watched my child for just 1 hour and charged 50k? That''s more expensive than a Grab; I do not accept this invoice. (Sent from resident account 86)', 86, '2026-03-25 23:20:00'),
(N'300k for cat rescue is too expensive! The cat could have climbed down itself; the technician just stood there and watched! (Sent from resident account 87)', 87, '2026-03-25 08:12:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 88)', 88, '2026-03-25 15:46:00'),
(N'Why am I not allowed to charge my EV at home? I promise to keep an eye on it; charging in the basement is too inconvenient! (Sent from resident account 89)', 89, '2026-03-25 10:13:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 90)', 90, '2026-03-26 01:21:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 91)', 91, '2026-03-25 16:00:00'),
(N'What is the upstairs neighbor doing? Every night at 12 AM there are sounds of dragging chairs and falling marbles. Please handle immediately! (Sent from resident account 92)', 92, '2026-03-25 12:15:00'),
(N'My pet pig is cleaner than this elevator; why am I being charged a deodorizing fee? This is absolutely ridiculous! (Sent from resident account 93)', 93, '2026-03-25 23:47:00'),
(N'My pet pig is cleaner than this elevator; why am I being charged a deodorizing fee? This is absolutely ridiculous! (Sent from resident account 94)', 94, '2026-03-25 10:59:00'),
(N'I suggest installing more mirrors in the elevator for check-ins; it is currently as dark as a coal cellar. (Sent from resident account 95)', 95, '2026-03-26 02:07:00'),
(N'I suggest installing more mirrors in the elevator for check-ins; it is currently as dark as a coal cellar. (Sent from resident account 96)', 96, '2026-03-25 22:52:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 97)', 97, '2026-03-25 12:27:00'),
(N'I demand a CCTV review. I hit my head because the glass was too transparent; it is the Management''s fault for cleaning it too well! (Sent from resident account 98)', 98, '2026-03-25 23:16:00'),
(N'I demand a CCTV review. I hit my head because the glass was too transparent; it is the Management''s fault for cleaning it too well! (Sent from resident account 99)', 99, '2026-03-26 06:07:00'),
(N'The receptionist watched my child for just 1 hour and charged 50k? That''s more expensive than a Grab; I do not accept this invoice. (Sent from resident account 100)', 100, '2026-03-26 06:39:00'),
(N'I demand a CCTV review. I hit my head because the glass was too transparent; it is the Management''s fault for cleaning it too well! (Sent from resident account 101)', 101, '2026-03-26 05:42:00'),
(N'My pet pig is cleaner than this elevator; why am I being charged a deodorizing fee? This is absolutely ridiculous! (Sent from resident account 102)', 102, '2026-03-26 00:14:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 103)', 103, '2026-03-25 23:19:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 104)', 104, '2026-03-26 05:02:00'),
(N'The neighboring apartment has a dog barking incessantly; I demand the Management Board soundproof my walls for free. (Sent from resident account 105)', 105, '2026-03-26 00:21:00'),
(N'My pet pig is cleaner than this elevator; why am I being charged a deodorizing fee? This is absolutely ridiculous! (Sent from resident account 106)', 106, '2026-03-25 21:07:00'),
(N'The receptionist watched my child for just 1 hour and charged 50k? That''s more expensive than a Grab; I do not accept this invoice. (Sent from resident account 107)', 107, '2026-03-25 21:43:00'),
(N'The building security stares at me too closely whenever I come home late from drinking; I feel my privacy is being violated! (Sent from resident account 108)', 108, '2026-03-25 21:12:00');
GO
DECLARE @ComplaintId INT = 20; -- Bồ nhớ check lại xem ID bắt đầu từ đâu nhé
DECLARE @StaffId INT;
DECLARE @ReplyContent NVARCHAR(MAX);
DECLARE @ComplaintText NVARCHAR(MAX);
DECLARE @CreatedAt DATETIME;

WHILE @ComplaintId <= 66
BEGIN
    -- 1. Randomly pick a Staff ID for the reply
    SELECT TOP 1 @StaffId = SId 
    FROM (VALUES (3),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38)) AS Staff(SId) 
    ORDER BY NEWID();

    -- 2. Get the complaint content and creation date to calculate response time
    SELECT @ComplaintText = Content, @CreatedAt = CreatedAt 
    FROM Complaints WHERE Id = @ComplaintId;

    -- 3. Logic to select Reply content based on keywords in the complaint
    SET @ReplyContent = CASE 
        WHEN @ComplaintText LIKE N'%dog barking%' THEN N'The Management Board has recorded the issue and contacted the pet owner. Regarding soundproofing, this involves the building''s structure, so we cannot provide it for free. We appreciate your understanding.'
        WHEN @ComplaintText LIKE N'%shrimp paste%' THEN N'While shrimp paste is a culinary specialty, its strong odor significantly affects neighbors. The fine remains to ensure the quality of common living spaces.'
        WHEN @ComplaintText LIKE N'%Karaoke%' OR @ComplaintText LIKE N'%Buddhist chants%' THEN N'Any loud noise after 10:00 PM is considered a noise violation, regardless of the content. Please use headphones or reduce the volume.'
        WHEN @ComplaintText LIKE N'%charge my EV%' OR @ComplaintText LIKE N'%EV%' THEN N'City Fire Safety regulations strictly prohibit charging EVs inside apartments. Please use the basement charging stations to ensure the safety of the entire building.'
        WHEN @ComplaintText LIKE N'%cleaning%' OR @ComplaintText LIKE N'%glass%' OR @ComplaintText LIKE N'%transparent%' THEN N'Thank you for acknowledging our cleaning standards. However, please watch your step and observe carefully while moving to avoid injuries.'
        WHEN @ComplaintText LIKE N'%drinking%' OR @ComplaintText LIKE N'%privacy%' THEN N'Security is simply following standard safety observation protocols. If you find it intrusive, we will remind the security team to adjust their approach.'
        WHEN @ComplaintText LIKE N'%marbles%' OR @ComplaintText LIKE N'%dragging chairs%' THEN N'We will send a reminder to the upstairs residents to check their furniture movement at night.'
        WHEN @ComplaintText LIKE N'%pet pig%' THEN N'Elevators are public areas; any odors caused by pets must be thoroughly addressed. This fee covers specialized professional disinfection services.'
        WHEN @ComplaintText LIKE N'%water bill%' THEN N'A technician will check your water meter tomorrow morning. Please ensure someone is home at that time.'
        WHEN @ComplaintText LIKE N'%cat rescue%' OR @ComplaintText LIKE N'%cat%' THEN N'The use of specialized equipment and technical staff incurs operational costs. This fee is regulated in our rescue service category.'
        WHEN @ComplaintText LIKE N'%babysitting%' OR @ComplaintText LIKE N'%childcare%' THEN N'This is an after-hours support service provided by the receptionist and is not under direct building management. Please negotiate directly with the staff.'
        WHEN @ComplaintText LIKE N'%mirrors%' OR @ComplaintText LIKE N'%check-in%' THEN N'We have received your feedback and will consider installing additional mirrors during the next quarterly maintenance. We wish you many great check-in photos!'
        ELSE N'The Management Board has received your inquiry and is currently verifying the details. We will provide a formal response as soon as possible.'
    END;

    -- 4. INSERT into Replies table (Response time 24-48 hours later)
    INSERT INTO Replies (Content, ComplaintId, RepliedByUserId, CreatedAt)
    VALUES (
        @ReplyContent + N' (Response from Admin/Staff ID: ' + CAST(@StaffId AS NVARCHAR) + N')',
        @ComplaintId,
        @StaffId,
        DATEADD(HOUR, ABS(CHECKSUM(NEWID()) % 24) + 24, @CreatedAt) 
    );

    SET @ComplaintId = @ComplaintId + 1;
END;
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
-- Payments table for VNPAY and other payment gateways
CREATE TABLE Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Amount DECIMAL(18, 2) NOT NULL,
    TransactionId VARCHAR(100),        -- Mã giao dịch trả về từ VNPAY hoặc gateway
    OrderInfo NVARCHAR(MAX),           -- Nội dung thanh toán
    PaymentGateway VARCHAR(50) DEFAULT 'VNPAY', -- Cổng thanh toán (VNPAY, MOMO, v.v)
    PaymentStatus INT DEFAULT 0, -- 0-PENDING, 1-SUCCESS, 2-FAILED
    PaymentDate DATETIME DEFAULT GETDATE(),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE PaymentInvoice (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PaymentId INT NOT NULL,
    InvoiceId INT NOT NULL,
    InvoiceType VARCHAR(50) NOT NULL,
    InvoiceMonth INT NOT NULL,
    InvoiceYear INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL, -- tiền của từng invoice

    FOREIGN KEY (PaymentId) REFERENCES Payments(Id)
);
GO

UPDATE UtilitiesInvoices
SET Status = 1
WHERE Status = 0;

update UtilitiesInvoices set Status = 0 where ApartmentId = 1 and BillingMonth = 3;