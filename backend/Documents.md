# API Documentation - Smart Urban System

**Base URL**: `http://localhost:8080/api` | **Format**: JSON | **Response**: `{ "code", "message", "result" }`

---

## 📋 Table of Contents
- [A. Account Routes](#a-account-routes) — Tài khoản người dùng
- [B. Resident Routes](#b-resident-routes) — Cư dân
- [C. Authentication Routes](#c-authentication-routes) — Đăng nhập & Token
- [D. Contract Routes](#d-contract-routes) — Hợp đồng
- [E. Apartment Type Routes](#e-apartment-type-routes) — Loại căn hộ

---

## A. Account Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/accounts` | GET | Lấy tất cả account |
| `/accounts/{id}` | GET | Lấy 1 account |
| `/accounts` | POST | Tạo account |
| `/accounts/{id}` | PUT | Cập nhật account |
| `/accounts/{id}` | DELETE | Xóa account |

### ➕ POST /accounts — Tạo Account

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password@123",
  "roleId": 2
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| email | String | ✓ | Unique |
| username | String | ✓ | Min 6 ký tự, unique |
| password | String | ✓ | Min 8 ký tự, phải có chữ hoa, thường, số, ký tự đặc biệt |
| roleId | Integer | ✗ | Default = 2 (RESIDENT) |

**Response**: `{ "code": 200, "message": "Tạo người dùng thành công!", "result": {...} }`  
**Errors**: `400` Validation | `500` Email/Username trùng | `500` Role không tồn tại

---

### ✏️ PUT /accounts/{id} — Cập Nhật Account

```json
{ "email": "...", "username": "...", "password": "...", "roleId": 3, "isActive": false }
```
*Tất cả trường optional*

---

## B. Resident Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/residents` | GET | Lấy tất cả resident |
| `/residents/{id}` | GET | Lấy 1 resident |
| `/residents` | POST | Tạo resident |
| `/residents/{id}` | PUT | Cập nhật resident |
| `/residents/{id}` | DELETE | Xóa resident |

### ➕ POST /residents — Tạo Resident

```json
{
  "fullName": "Nguyễn Văn A",
  "gender": "Male",
  "dateOfBirth": "1990-05-15",
  "identityId": "001090012345",
  "accountId": 2
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| fullName | String | ✓ | Họ tên |
| gender | String | ✗ | Male/Female/Other |
| dateOfBirth | Date | ✗ | YYYY-MM-DD |
| identityId | String | ✓ | Max 20 ký tự, unique |
| accountId | Integer | ✓ | Phải tồn tại |

**Response**: `{ "code": 200, "message": "Tạo tài khoản người dân thành công!", "result": {...} }`  
**Errors**: `500` Account không tồn tại

### ✏️ PUT /residents/{id} — Cập Nhật Resident

```json
{ "fullName": "...", "gender": "...", "dateOfBirth": "..." }
```
*Chỉ cập nhật fullName, gender, dateOfBirth*

---

## C. Authentication Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/auth/token` | POST | Đăng nhập (lấy token) |
| `/auth/introspect` | POST | Kiểm tra token |
| `/auth/accounts/me` | GET | Thông tin account hiện tại |
| `/auth/profile/me` | GET | Hồ sơ người dùng hiện tại |

### 🔓 POST /auth/token — Đăng Nhập

```json
{ "username": "tuan01", "password": "password123" }
```

**Response**:
```json
{ 
  "code": 200, 
  "result": { "token": "eyJ...", "authenticated": true }
}
```

**Token**: Algorithm HS512, Duration 1 giờ  
**Errors**: `500` Username/password sai

### 🔍 POST /auth/introspect — Kiểm Tra Token

```json
{ "token": "eyJ..." }
```

**Response**: `{ "code": 200, "result": { "valid": true } }`

### 👤 GET /auth/accounts/me — Thông Tin Account

**Header**: `Authorization: Bearer {token}`  
**Response**: `{ "code": 200, "result": { "username": "...", "email": "...", "role": {...} } }`  
**Errors**: `400` Unauthorized | `500` Account không tồn tại

### 👥 GET /auth/profile/me — Hồ Sơ người dùng

**Header**: `Authorization: Bearer {token}`  
**Response**: `{ "code": 200, "result": { "fullName": "...", "account": {...} } }`  
**Errors**: `400` Unauthorized | `500` Resident profile không tồn tại

---

## D. Contract Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/contracts` | GET | Lấy tất cả contract |
| `/contracts/{id}` | GET | Lấy 1 contract |
| `/contracts` | POST | Tạo contract |
| `/contracts/{id}` | PUT | Cập nhật contract |
| `/contracts/{id}` | DELETE | Xóa contract |

### ➕ POST /contracts — Tạo Contract

```json
{
  "apartmentId": 1,
  "accountId": 2,
  "contractType": "Residential",
  "startDate": "2024-01-01",
  "endDate": "2025-12-31",
  "monthlyRent": 5000000.00,
  "status": 1
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| apartmentId | Integer | ✓ | ID căn hộ |
| accountId | Integer | ✓ | ID account |
| contractType | String | ✗ | Residential, Commercial, etc. |
| startDate | Date | ✓ | YYYY-MM-DD |
| endDate | Date | ✗ | YYYY-MM-DD, optional |
| monthlyRent | Decimal | ✗ | Tiền thuê hàng tháng |
| status | Integer | ✗ | 1=Active (default), 0=Inactive |

**Response**: `{ "code": 200, "message": "Tạo hợp đồng thành công!", "result": {...} }`  
**Errors**: `500` Apartment/Account không tồn tại

### ✏️ PUT /contracts/{id} — Cập Nhật Contract

```json
{ "endDate": "2026-12-31", "monthlyRent": 5500000.00, "status": 1 }
```
*Tất cả trường optional*

---

## E. Apartment Type Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/apartments/type` | GET | Lấy tất cả loại |
| `/apartments/type/{id}` | GET | Lấy 1 loại |
| `/apartments/type` | POST | Tạo loại |
| `/apartments/type/{id}` | PUT | Cập nhật loại |
| `/apartments/type/{id}` | DELETE | Xóa loại |

### ➕ POST /apartments/type — Tạo Loại Căn Hộ

```json
{
  "name": "2 Bedrooms",
  "designSqrt": 75.50,
  "numberOfBedroom": 2,
  "numberOfBathroom": 2,
  "overview": "Căn hộ 2 phòng ngủ tiêu chuẩn",
  "commonPriceForBuying": 1800000000.00,
  "commonPriceForRent": 12000000.00,
  "furniture": 1
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| name | String | ✓ | Max 100 ký tự |
| designSqrt | Decimal | ✗ | Diện tích (m²) |
| numberOfBedroom | Integer | ✗ | Default = 1 |
| numberOfBathroom | Integer | ✗ | Default = 1 |
| overview | String | ✗ | Mô tả chi tiết |
| commonPriceForBuying | Decimal | ✗ | Giá mua trung bình |
| commonPriceForRent | Decimal | ✗ | Giá thuê trung bình |
| furniture | Integer | ✗ | 0=Không, 1=Có |

**Response**: `{ "code": 200, "message": "Tạo kiểu căn hộ mới thành công!", "result": {...} }`  
**Errors**: `400` Validation

### ✏️ PUT /apartments/type/{id} — Cập Nhật Loại

```json
{ "name": "...", "commonPriceForRent": 13000000.00 }
```
*Tất cả trường optional*

---

## 📝 Notes

### Account & Authentication
- **Password**: BCrypt (độ mạnh 10)
- **RoleId**: Default = 2 (RESIDENT)
- **Email & Username**: Phải unique
- **JWT Token**: 1 giờ, Algorithm HS512
- **Claims**: `sub` (username), `iss` (sums.vn), `iat`, `exp`, `roleId`

### Resident
- Phải liên kết với Account
- **IdentityId**: Unique, max 20 ký tự
- **Cập nhật**: Chỉ fullName, gender, dateOfBirth

### Contract
- Liên kết: Apartment + Account
- **Status**: 1 = Active, 0 = Inactive
- **MonthlyRent**: Decimal(18,2)
- **EndDate**: Optional (vô thời hạn nếu null)

### Apartment Type
- **Name**: Studio, 1BR, 2BR, Penthouse, etc.
- **DesignSqrt**: Diện tích thiết kế (m²)
- **Furniture**: 0 = Không nội thất, 1 = Có nội thất
- **CommonPrice**: Giá tham khảo (mua/thuê)

 