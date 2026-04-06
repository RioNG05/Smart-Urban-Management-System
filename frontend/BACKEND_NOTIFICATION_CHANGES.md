# Backend Notification Changes

## Muc dich

File nay ghi ro backend da duoc sua nhu the nao de he thong tu tao notification cho resident khi:

- admin/staff reply complaint
- booking service duoc approve
- booking service bi deny
- co bai viet moi duoc dang len

Tai lieu nay khong chi liet ke file da sua, ma con mo ta cu the da them gi, sua gi, va ly do sua.

---

## Tong quan thay doi

Backend da duoc chinh o 5 file:

1. `backend/src/main/java/com/example/backend/Service/ReplyService.java`
2. `backend/src/main/java/com/example/backend/Service/BookingServiceService.java`
3. `backend/src/main/java/com/example/backend/Service/NotificationService.java`
4. `backend/src/main/java/com/example/backend/Repository/NotificationRepository.java`
5. `backend/src/main/java/com/example/backend/Service/NewsService.java`

Huong lam la:

- khong tao API moi rieng cho tung case complaint/booking
- tan dung `NotificationService` da co san
- tai ngay trong service nghiep vu, sau khi action thanh cong thi goi tao notification

Dieu nay giup:

- khong can frontend tu goi API tao notification rieng
- tranh quen tao notification o UI
- notification duoc tao dung ngay tai noi xay ra nghiep vu

---

## 1. Sua `ReplyService.java`

### File

`backend/src/main/java/com/example/backend/Service/ReplyService.java`

### Truoc khi sua

Ham `create(ReplyCreateRequest request)` chi lam cac viec sau:

- tim `Complaint`
- tim `Account` cua nguoi reply
- tao object `Reply`
- save vao database
- tra `Reply` ve

No chua tao notification cho resident sau khi complaint duoc reply.

### Da sua gi

#### 1. Them dependency `NotificationService`

Da them field:

```java
private final NotificationService notificationService;
```

Va cap nhat constructor de inject them `NotificationService`.

#### 2. Sua ham `create(...)`

Truoc day:

```java
return replyRepository.save(reply);
```

Sau khi sua:

```java
Reply savedReply = replyRepository.save(reply);

createComplaintReplyNotification(complaint, user);

return savedReply;
```

Tuc la sau khi save reply thanh cong, backend se goi them logic tao notification.

#### 3. Them method moi `createComplaintReplyNotification(...)`

Method moi:

```java
private void createComplaintReplyNotification(Complaint complaint, Account repliedByUser)
```

Method nay lam cac viec:

- lay `receiverId` tu `complaint.getMadeByUser().getId()`
- lay `actorId` tu `repliedByUser.getId()`
- neu complaint khong co owner thi bo qua
- neu owner va nguoi reply la cung mot nguoi thi bo qua
- lay ten nguoi reply bang `username`, neu khong co thi dung `"Management team"`
- goi `notificationService.createNotification(...)`

#### 4. Notification duoc tao nhu the nao

Khi co reply complaint, notification tao ra co du lieu:

- `receiverId`: id cua resident tao complaint
- `targetRole`: `null`
- `title`: `Complaint updated`
- `message`: `actorName + " replied to your complaint. Open Resident Support to read the response."`
- `type`: `COMPLAINT_REPLY`
- `relatedUrl`: `/billing`

### Ket qua

Moi khi admin/staff reply complaint, resident se co 1 notification moi trong bang `Notifications`.

---

## 2. Sua `BookingServiceService.java`

### File

`backend/src/main/java/com/example/backend/Service/BookingServiceService.java`

### Truoc khi sua

Ham `update(Integer id, BookingServiceUpdateRequest request)` da co san logic:

- tim booking
- lay `oldStatus`
- update lai account, resource, time, totalAmount, status
- neu booking duoc approve tu `0 -> 1` thi tao invoice
- save booking

Van de la:

- booking approve thi co invoice, nhung resident khong nhan duoc notification
- booking deny cung khong co notification

### Da sua gi

#### 1. Them dependency `NotificationService`

Da them field:

```java
private final NotificationService notificationService;
```

Va inject vao constructor.

#### 2. Giu nguyen logic tao invoice cu

Logic cu van duoc giu:

```java
if(isApproved(oldStatus, booking.getStatus())){
    createInvoice(booking);
}
```

Tuc la:

- chi khi status doi tu `0` sang `1` moi tao invoice

#### 3. Thay doi cach save booking

Truoc day:

```java
return bookingRepository.save(booking);
```

Sau khi sua:

```java
BookingService savedBooking = bookingRepository.save(booking);

if (isDecisionStatusChange(oldStatus, savedBooking.getStatus())) {
    createBookingStatusNotification(savedBooking);
}

return savedBooking;
```

Nghia la:

- save booking truoc
- sau do neu status la mot quyet dinh xu ly (`Approved` hoac `Denied`) thi tao notification

#### 4. Them method moi `isDecisionStatusChange(...)`

Method moi:

