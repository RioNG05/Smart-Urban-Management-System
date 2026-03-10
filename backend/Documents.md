# API Documentation - Smart Urban System

## Thông Tin Chung

| Thông Tin | Chi Tiết |
|-----------|---------|
| **Base URL** | `http://localhost:8080/api` |
| **Format Response** | JSON |
| **Authentication** | Bearer Token (sẽ áp dụng) |

## API Response Format

Tất cả API responses đều tuân theo định dạng chuẩn:

```json
{
    "code": 200,
    "message": "Mô tả kết quả hoặc lỗi",
    "result": {}
}
```

| Field | Type | Mô Tả |
|-------|------|-------|
| `code` | Integer | Mã HTTP status (200, 400, 500, etc.) |
| `message` | String | Thông báo từ server |
| `result` | Object/Array | Dữ liệu trả về (null nếu không có) |

---

## A. ACCOUNT ROUTES - Quản Lý Tài Khoản Người Dùng

### 1. Lấy Danh Sách Tất Cả Tài Khoản

```http
GET /accounts
```

**Mô Tả**: Truy xuất danh sách tất cả tài khoản trong hệ thống.

**Tham Số**: Không có

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Success",
    "result": [
        {
            "id": 1,
            "email": "user@example.com",
            "username": "username",
            "password": "hashedPassword",
            "role": {
                "id": 2,
                "roleName": "RESIDENT",
                "hibernateLazyInitializer": {}
            },
            "isActive": true
        }
    ]
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Internal Server Error | Lỗi máy chủ |

---

### 2. Lấy Chi Tiết Tài Khoản Theo ID

```http
GET /accounts/{accountID}
```

**Mô Tả**: Truy xuất thông tin chi tiết của một tài khoản cụ thể.

**Tham Số**:
| Tham Số | Kiểu | Vị Trí | Mô Tả |
|---------|------|--------|-------|
| `accountID` | Integer | Path | ID của tài khoản cần lấy |

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Success",
    "result": {
        "id": 1,
        "email": "user@example.com",
        "username": "username",
        "password": "hashedPassword",
        "role": {
            "id": 2,
            "roleName": "RESIDENT",
            "hibernateLazyInitializer": {}
        },
        "isActive": true
    }
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Không tìm thấy Account với ID: {id} | Account không tồn tại |

---

### 3. Tạo Tài Khoản Mới

```http
POST /accounts
```

**Mô Tả**: Tạo một tài khoản người dùng mới với các thông tin cần thiết.

**Request Body**:
```json
{
    "email": "newuser@example.com",
    "username": "newuser",
    "password": "Password@123",
    "roleId": 2,                    -- Hiện tại phần này ở BE đang mặc định là 2, dù FE có gửi gì thì cũng về 2 hết
    "isActive": true                -- BE đang mặc định trả về true
}
```

**Tham Số Request**:
| Tham Số | Kiểu | Bắt Buộc | Mô Tả |
|---------|------|---------|-------|
| `email` | String | ✓ | Email người dùng (phải unique) |
| `username` | String | ✓ | Tên đăng nhập (phải unique) |
| `password` | String | ✓ | Mật khẩu |
| `roleId` | Integer | ✗ | ID vai trò (mặc định = 2: RESIDENT) |
| `isActive` | Boolean | ✗ | Trạng thái hoạt động (mặc định = true) |

