# API Documentation - Smart Urban System

**Base URL**: `http://localhost:8080/api` | **Format**: JSON | **Response**: `{ "code", "message", "result" }`

---

## 📋 Table of Contents
- [A. Account Routes](#a-account-routes) — Tài khoản người dùng
- [B. Resident Routes](#b-resident-routes) — Cư dân
- [C. Authentication Routes](#c-authentication-routes) — Đăng nhập & Token
- [D. Contract Routes](#d-contract-routes) — Hợp đồng
- [E. Apartment Type Routes](#e-apartment-type-routes) — Loại căn hộ
- [F. Apartment Routes](#f-apartment-routes) — Căn hộ
- [G. Complaint Routes](#g-complaint-routes) — Khiếu nại
- [H. Reply Routes](#h-reply-routes) — Trả lời khiếu nại
- [I. Services Routes](#i-services-routes) — Dịch vụ
- [J. Mandatory Services Routes](#j-mandatory-services-routes) — Dịch vụ bắt buộc
- [K. Service Resource Routes](#k-service-resource-routes) — Tài nguyên dịch vụ
- [L. Staff Routes](#l-staff-routes) — Nhân viên
- [M. Stay At History Routes](#m-stay-at-history-routes) — Lịch sử lưu trú
- [N. Utilities Invoice Routes](#n-utilities-invoice-routes) — Hóa đơn tiện ích
- [O. Visitor Log Routes](#o-visitor-log-routes) — Nhật ký khách tham quan
- [P. Booking Service Routes](#p-booking-service-routes) — Đặt dịch vụ
- [Q. Expense Routes](#q-expense-routes) — Chi phí
- [R. IoT Sync Log Routes](#r-iot-sync-log-routes) — Nhật ký đồng bộ IoT
- [S. Appointment Routes](#s-appointment-routes) — Lịch hẹn
- [T. Notification Routes](#t-notification-routes) — Thông báo
- [U. GetInTouch Routes](#u-getin-touch-routes) — Liên hệ
- [V. Cloudinary Routes](#v-cloudinary-routes) — Upload ảnh lên Cloudinary
- [W. Image Routes](#w-image-routes) — Upload ảnh cho căn hộ và dịch vụ
- [X. News Routes](#x-news-routes) — Tin tức & Thông báo
- [Y. Service Invoice Routes](#y-service-invoice-routes) — Hóa đơn dịch vụ

---

## A. Account Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/accounts` | GET | Lấy tất cả account |
| `/accounts/{id}` | GET | Lấy 1 account |
| `/accounts/search-by-username/{username}` | GET | Tìm account theo username |
| `/accounts` | POST | Tạo account |
| `/accounts/{id}` | PUT | Cập nhật account |
| `/accounts/change/role/{id}` | PUT | Thay đổi role của account |
| `/accounts/{id}` | DELETE | Xóa account |

### 📄 GET /accounts — Danh Sách Tất Cả Account

**Authorization**: `Account_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách tài khoản thành công", "result": [...] }`

### 📄 GET /accounts/{id} — Chi Tiết Account

**Authorization**: Chỉ xem account của chính mình hoặc có quyền `Account_R_01`  
**Response**: `{ "code": 200, "message": "Thông tin tài khoản id: {id}", "result": { "id": 1, "email": "user@example.com", "username": "username", "role": {...}, ... } }`  
**Errors**: `404` Account không tồn tại

### 📄 GET /accounts/search-by-username/{username} — Tìm Account Theo Username

**Response**: `{ "code": 200, "result": { "id": 1, "username": "tuan01", "email": "...", ... } }`  
**Errors**: `404` Account không tồn tại

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

### ✏️ PUT /accounts/{id} — Cập Nhật Account

**Authorization**: Có quyền `Account_U_01` hoặc cập nhật account của chính mình

```json
{ "email": "...", "username": "...", "password": "...", "isActive": false }
```
*Tất cả trường optional*

### ✏️ PUT /accounts/change/role/{id} — Thay Đổi Role

**Authorization**: `Account_U_03`

```json
{ "roleId": 3 }
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| roleId | Integer | ✓ | ID role mới |

**Response**: `{ "code": 200, "message": "Thay đổi role thành công!", "result": {...} }`

### ❌ DELETE /accounts/{id} — Xóa Account

**Authorization**: `Account_D_01`

---

## B. Resident Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/residents` | GET | Lấy tất cả resident |
| `/residents/{id}` | GET | Lấy 1 resident |
| `/residents` | POST | Tạo resident |
| `/residents/{id}` | PUT | Cập nhật resident |
| `/residents/{id}` | DELETE | Xóa resident |

### 📄 GET /residents — Danh Sách Tất Cả Resident

**Authorization**: `Resident_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách người dân thành công!", "result": [...] }`

### 📄 GET /residents/{id} — Chi Tiết Resident

**Authorization**: Xem thông tin cá nhân được phép hoặc có quyền `Resident_R_01`  
**Response**: `{ "code": 200, "message": "Thông tin người dân id: {id}", "result": { "id": 1, "fullName": "...", "gender": "Male", "dateOfBirth": "1990-05-15", "identityId": "001090012345", "account": {...}, ... } }`  
**Errors**: `404` Resident không tồn tại

### ➕ POST /residents — Tạo Resident

**Authorization**: `Resident_C_01`

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

**Authorization**: `Resident_U_01` hoặc cập nhật thông tin cá nhân

```json
{ "fullName": "...", "gender": "Female", "dateOfBirth": "..." }
```
*Chỉ cập nhật fullName, gender, dateOfBirth*

### ❌ DELETE /residents/{id} — Xóa Resident

**Authorization**: `Resident_D_01`

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
| `/contracts/list/account/{accountId}` | GET | Lấy contract của account |
| `/contracts/list/apartment/{apartmentId}` | GET | Lấy contract của căn hộ |
| `/contracts` | POST | Tạo contract |
| `/contracts/{id}` | PUT | Cập nhật contract |
| `/contracts/{id}` | DELETE | Xóa contract |

### 📄 GET /contracts — Danh Sách Tất Cả Contract

**Authorization**: `Contracts_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách hợp đồng thành công", "result": [...] }`

### 📄 GET /contracts/{id} — Chi Tiết Contract

**Authorization**: Có quyền xem hoặc thuộc contract  
**Response**: `{ "code": 200, "message": "Thông tin hợp đồng id: {id}", "result": { "id": 1, "apartmentId": 1, "accountId": 2, "contractType": "Residential", "startDate": "2024-01-01", "endDate": "2025-12-31", "monthlyRent": 5000000.00, "status": 1, ... } }`  
**Errors**: `404` Contract không tồn tại

### 📄 GET /contracts/list/account/{accountId} — Contract Của Account

**Authorization**: Chỉ xem contract của account mình hoặc có quyền `Contracts_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách hợp đồng thành công", "result": [...] }`  
**Errors**: `404` Account không tồn tại

### 📄 GET /contracts/list/apartment/{apartmentId} — Contract Của Căn Hộ

**Authorization**: `Contracts_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách hợp đồng của căn hộ thành công", "result": [...] }`  
**Errors**: `404` Căn hộ không tồn tại

### ➕ POST /contracts — Tạo Contract

**Authorization**: `Contracts_C_01`

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

**Authorization**: `Contracts_U_01`

```json
{ "endDate": "2026-12-31", "monthlyRent": 5500000.00, "status": 1 }
```
*Tất cả trường optional*

### ❌ DELETE /contracts/{id} — Xóa Contract

**Authorization**: `Contracts_D_01`

---

## E. Apartment Type Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/apartments/type` | GET | Lấy tất cả loại |
| `/apartments/type/{id}` | GET | Lấy 1 loại |
| `/apartments/type` | POST | Tạo loại |
| `/apartments/type/{id}` | PUT | Cập nhật loại |
| `/apartments/type/{id}` | DELETE | Xóa loại |

### 📄 GET /apartments/type — Danh Sách Tất Cả Loại Căn Hộ

**Response**: `{ "code": 200, "message": "Lấy danh sách kiểu căn hộ thành công!", "result": [...] }`

### 📄 GET /apartments/type/{id} — Chi Tiết Loại Căn Hộ

**Response**: `{ "code": 200, "message": "Thông tin kiểu căn hộ id: {id}", "result": { "id": 1, "name": "2 Bedrooms", "designSqrt": 75.50, "numberOfBedroom": 2, "numberOfBathroom": 2, "overview": "...", "commonPriceForBuying": 1800000000.00, "commonPriceForRent": 12000000.00, "furniture": 1, ... } }`  
**Errors**: `404` Loại căn hộ không tồn tại

### ➕ POST /apartments/type — Tạo Loại Căn Hộ

**Authorization**: `ApartmentTypes_C_01`

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

**Authorization**: `ApartmentTypes_U_01`

```json
{ "name": "...", "commonPriceForRent": 13000000.00 }
```
*Tất cả trường optional*

### ❌ DELETE /apartments/type/{id} — Xóa Loại

**Authorization**: `ApartmentTypes_D_01`

---

## F. Apartment Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/apartments` | GET | Lấy tất cả căn hộ |
| `/apartments/{id}` | GET | Lấy 1 căn hộ |
| `/apartments/list/type/{id}` | GET | Lấy căn hộ theo loại |
| `/apartments/search-by-number` | POST | Tìm căn hộ theo số phòng và tầng |
| `/apartments` | POST | Tạo căn hộ |
| `/apartments/{id}` | PUT | Cập nhật căn hộ |
| `/apartments/{id}` | DELETE | Xóa căn hộ |

### 📄 GET /apartments — Danh Sách Tất Cả Căn Hộ

**Response**: `{ "code": 200, "message": "Lấy danh sách căn hộ thành công", "result": [...] }`

### 📄 GET /apartments/{id} — Chi Tiết Căn Hộ

**Response**: `{ "code": 200, "message": "Thông tin căn hộ id: {id}", "result": { "id": 1, "roomNumber": 101, "floorNumber": 1, "direction": "East", "status": 1, "apartmentTypeId": 1, ... } }`  
**Errors**: `404` Căn hộ không tồn tại

### 📄 GET /apartments/list/type/{id} — Căn Hộ Theo Loại

**Response**: `{ "code": 200, "message": "Lấy danh sách căn hộ theo loại thành công", "result": [...] }`  
**Errors**: `404` Loại căn hộ không tồn tại

### 📄 POST /apartments/search-by-number — Tìm Căn Hộ Theo Số Phòng

```json
{
  "roomNumber": 101,
  "floorNumber": 1
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| roomNumber | Integer | ✓ | Số phòng |
| floorNumber | Integer | ✓ | Tầng |

**Response**: `{ "code": 200, "message": "Thông tin căn hộ", "result": {...} }`  
**Errors**: `404` Căn hộ không tồn tại

### ➕ POST /apartments — Tạo Căn Hộ

**Authorization**: `Apartments_C_01`

```json
{
  "roomNumber": 101,
  "floorNumber": 1,
  "direction": "East",
  "status": 1,
  "apartmentTypeId": 1
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| roomNumber | Integer | ✓ | Số phòng (unique) |
| floorNumber | Integer | ✓ | Số tầng |
| direction | String | ✗ | Hướng căn hộ (East, West, North, South) |
| status | Integer | ✗ | 0=Empty, 1=Occupied, Default=1 |
| apartmentTypeId | Integer | ✓ | ID loại căn hộ |

**Response**: `{ "code": 200, "message": "Tạo căn hộ thành công!", "result": {...} }`  
**Errors**: `500` ApartmentType không tồn tại | `400` RoomNumber đã tồn tại

### ✏️ PUT /apartments/{id} — Cập Nhật Căn Hộ

**Authorization**: `Apartments_U_01`

```json
{ "direction": "West", "status": 0 }
```
*Tất cả trường optional*

### ❌ DELETE /apartments/{id} — Xóa Căn Hộ

**Authorization**: `Apartments_D_01`

---

## G. Complaint Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/complaints` | GET | Lấy tất cả khiếu nại |
| `/complaints/{id}` | GET | Lấy 1 khiếu nại |
| `/complaints` | POST | Tạo khiếu nại |
| `/complaints/{id}` | PUT | Cập nhật khiếu nại |
| `/complaints/{id}` | DELETE | Xóa khiếu nại |

### 📄 GET /complaints — Danh Sách Tất Cả Khiếu Nại

**Authorization**: `Complaints_R_01`  
**Response**: `{ "code": 200, "result": [...] }`

### 📄 GET /complaints/{id} — Chi Tiết Khiếu Nại

**Authorization**: `Complaints_R_01` hoặc có quyền xem  
**Response**: `{ "code": 200, "result": { "id": 1, "content": "...", "userId": 5, ... } }`  
**Errors**: `404` Khiếu nại không tồn tại

### ➕ POST /complaints — Tạo Khiếu Nại

**Authorization**: `Complaints_C_01`

```json
{
  "content": "Tiếng ồn từ hàng xóm vào buổi tối",
  "userId": 5
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| content | String | ✓ | Nội dung khiếu nại, not blank |
| userId | Integer | ✓ | ID người khiếu nại |

**Response**: `{ "code": 200, "result": {...} }`  
**Errors**: `500` User không tồn tại

### ✏️ PUT /complaints/{id} — Cập Nhật Khiếu Nại

**Authorization**: `Complaints_U_02` hoặc có quyền xem

```json
{ "content": "Nội dung khiếu nại mới" }
```
*Tất cả trường optional*

### ❌ DELETE /complaints/{id} — Xóa Khiếu Nại

**Authorization**: `Complaints_D_01` hoặc có quyền xem

---

## H. Reply Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/replies` | GET | Lấy tất cả trả lời |
| `/replies/{id}` | GET | Lấy 1 trả lời |
| `/replies/complaint/{complaintId}` | GET | Lấy trả lời của khiếu nại |
| `/replies` | POST | Tạo trả lời |
| `/replies/{id}` | PUT | Cập nhật trả lời |
| `/replies/{id}` | DELETE | Xóa trả lời |

### 📄 GET /replies — Danh Sách Tất Cả Trả Lời

**Authorization**: `Replies_R_01`  
**Response**: `{ "code": 200, "result": [...] }`

### 📄 GET /replies/{id} — Chi Tiết Trả Lời

**Authorization**: `Replies_R_01` hoặc có quyền xem  
**Response**: `{ "code": 200, "result": { "id": 1, "content": "...", "complaintId": 3, "userId": 2, ... } }`  
**Errors**: `404` Trả lời không tồn tại

### 📄 GET /replies/complaint/{complaintId} — Trả Lời Của Khiếu Nại

**Authorization**: Có quyền xem khiếu nại  
**Response**: `{ "code": 200, "result": [...] }`  
**Errors**: `404` Khiếu nại không tồn tại

### ➕ POST /replies — Tạo Trả Lời

**Authorization**: `Replies_C_01`

```json
{
  "content": "Chúng tôi sẽ xem xét vấn đề này sớm",
  "complaintId": 3,
  "userId": 2
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| content | String | ✓ | Nội dung trả lời, max 2000 ký tự |
| complaintId | Integer | ✗ | ID khiếu nại (optional) |
| userId | Integer | ✓ | ID người trả lời |

**Response**: `{ "code": 200, "result": {...} }`  
**Errors**: `500` User/Complaint không tồn tại

### ✏️ PUT /replies/{id} — Cập Nhật Trả Lời

**Authorization**: `Replies_U_01`

```json
{ "content": "Nội dung trả lời cập nhật" }
```
*Tất cả trường optional*

### ❌ DELETE /replies/{id} — Xóa Trả Lời

**Authorization**: `Replies_D_01`

### 🔍 GET /replies/complaint/{complaintId} — Lấy Trả Lời Của Khiếu Nại

**Response**: `{ "code": 200, "result": [...] }`  
**Errors**: `404` Khiếu nại không tồn tại

---

## I. Services Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/services` | GET | Lấy tất cả dịch vụ |
| `/services/{id}` | GET | Lấy 1 dịch vụ |
| `/services` | POST | Tạo dịch vụ |
| `/services/{id}` | PUT | Cập nhật dịch vụ |
| `/services/{id}` | DELETE | Xóa dịch vụ |

### 📄 GET /services — Danh Sách Tất Cả Dịch Vụ

**Response**: `{ "code": 200, "message": "Lấy danh sách dịch vụ thành công!", "result": [...] }`

### 📄 GET /services/{id} — Chi Tiết Dịch Vụ

**Response**: `{ "code": 200, "message": "Thông tin dịch vụ id: {id}", "result": { "id": 1, "serviceName": "...", "serviceCode": "CLN001", ... } }`  
**Errors**: `404` Dịch vụ không tồn tại

### ➕ POST /services — Tạo Dịch Vụ

```json
{
  "serviceName": "Dịch vụ vệ sinh",
  "serviceCode": "CLN001",
  "feePerUnit": 50000.00,
  "unitType": "per_month"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| serviceName | String | ✓ | Tên dịch vụ |
| serviceCode | String | ✓ | Mã dịch vụ (unique) |
| feePerUnit | Decimal | ✓ | Giá theo đơn vị |
| unitType | String | ✓ | per_month, per_unit, per_service, etc. |

**Response**: `{ "code": 200, "message": "Tạo dịch vụ mới thành công!", "result": {...} }`  
**Errors**: `400` ServiceCode đã tồn tại

### ✏️ PUT /services/{id} — Cập Nhật Dịch Vụ

```json
{ "feePerUnit": 60000.00, "unitType": "per_day" }
```
*Tất cả trường optional*

### ❌ DELETE /services/{id} — Xóa Dịch Vụ

---

## J. Mandatory Services Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/mandatory-services` | GET | Lấy tất cả dịch vụ bắt buộc |
| `/mandatory-services/{id}` | GET | Lấy 1 dịch vụ bắt buộc |
| `/mandatory-services` | POST | Tạo dịch vụ bắt buộc |
| `/mandatory-services/{id}` | PUT | Cập nhật dịch vụ bắt buộc |
| `/mandatory-services/{id}` | DELETE | Xóa dịch vụ bắt buộc |

### 📄 GET /mandatory-services — Danh Sách Tất Cả Dịch Vụ Bắt Buộc

**Response**: `{ "code": 200, "message": "Lấy danh sách dịch vụ thành công!", "result": [...] }`

### 📄 GET /mandatory-services/{id} — Chi Tiết Dịch Vụ Bắt Buộc

**Response**: `{ "code": 200, "message": "Thông tin dịch vụ id: {id}", "result": { "id": 1, "serviceName": "...", "monthlyFee": 500000.00, ... } }`  
**Errors**: `404` Dịch vụ bắt buộc không tồn tại

### ➕ POST /mandatory-services — Tạo Dịch Vụ Bắt Buộc

```json
{
  "serviceName": "Phí quản lý bắt buộc",
  "monthlyFee": 500000.00
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| serviceName | String | ✓ | Tên dịch vụ |
| monthlyFee | Decimal | ✓ | Phí hàng tháng |

**Response**: `{ "code": 200, "message": "Tạo dịch vụ thành công!", "result": {...} }`

### ✏️ PUT /mandatory-services/{id} — Cập Nhật Dịch Vụ Bắt Buộc

```json
{ "monthlyFee": 550000.00 }
```
*Tất cả trường optional*

### ❌ DELETE /mandatory-services/{id} — Xóa Dịch Vụ Bắt Buộc

---

## K. Service Resource Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/service-resource` | GET | Lấy tất cả tài nguyên |
| `/service-resource/{id}` | GET | Lấy 1 tài nguyên |
| `/service-resource` | POST | Tạo tài nguyên |
| `/service-resource/{id}` | PUT | Cập nhật tài nguyên |
| `/service-resource/{id}` | DELETE | Xóa tài nguyên |

### 📄 GET /service-resource — Danh Sách Tất Cả Tài Nguyên Dịch Vụ

**Response**: `{ "code": 200, "message": "Lấy danh sách tài nguyên dịch vụ thành công!", "result": [...] }`

### 📄 GET /service-resource/{id} — Chi Tiết Tài Nguyên

**Response**: `{ "code": 200, "message": "Thông tin tài nguyên dịch vụ id: {id}", "result": { "id": 1, "resourceCode": "RES001", "location": "...", "serviceId": 1, ... } }`  
**Errors**: `404` Tài nguyên không tồn tại

### ➕ POST /service-resource — Tạo Tài Nguyên Dịch Vụ

```json
{
  "resourceCode": "RES001",
  "location": "Tầng 1 - Phòng vệ sinh",
  "serviceId": 1,
  "isAvailable": true
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| resourceCode | String | ✓ | Mã tài nguyên (unique) |
| location | String | ✓ | Vị trí tài nguyên |
| serviceId | Integer | ✓ | ID dịch vụ |
| isAvailable | Boolean | ✗ | Default = true |

**Response**: `{ "code": 200, "message": "Tạo tài nguyên dịch vụ mới thành công!", "result": {...} }`  
**Errors**: `500` Service không tồn tại | `400` ResourceCode đã tồn tại

### ✏️ PUT /service-resource/{id} — Cập Nhật Tài Nguyên

```json
{ "location": "Tầng 2 - Phòng vệ sinh", "isAvailable": false }
```
*Tất cả trường optional*

### ❌ DELETE /service-resource/{id} — Xóa Tài Nguyên

---

## L. Staff Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/staff` | GET | Lấy tất cả nhân viên |
| `/staff/{id}` | GET | Lấy 1 nhân viên |
| `/staff` | POST | Tạo nhân viên |
| `/staff/{id}` | PUT | Cập nhật nhân viên |
| `/staff/{id}` | DELETE | Xóa nhân viên |

### 📄 GET /staff — Danh Sách Tất Cả Nhân Viên

**Response**: `{ "code": 200, "result": [...] }`

### 📄 GET /staff/{id} — Chi Tiết Nhân Viên

**Response**: `{ "code": 200, "result": { "id": 1, "fullName": "Trần Văn B", "gender": "Male", "dateOfBirth": "1990-01-01", "identityId": "001990012345", "accountId": 8, ... } }`  
**Errors**: `404` Nhân viên không tồn tại

### ➕ POST /staff — Tạo Nhân Viên

```json
{
  "fullName": "Trần Văn B",
  "gender": "Male",
  "dateOfBirth": "1990-01-01",
  "identityId": "001990012345",
  "accountId": 8
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| fullName | String | ✓ | Họ tên nhân viên |
| gender | String | ✗ | Male/Female/Other |
| dateOfBirth | Date | ✗ | YYYY-MM-DD |
| identityId | String | ✓ | CMND/CCCD, unique, max 20 ký tự |
| accountId | Integer | ✓ | ID account liên kết |

**Response**: `{ "code": 200, "result": {...} }`  
**Errors**: `500` Account không tồn tại | `400` IdentityId đã tồn tại

### ✏️ PUT /staff/{id} — Cập Nhật Nhân Viên

```json
{ "fullName": "...", "gender": "Female" }
```
*Tất cả trường optional*

---

## M. Stay At History Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/stay-at-history` | GET | Lấy tất cả lịch sử |
| `/stay-at-history/{id}` | GET | Lấy 1 lịch sử |
| `/stay-at-history/resident/{residentId}` | GET | Lấy lịch sử của cư dân |
| `/stay-at-history/apartment/{apartmentId}` | GET | Lấy lịch sử của căn hộ |
| `/stay-at-history` | POST | Tạo lịch sử |
| `/stay-at-history/{id}` | PUT | Cập nhật lịch sử |
| `/stay-at-history/{id}` | DELETE | Xóa lịch sử |

### 📄 GET /stay-at-history — Danh Sách Tất Cả Lịch Sử Lưu Trú

**Response**: `{ "code": 200, "message": "Lấy danh sách lịch sử lưu trú thành công", "result": [...] }`

### 📄 GET /stay-at-history/{id} — Chi Tiết Lịch Sử Lưu Trú

**Response**: `{ "code": 200, "message": "Thông tin lịch sử lưu trú id: {id}", "result": { "id": 1, "residentId": 1, "apartmentId": 101, "moveIn": "2024-01-01", "moveOut": "2024-12-31", ... } }`  
**Errors**: `404` Lịch sử không tồn tại

### 📄 GET /stay-at-history/resident/{residentId} — Lịch Sử Lưu Trú Của Cư Dân

**Response**: `{ "code": 200, "message": "Thông tin lịch sử lưu trú của cư dân với id: {residentId}", "result": [...] }`  
**Errors**: `404` Cư dân không tồn tại

### 📄 GET /stay-at-history/apartment/{apartmentId} — Lịch Sử Lưu Trú Của Căn Hộ

**Response**: `{ "code": 200, "message": "Thông tin lịch sử lưu trú của căn hộ id: {apartmentId}", "result": [...] }`  
**Errors**: `404` Căn hộ không tồn tại

### ➕ POST /stay-at-history — Tạo Lịch Sử Lưu Trú

```json
{
  "residentId": 1,
  "apartmentId": 101,
  "moveIn": "2024-01-01",
  "moveOut": "2024-12-31"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| residentId | Integer | ✓ | ID cư dân |
| apartmentId | Integer | ✓ | ID căn hộ |
| moveIn | Date | ✓ | Ngày vào (YYYY-MM-DD) |
| moveOut | Date | ✗ | Ngày đi (optional, vô thời hạn nếu null) |

**Response**: `{ "code": 200, "message": "Tạo lịch sử lưu trú thành công!", "result": {...} }`  
**Errors**: `500` Resident/Apartment không tồn tại

### ✏️ PUT /stay-at-history/{id} — Cập Nhật Lịch Sử

```json
{ "moveOut": "2025-06-30" }
```
*Tất cả trường optional*

---

## N. Utilities Invoice Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/utilities-invoice` | GET | Lấy tất cả hóa đơn |
| `/utilities-invoice/{id}` | GET | Lấy 1 hóa đơn |
| `/utilities-invoice/apartment/{id}` | GET | Lấy hóa đơn của căn hộ |
| `/utilities-invoice` | POST | Tạo hóa đơn |
| `/utilities-invoice/{id}` | PUT | Cập nhật hóa đơn |
| `/utilities-invoice/{id}` | DELETE | Xóa hóa đơn |

### 📄 GET /utilities-invoice — Danh Sách Tất Cả Hóa Đơn

**Response**: `{ "code": 200, "message": "Lấy danh sách hóa đơn thành công", "result": [...] }`

### 📄 GET /utilities-invoice/{id} — Chi Tiết Hóa Đơn

**Response**: `{ "code": 200, "message": "Thông tin hóa đơn id: {id}", "result": { "id": 1, "apartmentId": 101, "billingMonth": 1, "billingYear": 2024, "totalElectricUsed": 250, "totalWaterUsed": 15, "status": 0, ... } }`  
**Errors**: `404` Hóa đơn không tồn tại

### 📄 GET /utilities-invoice/apartment/{id} — Hóa Đơn Của Căn Hộ

**Response**: `{ "code": 200, "message": "Danh sách hóa đơn của căn hộ id: {id}", "result": [...] }`  
**Errors**: `404` Căn hộ không tồn tại

### ➕ POST /utilities-invoice — Tạo Hóa Đơn Tiện Ích

```json
{
  "apartmentId": 101,
  "billingMonth": 1,
  "billingYear": 2024,
  "totalElectricUsed": 250,
  "totalWaterUsed": 15,
  "status": 0
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| apartmentId | Integer | ✓ | ID căn hộ |
| billingMonth | Integer | ✓ | Tháng (1-12) |
| billingYear | Integer | ✓ | Năm (YYYY) |
| totalElectricUsed | Integer | ✓ | Điện tiêu thụ (kWh) |
| totalWaterUsed | Integer | ✓ | Nước tiêu thụ (m³) |
| status | Integer | ✗ | 0=Pending, 1=Paid, Default=0 |

**Response**: `{ "code": 200, "message": "Tạo hóa đơn thành công!", "result": {...} }`  
**Errors**: `500` Apartment không tồn tại | `400` Hóa đơn tháng năm này đã tồn tại

### ✏️ PUT /utilities-invoice/{id} — Cập Nhật Hóa Đơn

```json
{ "totalElectricUsed": 280, "status": 1 }
```
*Tất cả trường optional*

---

## O. Visitor Log Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/visitors` | GET | Lấy tất cả khách tham quan |
| `/visitors/{id}` | GET | Lấy 1 khách tham quan |
| `/visitors` | POST | Tạo thông tin khách tham quan |
| `/visitors/{id}` | PUT | Cập nhật thông tin khách |
| `/visitors/{id}` | DELETE | Xóa thông tin khách |

### 📄 GET /visitors — Danh Sách Tất Cả Khách Tham Quan

**Response**: `{ "code": 200, "result": [...] }`

### 📄 GET /visitors/{id} — Chi Tiết Khách Tham Quan

**Response**: `{ "code": 200, "result": { "id": 1, "visitorName": "Đinh Văn C", "phoneNumber": "0901234567", "apartmentId": 101, "staffId": 1, "note": "Khách tham quan căn hộ mẫu", ... } }`  
**Errors**: `404` Khách tham quan không tồn tại

### ➕ POST /visitors — Tạo Thông Tin Khách Tham Quan

```json
{
  "visitorName": "Đinh Văn C",
  "phoneNumber": "0901234567",
  "apartmentId": 101,
  "staffId": 1,
  "note": "Khách tham quan căn hộ mẫu"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| visitorName | String | ✓ | Tên khách, not blank |
| phoneNumber | String | ✓ | Số điện thoại, not blank |
| apartmentId | Integer | ✓ | ID căn hộ tham quan |
| staffId | Integer | ✓ | ID nhân viên hỗ trợ |
| note | String | ✗ | Ghi chú thêm (optional) |

**Response**: `{ "code": 200, "result": {...} }`  
**Errors**: `500` Apartment/Staff không tồn tại | `400` Validation failed

### ✏️ PUT /visitors/{id} — Cập Nhật Khách Tham Quan

```json
{ "note": "Khách có hứng thú mua căn hộ" }
```
*Tất cả trường optional*

---

## P. Booking Service Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/bookings` | GET | Lấy tất cả đặt dịch vụ |
| `/bookings/{id}` | GET | Lấy 1 đặt dịch vụ |
| `/bookings/account/{accountId}` | GET | Lấy đặt dịch vụ của account |
| `/bookings` | POST | Tạo đặt dịch vụ |
| `/bookings/{id}` | PUT | Cập nhật đặt dịch vụ |
| `/bookings/{id}` | DELETE | Xóa đặt dịch vụ |

### 📄 GET /bookings — Danh Sách Tất Cả Đặt Dịch Vụ

**Authorization**: `BookingServices_R_01`  
**Response**: `{ "result": [ { "id": 1, "resourceId": 5, "accountId": 2, "bookFrom": "2024-01-15T09:00:00", "bookTo": "2024-01-15T12:00:00", "status": 1, "totalAmount": 150000.00, ... } ] }`

### 📄 GET /bookings/{id} — Chi Tiết Đặt Dịch Vụ

**Authorization**: `BookingServices_R_01` hoặc có quyền view booking này  
**Response**: `{ "result": { "id": 1, "resourceId": 5, "accountId": 2, "bookFrom": "2024-01-15T09:00:00", "bookTo": "2024-01-15T12:00:00", "status": 1, ... } }`  
**Errors**: `404` Đặt dịch vụ không tồn tại

### 📄 GET /bookings/account/{accountId} — Đặt Dịch Vụ Của Account

**Authorization**: Chỉ account chủ sở hữu hoặc có quyền `BookingServices_R_01`  
**Response**: `{ "result": [ {...} ] }`  
**Errors**: `404` Account không tồn tại

### ➕ POST /bookings — Tạo Đặt Dịch Vụ

**Authorization**: `BookingServices_C_01` hoặc là Resident

```json
{
  "resourceId": 5,
  "accountId": 2,
  "bookFrom": "2024-01-15T09:00:00",
  "bookTo": "2024-01-15T12:00:00",
  "status": 1,
  "totalAmount": 150000.00
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| resourceId | Integer | ✓ | ID tài nguyên dịch vụ |
| accountId | Integer | ✓ | ID account đặt |
| bookFrom | DateTime | ✓ | Thời gian bắt đầu (ISO 8601) |
| bookTo | DateTime | ✓ | Thời gian kết thúc (ISO 8601) |
| status | Integer | ✗ | 0=Pending, 1=Confirmed, 2=Cancelled, Default=1 |
| totalAmount | Decimal | ✗ | Tổng tiền dịch vụ |

**Response**: `{ "result": {...} }`  
**Errors**: `500` Resource/Account không tồn tại

### ✏️ PUT /bookings/{id} — Cập Nhật Đặt Dịch Vụ

**Authorization**: `BookingServices_U_01` hoặc là chủ sở hữu booking

```json
{ "bookFrom": "2024-01-15T10:00:00", "bookTo": "2024-01-15T13:00:00", "status": 2 }
```
*Tất cả trường optional*

### ❌ DELETE /bookings/{id} — Xóa Đặt Dịch Vụ

**Authorization**: `BookingServices_D_01` hoặc là chủ sở hữu booking

---

## Q. Expense Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/expenses` | GET | Lấy tất cả chi phí |
| `/expenses/{id}` | GET | Lấy 1 chi phí |
| `/expenses/apartment/{apartmentId}` | GET | Lấy chi phí của căn hộ |
| `/expenses` | POST | Tạo chi phí |
| `/expenses/{id}` | PUT | Cập nhật chi phí |
| `/expenses/{id}` | DELETE | Xóa chi phí |

### 📄 GET /expenses — Danh Sách Tất Cả Chi Phí

**Authorization**: `Expenses_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách chi phí thành công", "result": [...] }`

### 📄 GET /expenses/{id} — Chi Tiết Chi Phí

**Authorization**: `Expenses_R_01`  
**Response**: `{ "code": 200, "message": "Thông tin expense id: {id}", "result": { "id": 1, "apartmentId": 101, "amount": 2000000.00, "description": "Sửa chữa tường", "expenseDate": "2024-01-20", ... } }`  
**Errors**: `404` Chi phí không tồn tại

### 📄 GET /expenses/apartment/{apartmentId} — Chi Phí Của Căn Hộ

**Authorization**: `Expenses_R_01`  
**Response**: `{ "code": 200, "message": "Danh sách chi phí của căn hộ thành công", "result": [...] }`  
**Errors**: `404` Căn hộ không tồn tại

### ➕ POST /expenses — Tạo Chi Phí

**Authorization**: `Expenses_C_01`

```json
{
  "apartmentId": 101,
  "amount": 2000000.00,
  "description": "Sửa chữa tường",
  "expenseDate": "2024-01-20"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| apartmentId | Integer | ✓ | ID căn hộ |
| amount | Decimal | ✓ | Số tiền chi phí |
| description | String | ✗ | Mô tả chi phí |
| expenseDate | Date | ✓ | Ngày chi phí (YYYY-MM-DD) |

**Response**: `{ "code": 200, "message": "Tạo chi phí thành công!", "result": {...} }`  
**Errors**: `500` Apartment không tồn tại

### ✏️ PUT /expenses/{id} — Cập Nhật Chi Phí

**Authorization**: `Expenses_U_01`

```json
{ "amount": 2500000.00, "description": "Sửa chữa tường - bổ sung" }
```
*Tất cả trường optional*

### ❌ DELETE /expenses/{id} — Xóa Chi Phí

**Authorization**: `Expenses_D_01`

---

## R. IoT Sync Log Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/iot-logs` | GET | Lấy tất cả log IoT |
| `/iot-logs/{id}` | GET | Lấy 1 log IoT |
| `/iot-logs/apartment/{apartmentId}` | GET | Lấy log IoT của căn hộ |
| `/iot-logs` | POST | Tạo log IoT |
| `/iot-logs/{id}` | PUT | Cập nhật log IoT |
| `/iot-logs/{id}` | DELETE | Xóa log IoT |

### 📄 GET /iot-logs — Danh Sách Tất Cả Log IoT

**Authorization**: `IoT_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách log thành công", "result": [...] }`

### 📄 GET /iot-logs/{id} — Chi Tiết Log IoT

**Authorization**: `IoT_R_01`  
**Response**: `{ "code": 200, "message": "Thông tin log id: {id}", "result": { "id": 1, "apartmentId": 101, "deviceType": "Temperature Sensor", "status": "Success", "syncTime": "2024-01-20T10:30:00", ... } }`  
**Errors**: `404` Log không tồn tại

### 📄 GET /iot-logs/apartment/{apartmentId} — Log IoT Của Căn Hộ

**Authorization**: `IoT_R_01`  
**Response**: `{ "code": 200, "message": "Danh sách log căn hộ thành công", "result": [...] }`  
**Errors**: `404` Căn hộ không tồn tại

### ➕ POST /iot-logs — Tạo Log IoT

**Authorization**: `IoT_C_01`

```json
{
  "apartmentId": 101,
  "deviceType": "Temperature Sensor",
  "status": "Success",
  "syncTime": "2024-01-20T10:30:00"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| apartmentId | Integer | ✓ | ID căn hộ |
| deviceType | String | ✓ | Loại thiết bị |
| status | String | ✓ | Success, Failed, Pending, etc. |
| syncTime | DateTime | ✓ | Thời gian đồng bộ (ISO 8601) |

**Response**: `{ "code": 200, "message": "Tạo log thành công!", "result": {...} }`  
**Errors**: `500` Apartment không tồn tại

### ✏️ PUT /iot-logs/{id} — Cập Nhật Log IoT

**Authorization**: `IoT_U_01`

```json
{ "status": "Failed" }
```
*Tất cả trường optional*

### ❌ DELETE /iot-logs/{id} — Xóa Log IoT

**Authorization**: `IoT_D_01`

---

## S. Appointment Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/appointments` | GET | Lấy tất cả lịch hẹn |
| `/appointments/{id}` | GET | Lấy 1 lịch hẹn |
| `/appointments` | POST | Tạo lịch hẹn |
| `/appointments/{id}` | PUT | Cập nhật lịch hẹn |
| `/appointments/{id}` | DELETE | Xóa lịch hẹn |

### 📄 GET /appointments — Danh Sách Tất Cả Lịch Hẹn

**Response**: `{ "result": [...] }`

### 📄 GET /appointments/{id} — Chi Tiết Lịch Hẹn

**Response**: `{ "result": { "id": 1, "title": "Tham quan căn hộ", "description": "Tham quan căn hộ model", "appointmentDate": "2024-01-25", "appointmentTime": "10:00:00", "location": "Tầng 1", ... } }`  
**Errors**: `404` Lịch hẹn không tồn tại

### ➕ POST /appointments — Tạo Lịch Hẹn

```json
{
  "title": "Tham quan căn hộ",
  "description": "Tham quan căn hộ model",
  "appointmentDate": "2024-01-25",
  "appointmentTime": "10:00:00",
  "location": "Tầng 1"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| title | String | ✓ | Tiêu đề lịch hẹn |
| description | String | ✗ | Mô tả chi tiết |
| appointmentDate | Date | ✓ | Ngày hẹn (YYYY-MM-DD) |
| appointmentTime | Time | ✓ | Giờ hẹn (HH:MM:SS) |
| location | String | ✗ | Địa điểm |

**Response**: `{ "result": {...} }`  
**Errors**: `400` Validation failed

### ✏️ PUT /appointments/{id} — Cập Nhật Lịch Hẹn

```json
{ "title": "...", "appointmentDate": "2024-01-26", "appointmentTime": "14:00:00" }
```
*Tất cả trường optional*

### ❌ DELETE /appointments/{id} — Xóa Lịch Hẹn

---

## T. Notification Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/notifications` | GET | Lấy tất cả thông báo |
| `/notifications/user/{userId}` | GET | Lấy thông báo của user |
| `/notifications/user/{userId}/unread` | GET | Lấy thông báo chưa đọc |
| `/notifications/user/{userId}/unread/count` | GET | Đếm thông báo chưa đọc |
| `/notifications/role/{role}` | GET | Lấy thông báo theo role |
| `/notifications` | POST | Tạo thông báo |
| `/notifications/{id}/read` | PUT | Đánh dấu đã đọc |
| `/notifications/user/{userId}/read-all` | PUT | Đánh dấu tất cả đã đọc |
| `/notifications/{id}` | DELETE | Xóa thông báo |

### 📄 GET /notifications — Danh Sách Tất Cả Thông Báo

**Response**: `{ "result": [...] }`

### 📄 GET /notifications/user/{userId} — Thông Báo Của User

**Response**: `{ "result": [ { "id": 1, "userId": 5, "title": "Thông báo bảo trì hệ thống", "message": "Hệ thống sẽ bảo trì vào ngày 25/01", "isRead": false, "createdAt": "2024-01-20", ... } ] }`  
**Errors**: `404` User không tồn tại

### 📄 GET /notifications/user/{userId}/unread — Thông Báo Chưa Đọc

**Response**: `{ "result": [ {...} ] }`

### 📄 GET /notifications/user/{userId}/unread/count — Đếm Thông Báo Chưa Đọc

**Response**: `{ "result": 5 }`

### 📄 GET /notifications/role/{role} — Thông Báo Theo Role

**Response**: `{ "result": [...] }`

### ➕ POST /notifications — Tạo Thông Báo

```json
{
  "userId": 5,
  "title": "Thông báo bảo trì hệ thống",
  "message": "Hệ thống sẽ bảo trì vào ngày 25/01",
  "isRead": false
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| userId | Integer | ✓ | ID user nhận thông báo |
| title | String | ✓ | Tiêu đề thông báo |
| message | String | ✓ | Nội dung thông báo |
| isRead | Boolean | ✗ | Default = false |

**Response**: `{ "result": {...} }`

### ✏️ PUT /notifications/{id}/read — Đánh Dấu Đã Đọc

**Response**: `{ "result": { "id": 1, "isRead": true, ... } }`

### ✏️ PUT /notifications/user/{userId}/read-all — Đánh Dấu Tất Cả Đã Đọc

**Response**: `{ "message": "Đánh dấu thành công" }`

### ❌ DELETE /notifications/{id} — Xóa Thông Báo

---

## U. GetInTouch Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/getintouch` | GET | Lấy tất cả liên hệ |
| `/getintouch/{id}` | GET | Lấy 1 liên hệ |
| `/getintouch` | POST | Tạo liên hệ |
| `/getintouch/{id}` | DELETE | Xóa liên hệ |

### 📄 GET /getintouch — Danh Sách Tất Cả Liên Hệ

**Response**: `{ "result": [ { "id": 1, "fullName": "Nguyễn Văn A", "email": "user@example.com", "phoneNumber": "0901234567", "message": "Xin hỏi thông tin về căn hộ", "createdAt": "2024-01-20", ... } ] }`

### 📄 GET /getintouch/{id} — Chi Tiết Liên Hệ

**Response**: `{ "result": { "id": 1, "fullName": "Nguyễn Văn A", "email": "user@example.com", "phoneNumber": "0901234567", "message": "...", ... } }`  
**Errors**: `404` Liên hệ không tồn tại

### ➕ POST /getintouch — Tạo Liên Hệ

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "phoneNumber": "0901234567",
  "message": "Xin hỏi thông tin về căn hộ"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| fullName | String | ✓ | Họ tên người liên hệ |
| email | String | ✓ | Email |
| phoneNumber | String | ✓ | Số điện thoại |
| message | String | ✓ | Nội dung tin nhắn |

**Response**: `{ "result": {...} }`

### ❌ DELETE /getintouch/{id} — Xóa Liên Hệ

---

## V. Cloudinary Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/image/upload` | POST | Upload ảnh lên Cloudinary |

### 📤 POST /image/upload — Upload Ảnh Lên Cloudinary

**Authorization**: Public (không cần token)  
**Request Params**:
- `file` (MultipartFile) - Tệp ảnh (ảnh JPG, PNG, GIF)
- `name` (String) - Tên ảnh trong Cloudinary

**Response**:
```json
{
  "code": 200,
  "message": "Upload thành công",
  "result": {
    "publicId": "smart-urban/apartment_type_001",
    "url": "https://res.cloudinary.com/...cloudinary-url..."
  }
}
```

**Errors**: 
- `400` File không hợp lệ hoặc không upload được
- `500` Lỗi Cloudinary service

---

## W. Image Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/images/apartment-type` | POST | Upload ảnh cho loại căn hộ |
| `/images/service-resource` | POST | Upload ảnh cho tài nguyên dịch vụ |

### 📤 POST /images/apartment-type — Upload Ảnh Loại Căn Hộ

**Authorization**: Public (không cần token)  
**Request Params**:
- `apartmentTypeId` (Integer) - ID loại căn hộ
- `file` (MultipartFile) - Ảnh loại căn hộ

**Response**: `"https://res.cloudinary.com/...image-url..."`  
**Errors**: `500` ApartmentType không tồn tại hoặc lỗi upload

### 📤 POST /images/service-resource — Upload Ảnh Tài Nguyên Dịch Vụ

**Authorization**: Public (không cần token)  
**Request Params**:
- `serviceResourceId` (Integer) - ID tài nguyên dịch vụ
- `file` (MultipartFile) - Ảnh tài nguyên
- `description` (String, optional) - Mô tả ảnh

**Response**: `"https://res.cloudinary.com/...image-url..."`  
**Errors**: `500` ServiceResource không tồn tại hoặc lỗi upload

---

## X. News Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/news` | GET | Lấy tất cả tin tức |
| `/news/{id}` | GET | Lấy 1 tin tức |
| `/news` | POST | Tạo tin tức |
| `/news/{id}` | PUT | Cập nhật tin tức |
| `/news/{id}` | DELETE | Xóa tin tức |

### 📄 GET /news — Danh Sách Tất Cả Tin Tức

**Authorization**: Public (không cần token)  
**Response**: `{ "result": [ { "id": 1, "title": "Bảo trì hệ thống nước", "content": "...", "imageUrl": "...", "userId": 3, "createdAt": "2024-01-15", ... } ] }`

### 📄 GET /news/{id} — Chi Tiết Tin Tức

**Authorization**: Public  
**Response**: `{ "result": { "id": 1, "title": "...", "content": "...", "imageUrl": "...", "userId": 3, ... } }`  
**Errors**: `404` Tin tức không tồn tại

### ➕ POST /news — Tạo Tin Tức

**Authorization**: `News_C_01`

```json
{
  "title": "Bảo trì hệ thống nước",
  "content": "Định kỳ bảo trì hệ thống nước ngọt vào ngày 20/01/2024",
  "imageUrl": "https://...",
  "userId": 3
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| title | String | ✓ | Tiêu đề tin tức, not blank |
| content | String | ✓ | Nội dung chi tiết, not blank |
| imageUrl | String | ✗ | URL ảnh đại diện |
| userId | Integer | ✓ | ID người đăng tin |

**Response**: `{ "result": {...} }`  
**Errors**: `500` User không tồn tại

### ✏️ PUT /news/{id} — Cập Nhật Tin Tức

**Authorization**: `News_U_01`

```json
{ "title": "...", "content": "...", "imageUrl": "..." }
```
*Tất cả trường optional*

### ❌ DELETE /news/{id} — Xóa Tin Tức

**Authorization**: `News_D_01`

---

## Y. Service Invoice Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/service-invoice` | GET | Lấy tất cả hóa đơn dịch vụ |
| `/service-invoice/{id}` | GET | Lấy 1 hóa đơn dịch vụ |
| `/service-invoice` | POST | Tạo hóa đơn dịch vụ |
| `/service-invoice/{id}` | PUT | Cập nhật hóa đơn dịch vụ |
| `/service-invoice/{id}` | DELETE | Xóa hóa đơn dịch vụ |

### 📄 GET /service-invoice — Danh Sách Tất Cả Hóa Đơn Dịch Vụ

**Authorization**: `ServiceInvoices_R_01`  
**Response**: `{ "code": 200, "message": "Lấy danh sách hóa đơn dịch vụ thành công", "result": [ { "id": 1, "bookingServiceId": 5, "amount": 150000.00, "status": 0, "paymentDate": "2024-01-20", ... } ] }`

### 📄 GET /service-invoice/{id} — Chi Tiết Hóa Đơn Dịch Vụ

**Authorization**: `ServiceInvoices_R_01` hoặc có quyền view  
**Response**: `{ "code": 200, "message": "Thông tin hóa đơn dịch vụ id: {id}", "result": { "id": 1, "bookingServiceId": 5, "amount": 150000.00, "status": 0, "paymentDate": "2024-01-20", ... } }`  
**Errors**: `404` Hóa đơn dịch vụ không tồn tại

### ➕ POST /service-invoice — Tạo Hóa Đơn Dịch Vụ

**Authorization**: `ServiceInvoices_C_01`

```json
{
  "bookingServiceId": 5,
  "amount": 150000.00,
  "status": 0,
  "paymentDate": "2024-01-20T10:00:00"
}
```

| Field | Type | Yêu cầu | Chi tiết |
|-------|------|--------|---------|
| bookingServiceId | Integer | ✓ | ID booking dịch vụ |
| amount | Decimal | ✓ | Số tiền hóa đơn |
| status | Integer | ✗ | 0=Pending, 1=Paid, Default=0 |
| paymentDate | DateTime | ✓ | Ngày thanh toán dự kiến (ISO 8601) |

**Response**: `{ "code": 200, "message": "Tạo hóa đơn dịch vụ thành công!", "result": {...} }`  
**Errors**: `500` BookingService không tồn tại | `400` Validation failed

### ✏️ PUT /service-invoice/{id} — Cập Nhật Hóa Đơn Dịch Vụ

**Authorization**: `ServiceInvoices_U_01`

```json
{ "amount": 160000.00, "status": 1, "paymentDate": "2024-01-25T15:00:00" }
```
*Tất cả trường optional*

### ❌ DELETE /service-invoice/{id} — Xóa Hóa Đơn Dịch Vụ

**Authorization**: `ServiceInvoices_D_01`

---

## 📝 Notes

### Account & Authentication
- **Password**: BCrypt (độ mạnh 10)
- **RoleId**: Default = 2 (RESIDENT)
- **Email & Username**: Phải unique
- **JWT Token**: 1 giờ, Algorithm HS512
- **Claims**: `sub` (username), `iss` (sums.vn), `iat`, `exp`, `roleId`
- **Additional Endpoints**: Search by username, change role

### Resident
- Phải liên kết với Account
- **IdentityId**: Unique, max 20 ký tự
- **Cập nhật**: Chỉ fullName, gender, dateOfBirth

### Contract
- Liên kết: Apartment + Account
- **Status**: 1 = Active, 0 = Inactive
- **MonthlyRent**: Decimal(18,2)
- **EndDate**: Optional (vô thời hạn nếu null)
- **Multiple Endpoints**: Get by account, get by apartment

### Apartment Type
- **Name**: Studio, 1BR, 2BR, Penthouse, etc.
- **DesignSqrt**: Diện tích thiết kế (m²)
- **Furniture**: 0 = Không nội thất, 1 = Có nội thất
- **CommonPrice**: Giá tham khảo (mua/thuê)

### Apartment
- **RoomNumber**: Unique, không được trùng
- **Status**: 0 = Trống, 1 = Đã cho thuê/bán (default)
- **Direction**: Hướng: East, West, North, South, Southeast, Southwest, Northeast, Northwest
- **FloorNumber**: Tầng có thể trùng (các phòng khác nhau trên cùng 1 tầng)
- **Search**: Có thể tìm kiếm bằng số phòng và tầng

### Complaint & Reply
- **Complaint**: User khiếu nại về vấn đề trong khu phức hợp
- **Reply**: Nhân viên hoặc quản lý trả lời khiếu nại
- **Content**: Nội dung không được để trống
- **Max Length**: Reply content ≤ 2000 ký tự

### Services & Service Resource
- **Services**: Danh sách dịch vụ khả dụng (vệ sinh, bảo vệ, vận chuyển, etc.)
- **Service Resource**: Tài nguyên để cung cấp dịch vụ (máy móc, phòng, dụng cụ)
- **FeePerUnit**: Giá dịch vụ theo đơn vị (tháng, phòng, lần, etc.)
- **UnitType**: per_month, per_unit, per_service, per_apartment, per_day, etc.
- **IsAvailable**: Tài nguyên có sẵn để sử dụng hay không
- **MandatoryServices**: Dịch vụ bắt buộc phải thanh toán hàng tháng

### Staff
- **Staff**: Nhân viên làm việc trong khu phức hợp
- **Liên kết**: Phải có Account để đăng nhập hệ thống
- **IdentityId**: CMND/CCCD, unique, max 20 ký tự
- **Cập nhật**: fullName, gender, dateOfBirth (không cập nhật identityId)

### Stay At History
- **MoveIn**: Ngày bắt đầu lưu trú (bắt buộc)
- **MoveOut**: Ngày kết thúc lưu trú (optional, null nếu vô thời hạn)
- **Tracking**: Theo dõi lịch sử lưu trú của cư dân qua các căn hộ
- **Multiple Apartments**: Một cư dân có thể lưu trú ở nhiều căn hộ khác nhau qua thời gian

### Utilities Invoice
- **Billing Period**: Tháng và năm (1-12 và YYYY)
- **Status**: 0 = Pending (chưa thanh toán), 1 = Paid (đã thanh toán)
- **Usage Units**: Điện (kWh), Nước (m³)
- **Unique**: Một căn hộ không thể có 2 hóa đơn cho cùng 1 tháng/năm
- **Calculation**: Chi phí = (Electric Used × Electric Price) + (Water Used × Water Price)

### Visitor Log
- **Tracking**: Ghi nhận khách tham quan, khách thăm căn hộ
- **Staff Assignment**: Quy định nhân viên hỗ trợ khách
- **Apartment**: Căn hộ nào được tham quan
- **Contact**: Tên và số điện thoại khách bắt buộc
- **Note**: Có thể ghi chú về khách (ý định mua, feedback, etc.)

### Booking Service
- **Tracking**: Ghi nhận đặt dịch vụ từ cư dân
- **Resource**: Liên kết đến tài nguyên dịch vụ cụ thể
- **Time Slot**: bookFrom và bookTo xác định khoảng thời gian booking
- **Status**: 0=Pending, 1=Confirmed, 2=Cancelled
- **Amount**: Tổng chi phí dịch vụ được tính khi booking
- **Access Control**: Cư dân chỉ có thể xem booking của chính mình

### Expense
- **Tracking**: Ghi nhận chi phí cho căn hộ (sửa chữa, bảo dưỡng, etc.)
- **Amount**: Số tiền chi phí (Decimal)
- **Description**: Mô tả nội dung chi phí
- **ExpenseDate**: Ngày chi phí phát sinh
- **Apartment**: Chi phí ghi nhận cho căn hộ cụ thể

### IoT Sync Log
- **Tracking**: Ghi nhận kết quả đồng bộ dữ liệu từ thiết bị IoT
- **DeviceType**: Loại thiết bị (Temperature Sensor, Motion Detector, etc.)
- **Status**: Success, Failed, Pending
- **SyncTime**: Thời gian đồng bộ
- **Apartment**: Thiết bị IoT gắn với căn hộ nào

### Appointment
- **Booking**: Giúp khách hàng đặt lịch tham quan căn hộ
- **Date & Time**: Ngày và giờ hẹn cụ thể
- **Location**: Địa điểm tham quan căn hộ
- **Description**: Chi tiết về lịch hẹn

### Notification
- **User Tracking**: Gửi thông báo cho các user cụ thể
- **Role Tracking**: Có thể gửi thông báo theo role (Admin, Staff, Resident)
- **ReadStatus**: Theo dõi trạng thái đã đọc/chưa đọc
- **UnreadCount**: Đếm số thông báo chưa đọc của user

### GetInTouch
- **Contact Form**: Form liên hệ từ khách hàng trên website
- **MessageStorage**: Lưu trữ các tin nhắn từ khách hàng
- **NoAuth**: Không cần xác thực để gửi form liên hệ

### Image Upload (Cloudinary & Local)
- **Cloudinary**: Upload ảnh lên Cloudinary cloud storage
- **Cloudinary Response**: Trả về `publicId` (identifier) và `url` (public link)
- **Apartment Type Image**: Ảnh loại căn hộ để hiển thị cho khách hàng
- **Service Resource Image**: Ảnh tài nguyên dịch vụ (máy móc, phòng, dụng cụ)
- **File Support**: JPG, PNG, GIF
- **No Auth Required**: Endpoints upload ảnh không cần xác thực

### News
- **Public Access**: Tin tức công khai, ai cũng có thể đọc
- **Admin Post**: Chỉ admin (News_C_01) mới có thể tạo/sửa/xóa
- **Media**: Hỗ trợ ảnh đại diện
- **Timestamps**: Tự động record createdAt, updatedAt
- **Content**: Tiêu đề và nội dung không được để trống

### Service Invoice
- **Linked**: Được tạo từ BookingService
- **Status**: 0=Pending (chưa thanh toán), 1=Paid (đã thanh toán)
- **Amount**: Số tiền cần thanh toán
- **PaymentDate**: Dự kiến ngày thanh toán
- **Tracking**: Theo dõi thanh toán dịch vụ từng booking

---

### General Notes
- **Timestamps**: Tất cả entities đều có `createdAt` và `updatedAt` (tự động)
- **Soft Delete**: Một số entities có thể dùng soft delete (isDeleted flag)
- **Validation**: All request objects are validated using Jakarta Validation
- **Response Format**: Tất cả responses tuân theo format `{ "code", "message", "result" }`
- **Error Codes**: 
  - 200 = Success
  - 400 = Bad Request / Validation failed
  - 401 = Unauthorized
  - 403 = Forbidden
  - 404 = Not Found
  - 500 = Internal Server Error
- **New Features**: Các API mới được thêm vào bao gồm Expense Management, IoT Logging, Appointment Booking, Notification System, GetInTouch Contact Form, và Mandatory Services

