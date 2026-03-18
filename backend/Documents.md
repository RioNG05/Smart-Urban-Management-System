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
- [J. Service Resource Routes](#j-service-resource-routes) — Tài nguyên dịch vụ
- [K. Staff Routes](#k-staff-routes) — Nhân viên
- [L. Stay At History Routes](#l-stay-at-history-routes) — Lịch sử lưu trú
- [M. Utilities Invoice Routes](#m-utilities-invoice-routes) — Hóa đơn tiện ích
- [N. Visitor Log Routes](#n-visitor-log-routes) — Nhật ký khách tham quan

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

## F. Apartment Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/apartments` | GET | Lấy tất cả căn hộ |
| `/apartments/{id}` | GET | Lấy 1 căn hộ |
| `/apartments` | POST | Tạo căn hộ |
| `/apartments/{id}` | PUT | Cập nhật căn hộ |
| `/apartments/{id}` | DELETE | Xóa căn hộ |

### ➕ POST /apartments — Tạo Căn Hộ

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

```json
{ "direction": "West", "status": 0 }
```
*Tất cả trường optional*

---

## G. Complaint Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/complaints` | GET | Lấy tất cả khiếu nại |
| `/complaints/{id}` | GET | Lấy 1 khiếu nại |
| `/complaints` | POST | Tạo khiếu nại |
| `/complaints/{id}` | PUT | Cập nhật khiếu nại |
| `/complaints/{id}` | DELETE | Xóa khiếu nại |

### ➕ POST /complaints — Tạo Khiếu Nại

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

```json
{ "content": "Nội dung khiếu nại mới" }
```
*Tất cả trường optional*

---

## H. Reply Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/replies` | GET | Lấy tất cả trả lời |
| `/replies/{id}` | GET | Lấy 1 trả lời |
| `/replies` | POST | Tạo trả lời |
| `/replies/{id}` | PUT | Cập nhật trả lời |
| `/replies/{id}` | DELETE | Xóa trả lời |
| `/replies/complaint/{complaintId}` | GET | Lấy trả lời của phàn nàn |

### ➕ POST /replies — Tạo Trả Lời

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

```json
{ "content": "Nội dung trả lời cập nhật" }
```
*Tất cả trường optional*

---

## I. Services Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/services` | GET | Lấy tất cả dịch vụ |
| `/services/{id}` | GET | Lấy 1 dịch vụ |
| `/services` | POST | Tạo dịch vụ |
| `/services/{id}` | PUT | Cập nhật dịch vụ |
| `/services/{id}` | DELETE | Xóa dịch vụ |

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
{ "feePerUnit": 60000.00 }
```
*Tất cả trường optional*

---

## J. Service Resource Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/service_resource` | GET | Lấy tất cả tài nguyên |
| `/service_resource/{id}` | GET | Lấy 1 tài nguyên |
| `/service_resource` | POST | Tạo tài nguyên |
| `/service_resource/{id}` | PUT | Cập nhật tài nguyên |
| `/service_resource/{id}` | DELETE | Xóa tài nguyên |

### ➕ POST /service_resource — Tạo Tài Nguyên Dịch Vụ

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

### ✏️ PUT /service_resource/{id} — Cập Nhật Tài Nguyên

```json
{ "location": "Tầng 2 - Phòng vệ sinh", "isAvailable": false }
```
*Tất cả trường optional*

---

## K. Staff Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/staff` | GET | Lấy tất cả nhân viên |
| `/staff/{id}` | GET | Lấy 1 nhân viên |
| `/staff` | POST | Tạo nhân viên |
| `/staff/{id}` | PUT | Cập nhật nhân viên |
| `/staff/{id}` | DELETE | Xóa nhân viên |

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
*Tất cả trường optional (trừ identityId)*

---

## L. Stay At History Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/stay_at_history` | GET | Lấy tất cả lịch sử |
| `/stay_at_history/{id}` | GET | Lấy 1 lịch sử |
| `/stay_at_history` | POST | Tạo lịch sử |
| `/stay_at_history/{id}` | PUT | Cập nhật lịch sử |
| `/stay_at_history/{id}` | DELETE | Xóa lịch sử |

### ➕ POST /stay_at_history — Tạo Lịch Sử Lưu Trú

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

### ✏️ PUT /stay_at_history/{id} — Cập Nhật Lịch Sử

```json
{ "moveOut": "2025-06-30" }
```
*Tất cả trường optional*

---

## M. Utilities Invoice Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/utilities_invoice` | GET | Lấy tất cả hóa đơn |
| `/utilities_invoice/{id}` | GET | Lấy 1 hóa đơn |
| `/utilities_invoice` | POST | Tạo hóa đơn |
| `/utilities_invoice/{id}` | PUT | Cập nhật hóa đơn |
| `/utilities_invoice/{id}` | DELETE | Xóa hóa đơn |

### ➕ POST /utilities_invoice — Tạo Hóa Đơn Tiện Ích

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

### ✏️ PUT /utilities_invoice/{id} — Cập Nhật Hóa Đơn

```json
{ "totalElectricUsed": 280, "status": 1 }
```
*Tất cả trường optional*

---

## N. Visitor Log Routes

| Endpoint | Method | Mô Tả |
|----------|--------|-------|
| `/visitors` | GET | Lấy tất cả khách tham quan |
| `/visitors/{id}` | GET | Lấy 1 khách tham quan |
| `/visitors` | POST | Tạo thông tin khách tham quan |
| `/visitors/{id}` | PUT | Cập nhật thông tin khách |
| `/visitors/{id}` | DELETE | Xóa thông tin khách |

### ➕ POST /visitors — Tạo Thông Tin Khách Tham quan

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
*Tất cả trường optional (trừ visitorName, phoneNumber)*

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

### Apartment
- **RoomNumber**: Unique, không được trùng
- **Status**: 0 = Trống, 1 = Đã cho thuê/bán (default)
- **Direction**: Hướng: East, West, North, South, Southeast, Southwest, Northeast, Northwest
- **FloorNumber**: Tầng có thể trùng (các phòng khác nhau trên cùng 1 tầng)

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

 