```java
private boolean isDecisionStatusChange(Integer currentStatus, Integer updateStatus) {
    return currentStatus == 0 && (updateStatus == 1 || updateStatus == 2);
}
```

Y nghia:

- chi tao notification khi booking dang o `Pending`
- va duoc xu ly thanh `Approved` hoac `Denied`

Nhu vay se tranh:

- tao lai notification khi update booking lan 2
- tao notification khi status khong thay doi dung nghia

#### 5. Them method moi `createBookingStatusNotification(...)`

Method moi:

```java
private void createBookingStatusNotification(BookingService bookingService)
```

Method nay lam:

- lay `receiverId` tu `bookingService.getAccount().getId()`
- neu khong co account thi dung
- xac dinh booking co phai approved hay khong
- lay `serviceName` tu:
  - `bookingService.getServiceResource().getService().getServiceName()`
  - neu khong co thi fallback ve `"your booking"`
- goi `notificationService.createNotification(...)`

#### 6. Notification duoc tao nhu the nao

##### Truong hop approve

- `title`: `Booking approved`
- `message`: `Your booking for {serviceName} has been approved.`
- `type`: `BOOKING_APPROVED`
- `relatedUrl`: `/billing`

##### Truong hop deny

- `title`: `Booking denied`
- `message`: `Your booking for {serviceName} has been denied.`
- `type`: `BOOKING_DENIED`
- `relatedUrl`: `/billing`

### Ket qua

Khi staff/admin xu ly booking:

- `0 -> 1`: tao invoice + tao notification
- `0 -> 2`: khong tao invoice, nhung tao notification deny

---

## 3. Sua `NotificationService.java`

### File

`backend/src/main/java/com/example/backend/Service/NotificationService.java`

### Truoc khi sua

Service nay da co:

- `create(NotificationCreateRequest request)`
- `markAsRead(Integer id)`
- `getByUser(Integer userId)`
- `getUnread(Integer userId)`
- `countUnread(Integer userId)`
- `markAllAsRead(Integer userId)`

Nhung van de la:

- cac service nghiep vu nhu `ReplyService` va `BookingServiceService` neu muon tao notification thi phai tu build `NotificationCreateRequest`
- chua co helper gon hon de service ben trong backend goi truc tiep
- danh sach theo user chua co sap xep moi nhat truoc

### Da sua gi

#### 1. Tach logic tao notification thanh helper dung chung

Da giu lai method cu:

```java
public Notification create(NotificationCreateRequest request)
```

Nhung ben trong method nay khong tu build notification nua, ma goi sang method moi:

```java
return createNotification(
    request.getReceiverId(),
    request.getTargetRole(),
    request.getTitle(),
    request.getMessage(),
    request.getType(),
    request.getRelatedUrl()
);
```

#### 2. Them method moi `createNotification(...)`

Method moi:

```java
public Notification createNotification(
        Integer receiverId,
        String targetRole,
        String title,
        String message,
        String type,
        String relatedUrl
)
```

Method nay:

- neu co `receiverId` thi tim `Account receiver`
- build `Notification`
- set `isRead = false`
- set `createdAt = LocalDateTime.now()`
- save xuong database

Day la helper de cac service backend co the goi truc tiep ma khong can tao request DTO trung gian.

#### 3. Doi query lay notification theo user

Truoc day:

```java
return notificationRepository.findByReceiverId(userId);
```

Sau khi sua:

```java
return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
```

Muc dich:

- frontend nhan duoc danh sach notification moi nhat o tren dau

#### 4. Doi query lay unread notification

Truoc day:

```java
return notificationRepository.findByReceiverIdAndIsReadFalse(userId);
```

Sau khi sua:

```java
return notificationRepository.findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(userId);
```

Muc dich:

- unread notification cung co thu tu moi nhat truoc

### Ket qua

`NotificationService` gio vua giu duoc API cu, vua tro thanh mot service helper dung chung cho backend.

---

## 4. Sua `NotificationRepository.java`

### File

`backend/src/main/java/com/example/backend/Repository/NotificationRepository.java`

### Da sua gi

#### 1. Doi method query lay danh sach theo user

Truoc day:

```java
List<Notification> findByReceiverId(Integer receiverId);
```

Sau khi sua:

```java
List<Notification> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId);
```

#### 2. Doi method query lay unread

Truoc day:

```java
List<Notification> findByReceiverIdAndIsReadFalse(Integer receiverId);
```

Sau khi sua:

```java
List<Notification> findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(Integer receiverId);
```

#### 3. Chinh method `markAllAsRead(...)`

Da them `@Param("userId")` cho ro rang:

```java
@Modifying
@Query("UPDATE Notification n SET n.isRead = true WHERE n.receiver.id = :userId")
void markAllAsRead(@Param("userId") Integer userId);
```

Muc dich:

- ro rang parameter mapping trong JPQL
- an toan hon khi compile va maintain

---

## 5. Sua `NewsService.java`

### File

`backend/src/main/java/com/example/backend/Service/NewsService.java`

### Truoc khi sua

Ham `create(NewsCreateRequest request)` chi:

- tim user tao bai viet
- tao object `News`
- save vao database
- tra `NewsResponse`

