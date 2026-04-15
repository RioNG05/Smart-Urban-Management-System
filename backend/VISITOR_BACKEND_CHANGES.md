# Tài Liệu Thay Đổi Backend Cho Visitor

## 1. Mục đích tài liệu

File này ghi lại toàn bộ các thay đổi đã thực hiện ở backend để sửa chức năng `visitor`.

Nội dung tập trung trả lời 3 câu hỏi cho từng thay đổi:

- Đã sửa ở file nào
- Đã sửa như thế nào
- Vì sao cần sửa

Phạm vi API liên quan:

- `GET /api/visitors`
- `GET /api/visitors/{id}`
- `POST /api/visitors`
- `PUT /api/visitors/{id}`
- `DELETE /api/visitors/{id}`

## 2. Danh sách file backend đã sửa

- [StaffInfo.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/StaffInfo.java)
- [VisitorLog.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/VisitorLog.java)
- [VisitorCreateRequest.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/DTO/Request/visitorlog/VisitorCreateRequest.java)
- [VisitorUpdateRequest.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/DTO/Request/visitorlog/VisitorUpdateRequest.java)
- [VisitorLogService.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Service/VisitorLogService.java)

---

## 3. Thay đổi 1: Chặn vòng lặp JSON khi trả dữ liệu visitor

### File đã sửa

- [StaffInfo.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/StaffInfo.java)

### Đã sửa như thế nào

Trước khi sửa, trong `StaffInfo` có field:

```java
@OneToMany(mappedBy = "createdByStaff")
private List<VisitorLog> visitorLogs;
```

Đã thêm `@JsonIgnore` vào field này:

```java
@OneToMany(mappedBy = "createdByStaff")
@JsonIgnore
private List<VisitorLog> visitorLogs;
```

### Vì sao cần sửa

Khi gọi `GET /api/visitors`, backend trả `VisitorLog`.

Trong `VisitorLog` có:

- `createdByStaff`

Trong `StaffInfo` lại có:

- `visitorLogs`

Nên quá trình serialize JSON bị lặp:

- `VisitorLog -> StaffInfo -> visitorLogs -> VisitorLog -> StaffInfo -> ...`

Kết quả là API bị lỗi kiểu:

```text
Could not write JSON: Document nesting depth (501) exceeds the maximum allowed
```

### Kết quả sau khi sửa

- `GET /api/visitors` không còn bị loop JSON theo quan hệ ngược `visitorLogs`
- `GET /api/staff` cũng an toàn hơn vì không còn tự kéo theo toàn bộ visitor log

---

## 4. Thay đổi 2: Cho phép bỏ qua bản ghi staff bị lỗi liên kết

### File đã sửa

- [VisitorLog.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/VisitorLog.java)

### Đã sửa như thế nào

Ở quan hệ `createdByStaff`, đã thêm:

```java
@NotFound(action = NotFoundAction.IGNORE)
```

