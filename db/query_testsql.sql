--1. xem thk nào là resident  tức (role id = 2) để add resident cho nó.  
select * from Accounts where roleid = 2 

-- check xem account nào ứng với resident nào 
SELECT 
    A.Id AS AccountId,
    A.Email,
    R.FullName,
    R.PhoneNumber,
    R.IdentityNumber
FROM Accounts A
INNER JOIN Residents R ON A.Id = R.AccountId
WHERE A.RoleId = 2; -- Chỉ lấy những người là cư dân