**Validations**:
| Trường | Quy Tắc | Lỗi |
|--------|--------|-----|
| `email` | Không được để trống | "Email không được để trống" |
| `username` | Min 6 ký tự, không được để trống | "Tên người dùng phải có ít nhất 6 ký tự" |
| `password` | Min 8 ký tự, phải chứa: chữ hoa, chữ thường, chữ số, ký tự đặc biệt (@$!%*?&#) | "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt" |
| `username` + `email` | Không được trùng lặp | "Tên người dùng đã được sử dụng" / "Email đã được sử dụng" |

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Tạo người dùng thành công!",
    "result": {
        "id": 5,
        "email": "newuser@example.com",
        "username": "newuser",
        "password": "$2a$10$hashedPassword...",
        "role": {
            "id": 2,
            "roleName": "RESIDENT"
        },
        "isActive": true
    }
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 400 | Các thông báo validation | Dữ liệu không hợp lệ |
| 500 | Tên người dùng đã được sử dụng | Username đã tồn tại |
| 500 | Email đã được sử dụng | Email đã tồn tại |
| 500 | Không tìm thấy Role với ID: {roleId} | Role không tồn tại |

---

### 4. Cập Nhật Tài Khoản

```http
PUT /accounts/{accountID}
```

**Mô Tả**: Cập nhật thông tin của một tài khoản (tất cả trường là optional).

**Tham Số**:
| Tham Số | Kiểu | Vị Trí | Mô Tả |
|---------|------|--------|-------|
| `accountID` | Integer | Path | ID của tài khoản cần cập nhật |

**Request Body** (tất cả trường optional):
```json
{
    "email": "newemail@example.com",
    "username": "newusername",
    "password": "NewPassword@456",
    "roleId": 3,
    "isActive": false
}
```

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Cập nhật thông tin thành công",
    "result": {
        "id": 1,
        "email": "newemail@example.com",
        "username": "newusername",
        "password": "$2a$10$hashedPassword...",
        "role": {
            "id": 3,
            "roleName": "STAFF_APARTMENT"
        },
        "isActive": false
    }
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Không tìm thấy Account với ID: {id} | Account không tồn tại |
| 500 | Không tìm thấy Role với ID: {roleId} | Role không tồn tại |

---

### 5. Xóa Tài Khoản

```http
DELETE /accounts/{accountID}
```

**Mô Tả**: Xóa một tài khoản khỏi hệ thống (không thể khôi phục).

**Tham Số**:
| Tham Số | Kiểu | Vị Trí | Mô Tả |
|---------|------|--------|-------|
| `accountID` | Integer | Path | ID của tài khoản cần xóa |

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Xóa tài khoản người dùng thành công",
    "result": null
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Không tìm thấy Account với ID: {id} | Account không tồn tại |

---

## B. RESIDENT ROUTES - Quản Lý Cư Dân

### 1. Lấy Danh Sách Tất Cả Cư Dân

```http
GET /residents
```

**Mô Tả**: Truy xuất danh sách tất cả cư dân trong hệ thống.

**Tham Số**: Không có

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Success",
    "result": [
        {
            "id": 1,
            "fullName": "Nguyễn Văn Tuấn",
            "gender": "Male",
            "dateOfBirth": "1990-05-15",
            "identityId": "001090012345",
            "account": {
                "id": 2,
                "email": "resident.tuan@gmail.com",
                "username": "tuan01",
                "role": {
                    "id": 2,
                    "roleName": "RESIDENT"
                },
                "isActive": true
            }
        }
    ]
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Internal Server Error | Lỗi máy chủ |

---

### 2. Lấy Chi Tiết Cư Dân Theo ID

```http
GET /residents/{residentID}
```

**Mô Tả**: Truy xuất thông tin chi tiết của một cư dân cụ thể.

**Tham Số**:
| Tham Số | Kiểu | Vị Trí | Mô Tả |
|---------|------|--------|-------|
| `residentID` | Integer | Path | ID của cư dân cần lấy |

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Success",
    "result": {
        "id": 1,
        "fullName": "Nguyễn Văn Tuấn",
        "gender": "Male",
        "dateOfBirth": "1990-05-15",
        "identityId": "001090012345",
        "account": {
            "id": 2,
            "email": "resident.tuan@gmail.com",
            "username": "tuan01",
            "role": {
                "id": 2,
                "roleName": "RESIDENT"
            },
            "isActive": true
        }
    }
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Apartment not found | Cư dân không tồn tại |

---

### 3. Tạo Cư Dân Mới

```http
POST /residents
```

**Mô Tả**: Tạo một hồ sơ cư dân mới liên kết với tài khoản người dùng.

**Request Body**:
```json
{
    "fullName": "Trần Thị Thanh Thảo",
    "gender": "Female",
    "dateOfBirth": "1995-10-20",
    "identityId": "001095098765",
    "accountId": 6
}
```

**Tham Số Request**:
| Tham Số | Kiểu | Bắt Buộc | Mô Tả |
|---------|------|---------|-------|
| `fullName` | String | ✓ | Họ và tên cư dân |
| `gender` | String | ✗ | Giới tính (Male/Female/Other) |
| `dateOfBirth` | Date | ✗ | Ngày sinh (YYYY-MM-DD) |
| `identityId` | String | ✓ | Số CMND/CCCD (phải unique) |
| `accountId` | Integer | ✓ | ID của Account liên kết |

**Validations**:
| Trường | Quy Tắc | Lỗi |
|--------|--------|-----|
| `fullName` | Không được để trống | Lỗi validation |
| `identityId` | Tối đa 20 ký tự, phải unique | "Apartment not found" |
| `accountId` | Phải tồn tại trong table Accounts | "Không tìm thấy Account" |

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Tạo tài khoản người dân thành công!",
    "result": {
        "id": 6,
        "fullName": "Trần Thị Thanh Thảo",
        "gender": "Female",
        "dateOfBirth": "1995-10-20",
        "identityId": "001095098765",
        "account": {
            "id": 6,
            "email": "thao.tran@gmail.com",
            "username": "thao01"
        }
    }
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Apartment not found | Account không tồn tại |

---

### 4. Cập Nhật Thông Tin Cư Dân

```http
PUT /residents/{residentID}
```

**Mô Tả**: Cập nhật thông tin của một cư dân (chỉ fullName, gender, dateOfBirth).

**Tham Số**:
| Tham Số | Kiểu | Vị Trí | Mô Tả |
|---------|------|--------|-------|
| `residentID` | Integer | Path | ID của cư dân cần cập nhật |

**Request Body** (tất cả trường optional):
```json
{
    "fullName": "Trần Thị Thanh Thảo Mới",
    "gender": "Female",
    "dateOfBirth": "1995-10-20"
}
```

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Cập nhật thông tin thành công",
    "result": {
        "id": 6,
        "fullName": "Trần Thị Thanh Thảo Mới",
        "gender": "Female",
        "dateOfBirth": "1995-10-20",
        "identityId": "001095098765",
        "account": {
            "id": 6,
            "email": "thao.tran@gmail.com",
            "username": "thao01"
        }
    }
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Apartment not found | Cư dân không tồn tại |

---

### 5. Xóa Cư Dân

```http
DELETE /residents/{residentID}
```

**Mô Tả**: Xóa hồ sơ cư dân khỏi hệ thống (không thể khôi phục).

**Tham Số**:
| Tham Số | Kiểu | Vị Trí | Mô Tả |
|---------|------|--------|-------|
| `residentID` | Integer | Path | ID của cư dân cần xóa |

**Response (200 OK)**:
```json
{
    "code": 200,
    "message": "Xóa tài khoản cư dân thành công",
    "result": null
}
```

**Lỗi Có Thể Xảy Ra**:
| Status | Thông Báo | Mô Tả |
|--------|-----------|-------|
| 500 | Apartment not found | Cư dân không tồn tại |

---

## Ghi Chú

- Mật khẩu được mã hóa bằng **BCrypt** (độ mạnh: 10)
- **RoleId** mặc định = 2 (RESIDENT) nếu không cung cấp
- **isActive** mặc định = true nếu không cung cấp
- Email và Username phải **unique** trong hệ thống
- Khi lấy Account, password sẽ trả về dạng **hash** vì lý do bảo mật
- **Resident** phải được liên kết với một **Account** (accountId phải tồn tại)
- **IdentityId** (Số CMND/CCCD) phải **unique** trong bảng Residents
- Khi cập nhật Resident, chỉ có thể thay đổi fullName, gender, dateOfBirth (không thể thay đổi identityId, accountId)

