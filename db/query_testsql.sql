-- IT 1 -- check when create new account
Select * from accounts

select * from Roles

-- check xem các permission dược add chưa 
select * from Permissions

-- 
SELECT 
    a.Id,               -- Dùng 'a' thay vì 'authorities'
    a.RoleId,           -- Thiếu dấu phẩy ở đây nữa nè
    a.PermissionId, 
    p.PermissionCode,
	p.Description,
    Roles.RoleName      -- Bảng Roles anh không đặt Alias nên dùng tên gốc là đúng
FROM authorities a 
JOIN Permissions p ON p.Id = a.PermissionId 
JOIN Roles ON Roles.Id = a.RoleId
ORDER BY a.Id ASC; -- ASC là thấp -> cao (mặc định), DESC là cao -> thấp

select * from Apartments