Đoạn sau khi sửa:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "CreatedByStaffId", nullable = false)
@NotFound(action = NotFoundAction.IGNORE)
private StaffInfo createdByStaff;
```

### Vì sao cần sửa

Trong dữ liệu hiện có, có một số `VisitorLog` đang trỏ tới `StaffInfo` không còn tồn tại hoặc không load được đúng cách.

Lỗi thực tế đã gặp:

```text
Could not write JSON: No row with the given identifier exists for entity [com.example.backend.Entity.StaffInfo with id '58']
```

Nếu không chặn lỗi này, chỉ cần 1 bản ghi visitor lỗi là cả API `/api/visitors` hỏng.

### Kết quả sau khi sửa

- visitor log có staff lỗi vẫn có thể được đọc
- backend bỏ qua `createdByStaff` lỗi thay vì làm hỏng cả danh sách

---

## 5. Thay đổi 3: Bổ sung field `identityCard` vào entity `VisitorLog`

### File đã sửa

- [VisitorLog.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/VisitorLog.java)

### Đã sửa như thế nào

Đã thêm field:

```java
@Column(name = "IdentityCard", nullable = false, length = 20)
private String identityCard;
```

### Vì sao cần sửa

Trong database, bảng `VisitorLogs` có cột:

```sql
IdentityCard VARCHAR(20) NOT NULL
```

Nhưng entity backend trước đó không có field này. Điều đó làm cho backend không thể ghi giá trị CCCD/Passport khi tạo visitor mới.

Lỗi thực tế đã gặp:

```text
Cannot insert the value NULL into column 'IdentityCard'
```

### Kết quả sau khi sửa

- entity backend khớp với schema database
- backend có thể lưu `IdentityCard` khi tạo hoặc cập nhật visitor

---

## 6. Thay đổi 4: Sửa DTO tạo mới visitor để nhận `identityCard`

### File đã sửa

- [VisitorCreateRequest.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/DTO/Request/visitorlog/VisitorCreateRequest.java)

### Đã sửa như thế nào

File DTO cũ chỉ có:

- `visitorName`
- `phoneNumber`
- `apartmentId`
- `staffId`
- `note`

Đã viết lại DTO và bổ sung:

```java
@NotBlank(message = "Identity card must not be blank")
String identityCard;
```

DTO hiện tại gồm:

```java
String visitorName;
String identityCard;
String phoneNumber;
Integer apartmentId;
Integer staffId;
String note;
```

### Vì sao cần sửa

Frontend đã cần gửi CCCD/Passport lên backend, nhưng DTO create trước đó không nhận field này.

Khi DTO không có `identityCard`, service không thể truyền dữ liệu xuống entity, dẫn đến DB báo lỗi `NULL`.

### Kết quả sau khi sửa

- `POST /api/visitors` nhận được `identityCard`
- backend validate được field này ngay từ request

---

## 7. Thay đổi 5: Sửa DTO cập nhật visitor để nhận `identityCard` và `apartmentId`

### File đã sửa

- [VisitorUpdateRequest.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/DTO/Request/visitorlog/VisitorUpdateRequest.java)

### Đã sửa như thế nào

File DTO update ban đầu chỉ có:

- `visitorName`
- `phoneNumber`
- `note`

Đã bổ sung:

```java
@NotBlank(message = "Identity card must not be blank")
private String identityCard;

@NotNull(message = "ApartmentId must not be null")
private Integer apartmentId;
```

### Vì sao cần sửa

Khi user sửa visitor ở frontend:

- cần sửa được CCCD/Passport
- cần đổi được `Assigned Apartment`

Nhưng backend cũ không hề nhận `identityCard` và `apartmentId` trong update request, nên FE có đổi cũng không có tác dụng.

### Kết quả sau khi sửa

- `PUT /api/visitors/{id}` nhận đủ dữ liệu để update visitor
- backend có thể cập nhật căn hộ được gán cho visitor

---

## 8. Thay đổi 6: Sửa service tạo visitor để lưu `identityCard`

### File đã sửa

- [VisitorLogService.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Service/VisitorLogService.java)

### Đã sửa như thế nào

Trong hàm `createVisitor`, đã bổ sung:

```java
visitorLog.setIdentityCard(request.getIdentityCard());
```

### Vì sao cần sửa

Ngay cả khi entity và DTO đã có `identityCard`, nếu service không set giá trị này vào entity thì dữ liệu vẫn không được lưu xuống DB.

### Kết quả sau khi sửa

- visitor mới tạo ra có `identityCard`
- lỗi `NULL IdentityCard` được xử lý đúng ở tầng nghiệp vụ

---

## 9. Thay đổi 7: Sửa service cập nhật visitor để cập nhật `identityCard` và `apartment`

### File đã sửa

- [VisitorLogService.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Service/VisitorLogService.java)

### Đã sửa như thế nào

Trong hàm `updateVisitor`, đã bổ sung:

```java
Apartment apartment = apartmentRepository.findById(request.getApartmentId())
        .orElseThrow(() -> new RuntimeException("Apartment not found"));