Chua co notification nao duoc gui khi bai viet moi duoc dang.

### Da sua gi

#### 1. Them dependency `NotificationService`

Da them field:

```java
private final NotificationService notificationService;
```

Va inject vao constructor cua `NewsService`.

#### 2. Sua ham `create(...)`

Truoc day:

```java
return toResponse(newsRepository.save(news));
```

Sau khi sua:

```java
News savedNews = newsRepository.save(news);

createNewsPublishedNotifications(savedNews, user);

return toResponse(savedNews);
```

Tuc la:

- bai viet duoc save truoc
- sau do backend tao notification cho nguoi dung
- cuoi cung moi tra response ve frontend

#### 3. Them method moi `createNewsPublishedNotifications(...)`

Method moi:

```java
private void createNewsPublishedNotifications(News news, Account author)
```

Method nay lam cac viec:

- lay `newsTitle` tu `news.getTitle()`
- neu title rong thi fallback thanh `"a new article"`
- lay tat ca account bang `accountRepository.findAll()`
- loc chi nhung account co `isActive = true`
- bo qua account cua nguoi vua dang bai
- voi moi account con lai:
  - goi `notificationService.createNotification(...)`

#### 4. Notification duoc tao nhu the nao

Notification cho bai viet moi co du lieu:

- `receiverId`: id cua tung account dang active
- `targetRole`: `null`
- `title`: `New article published`
- `message`: `A new article has been posted: {newsTitle}`
- `type`: `NEWS_PUBLISHED`
- `relatedUrl`: `/news`

### Ket qua

Moi khi manager/admin dang bai viet moi:

- bai viet van duoc tao nhu cu
- he thong se tao them notification cho tat ca account dang active, tru nguoi dang bai
- frontend co the hien notification nay ngay tren bell da lam truoc do

---

## Chi tiet luong xu ly sau khi sua

### A. Complaint reply flow

1. Admin/staff goi API tao reply
2. `ReplyService.create(...)` duoc chay
3. Reply duoc save vao bang `Replies`
4. Backend lay owner cua complaint
5. Backend tao 1 dong moi trong bang `Notifications`
6. Frontend resident se doc notification qua API notifications

### B. Booking decision flow

1. Staff/admin update booking
2. `BookingServiceService.update(...)` duoc chay
3. Backend doc `oldStatus`
4. Backend cap nhat booking voi `newStatus`
5. Neu `0 -> 1` thi tao invoice
6. Neu `0 -> 1` hoac `0 -> 2` thi tao notification
7. Frontend resident se thay notification moi

### C. News publish flow

1. Manager/admin goi API tao bai viet
2. `NewsService.create(...)` duoc chay
3. Bai viet duoc save vao bang `News`
4. Backend lay danh sach account dang active
5. Backend bo qua nguoi vua dang bai
6. Backend tao notification cho tung account con lai
7. Frontend se doc notification moi qua API notifications

---

## Du lieu notification duoc tao

Bang `Notifications` dang duoc su dung voi nhung truong chinh:

- `ReceiverId`
- `TargetRole`
- `Title`
- `Message`
- `Type`
- `IsRead`
- `CreatedAt`
- `RelatedUrl`

Trong cac case vua sua:

- `ReceiverId` la resident lien quan
- `TargetRole` de `null`
- `IsRead` luon la `false` luc moi tao
- `CreatedAt` duoc set bang `LocalDateTime.now()`
- `RelatedUrl` voi complaint/booking la `/billing`
- `RelatedUrl` voi news moi la `/news`

---

## Cac API frontend hien dang tan dung

Frontend khong can API moi cho complaint/booking notification.
Frontend chi can dung API notification co san:

- `GET /api/notifications/user/{userId}`
- `GET /api/notifications/user/{userId}/unread/count`
- `PUT /api/notifications/{id}/read`
- `PUT /api/notifications/user/{userId}/read-all`

Notification duoc tao o backend nen UI chi viec doc va hien thi.

---

## Tom tat ngan

Da sua backend theo dung huong event trong service nghiep vu:

- `ReplyService`
  - sau khi save reply thi tao notification cho resident
- `BookingServiceService`
  - sau khi save booking thi tao notification neu booking duoc approve/deny
- `NewsService`
  - sau khi save bai viet thi tao notification cho cac account dang active
- `NotificationService`
  - them helper `createNotification(...)`
  - doi query lay danh sach moi nhat truoc
- `NotificationRepository`
  - bo sung method sort theo `CreatedAt desc`
  - sua `markAllAsRead` voi `@Param`

Ket qua la resident co the nhan notification tu dong ma frontend khong phai tu tao notification thu cong cho tung nghiep vu.

---

## Ghi chu mo rong sau nay

Tu cau truc nay co the them notification cho cac case khac rat de:

- contract duoc approve
- utility invoice moi duoc tao
- thanh toan thanh cong
- visitor request duoc chap nhan
- thong bao he thong theo role

Chi can them 1 loi goi `notificationService.createNotification(...)` tai service nghiep vu tuong ung.