visitor.setIdentityCard(request.getIdentityCard());
visitor.setApartment(apartment);
```

### Vì sao cần sửa

Trước khi sửa, service update chỉ thay đổi:

- `visitorName`
- `phoneNumber`
- `note`

Điều đó làm cho:

- sửa CCCD không có tác dụng
- đổi `Assigned Apartment` ở frontend cũng không có tác dụng

### Kết quả sau khi sửa

- update visitor thực sự đổi được căn hộ
- update visitor thực sự sửa được CCCD/Passport

---

## 10. Tổng hợp lỗi thực tế đã xử lý

### Lỗi 1: Loop JSON khi lấy danh sách visitor

```text
Could not write JSON: Document nesting depth (501) exceeds the maximum allowed
```

Nguyên nhân:

- quan hệ 2 chiều giữa `VisitorLog` và `StaffInfo`

Đã xử lý bằng:

- thêm `@JsonIgnore` vào `StaffInfo.visitorLogs`

### Lỗi 2: Visitor log tham chiếu staff không còn tồn tại

```text
Could not write JSON: No row with the given identifier exists for entity [StaffInfo with id '58']
```

Nguyên nhân:

- dữ liệu cũ trong DB không sạch

Đã xử lý bằng:

- thêm `@NotFound(action = NotFoundAction.IGNORE)` cho `VisitorLog.createdByStaff`

### Lỗi 3: Không thêm được visitor mới

```text
Cannot insert the value NULL into column 'IdentityCard'
```

Nguyên nhân:

- DB bắt buộc `IdentityCard`
- entity, DTO và service backend chưa có field này

Đã xử lý bằng:

- thêm `identityCard` vào entity
- thêm `identityCard` vào create/update request
- set `identityCard` trong service create/update

### Lỗi 4: Không đổi được assigned apartment khi edit

Nguyên nhân:

- request update không có `apartmentId`
- service update không set lại apartment

Đã xử lý bằng:

- thêm `apartmentId` vào `VisitorUpdateRequest`
- load apartment mới trong service
- set `visitor.setApartment(apartment)`

---

## 11. Trạng thái sau khi sửa

Sau các thay đổi trên, backend visitor hiện đã hỗ trợ tốt hơn cho frontend:

- đọc danh sách visitor ổn định hơn
- tránh loop JSON
- chịu lỗi tốt hơn với dữ liệu staff cũ bị hỏng
- thêm visitor mới có CCCD/Passport
- sửa visitor có thể đổi CCCD và căn hộ

---

## 12. Khuyến nghị cải thiện tiếp theo

Hiện tại controller vẫn đang trả thẳng JPA entity. Đây là cách nhanh nhưng dễ phát sinh lỗi:

- loop JSON
- lazy loading lỗi
- dữ liệu trả ra dư thừa
- khó kiểm soát response

### Khuyến nghị

Nên chuyển sang DTO response riêng cho visitor, ví dụ:

- `id`
- `visitorName`
- `identityCard`
- `phoneNumber`
- `apartmentId`
- `apartmentRoomNumber`
- `apartmentFloorNumber`
- `staffId`
- `staffName`
- `checkInTime`
- `note`

### Lý do nên làm bước này

- response sẽ gọn và ổn định hơn
- tránh lỗi serialize entity về sau
- frontend dễ dùng hơn, không cần workaround

---

## 13. Kết luận

Các thay đổi backend lần này chủ yếu nhằm:

- làm cho API visitor trả dữ liệu ổn định
- đồng bộ backend với schema thật của database
- hỗ trợ đúng các thao tác create và update mà frontend cần

Nếu sau này cần review lại phần visitor, nên bắt đầu đọc theo thứ tự:

1. [VisitorLog.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/VisitorLog.java)
2. [StaffInfo.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Entity/StaffInfo.java)
3. [VisitorCreateRequest.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/DTO/Request/visitorlog/VisitorCreateRequest.java)
4. [VisitorUpdateRequest.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/DTO/Request/visitorlog/VisitorUpdateRequest.java)
5. [VisitorLogService.java](C:/Users/admin/Desktop/2026/OJT%20Project/vinhomes-clone/backend/src/main/java/com/example/backend/Service/VisitorLogService.java)
