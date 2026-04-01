# Frontend Documentation - Smart Urban System

**Project**: `vinhomes-clone/frontend`  
**Stack**: `React 19` + `Vite` + `React Router` + `Axios`  
**Backend Base URL**: `http://localhost:8080/api`  
**Backend Response Format**: `{ "code", "message", "result" }`

---

## Table of Contents

- [A. Muc dich tai lieu](#a-muc-dich-tai-lieu)
- [B. Kien truc frontend tong the](#b-kien-truc-frontend-tong-the)
- [C. Entry points va luong khoi dong](#c-entry-points-va-luong-khoi-dong)
- [D. Routing va phan quyen](#d-routing-va-phan-quyen)
- [E. Quy uoc doc backend response trong frontend](#e-quy-uoc-doc-backend-response-trong-frontend)
- [F. Services layer va data mapping](#f-services-layer-va-data-mapping)
- [G. Domain: News](#g-domain-news)
- [H. Domain: Apartments va Property Listing](#h-domain-apartments-va-property-listing)
- [I. Domain: Services va Booking](#i-domain-services-va-booking)
- [J. Domain: Billing](#j-domain-billing)
- [K. Domain: Profile va Authentication](#k-domain-profile-va-authentication)
- [L. Domain: Admin](#l-domain-admin)
- [M. Domain: Staff](#m-domain-staff)
- [N. Shared Components va Styles](#n-shared-components-va-styles)
- [O. Cach them mot man hinh moi](#o-cach-them-mot-man-hinh-moi)
- [P. Cach them mot API moi tu backend](#p-cach-them-mot-api-moi-tu-backend)
- [Q. Checklist khi nhan response backend moi](#q-checklist-khi-nhan-response-backend-moi)
- [R. Thu tu file nen doc khi onboarding](#r-thu-tu-file-nen-doc-khi-onboarding)

---

## A. Muc dich tai lieu

Tai lieu nay duoc viet de frontend dev co the:

- nhin vao codebase la biet cac domain dang nam o dau
- nhin vao API backend la biet can map vao service/page/component nao
- biet khi them 1 tinh nang moi thi phai sua nhung file nao
- khong can mo tung file de doan luong du lieu

Noi thang ra: backend tra ve du lieu gi, frontend dang an vao dau, xu ly the nao, render o dau, tai lieu nay phai tra loi duoc.

---

## B. Kien truc frontend tong the

Frontend duoc to chuc theo flow:

1. `Route`
2. `Page`
3. `Section Component`
4. `Service`
5. `Axios API`
6. `Backend Response`
7. `Normalize / Map Data`
8. `Render UI`

So do thuc te:

```text
AppRoutes
  -> Page
    -> components/sections/*
      -> services/*
        -> api.js
          -> Backend
```

### Thu muc chinh

```text
src/
|-- admin/                 # Khu admin
|-- assets/                # Anh, logo
|-- components/
|   |-- common/            # Pagination, common widgets
|   |-- layout/            # Navbar, Footer
|   |-- sections/          # UI theo domain nghiep vu
|   |-- ui/                # Button, Card...
|-- data/                  # Data tinh
|-- hooks/                 # Custom hooks
|-- pages/                 # Entry UI cho route
|-- routers/               # AppRoutes, PrivateRoute
|-- services/              # Goi API, normalize response
|-- staff/                 # Khu staff
|-- styles/                # CSS theo page/module
|-- App.jsx
|-- main.jsx
```

### Nguyen tac to chuc hien tai

- `pages/` la noi ghep man hinh
- `components/sections/` la noi tach UI theo domain
- `services/` la noi frontend hieu backend
- `styles/` tach theo man hinh/module
- `admin/` va `staff/` la hai khu rieng

---

## C. Entry points va luong khoi dong

### `src/main.jsx`

Vai tro:

- mount React app
- import `globals.css`

### `src/App.jsx`

Vai tro:

- boc app bang `AuthProvider`
- render `AppRoutes`
- mount `ToastContainer`

### `src/routers/AppRoutes.jsx`

Vai tro:

- dinh tuyen toan bo app
- chia route theo user/admin/staff
- gan `PrivateRoute` cho route can auth

### `src/components/sections/auth/AuthContext.jsx`

Vai tro:

- doc `token` tu `localStorage`
- doc `user` tu `localStorage`
- check token het han bang `jwt-decode`
- xu ly login/logout
- xu ly `token` tu query string sau social login

Neu nguoi moi chi doc 4 file dau tien de nho du an chay ra sao, hay doc 4 file nay.

---

## D. Routing va phan quyen

## D.1. Route user/public

| Route | Page | Muc dich |
|------|------|---------|
| `/` | `Home.jsx` | Trang chu |
| `/about` | `AboutPage.jsx` | Gioi thieu |
| `/auth` | `Authpage.jsx` | Dang nhap |
| `/news` | `NewsPage.jsx` | Danh sach tin tuc |
| `/news/:id` | `NewsDetailPage.jsx` | Chi tiet tin tuc |
| `/market` | `MarketPage.jsx` | Danh sach can ho |
| `/product/:id` | `ProductDetailPage.jsx` | Chi tiet can ho |
| `/service` | `ServicePage.jsx` | Trang dich vu |
| `/services` | `ServicePage.jsx` | Alias cua service |
| `/booking` | `BookingPage.jsx` | Dat dich vu |
| `/billing` | `BillingPage.jsx` | Hoa don |
| `/profile` | `ProfilePage.jsx` | Ho so user |
| `/contact` | `ContactPage.jsx` | Lien he |
| `/unauthorized` | `Unauthorized.jsx` | Bao loi khong co quyen |

## D.2. Route admin

| Route | Component |
|------|-----------|
| `/admin` | `AdminLayout` + `AdminDashboard` |
| `/admin/roles` | `AdminRoleManager` |
| `/admin/resident-account` | `AdminLockResident` |
| `/admin/accounts` | `AdminAccountManager` |
| `/admin/contracts/create` | `AdminCreateContract` |
| `/admin/contracts/view` | `AdminPropertyManager` |
| `/admin/apartment-layout` | `AdminApartmentLayout` |
| `/admin/apartment-types` | `AdminApartmentTypeManager` |
| `/admin/bookings` | `AdminBookingManager` |
| `/admin/service-fees` | `AdminServiceFeeStats` |
| `/admin/complaints` | `AdminComplaintManager` |
| `/admin/visitors` | `AdminVisitorManager` |

## D.3. Route staff

| Route | Component |
|------|-----------|
| `/staff/apartment` | `StaffApartment.jsx` |
| `/staff/service` | `StaffService.jsx` |
| `/staff/security` | `StaffSecurity.jsx` |

## D.4. Luu y quan trong

- `market`, `product/:id`, `services` dang co ca ban public va protected trong `AppRoutes.jsx`
- admin area hien dang duoc protect boi role `manager`
- role redirect sau login duoc xu ly o `Authpage.jsx`

Neu doi role backend, can kiem tra toi thieu 3 noi:

- `AuthContext.jsx`
- `PrivateRoute.jsx`
- `Authpage.jsx`

---

## E. Quy uoc doc backend response trong frontend

Backend document xac dinh format:

```json
{
  "code": 200,
  "message": "Success",
  "result": ...
}
```

Frontend hien tai co 3 kieu xu ly response:

### E.1. Lay truc tiep `res.data.result`

Vi du:

- `apartmentService.js`
- `profileService.js`

### E.2. Cho phep fallback `data?.result ?? data`

Vi du:

- `newsService.js`
- `serviceService.js`
- `adminService.js`

### E.3. Frontend normalize response thanh UI model

Vi du:

- `normalizeNewsItem`
- `normalizeServiceItem`
- `normalizeServiceResource`
- `mapApartmentToProperty`

Day la lop quan trong nhat de "hieu backend".

---

## F. Services layer va data mapping

## F.1. `src/services/api.js`

Trach nhiem:

- tao axios instance
- set `baseURL`
- tu dong gan `Authorization: Bearer <token>`

## F.2. Danh sach service files

| File | Domain | Dung de lam gi |
|------|--------|----------------|
| `api.js` | Core | Axios config |
| `authService.js` | Auth | Login/logout/get user |
| `profileService.js` | Profile | Account/profile/update |
| `apartmentService.js` | Apartments | Apartments + apartment types |
| `newsService.js` | News | News list/detail + normalize |
| `serviceService.js` | Services | Service list/resource/booking + normalize |
| `billingService.js` | Billing | Utility/service invoice support |
| `adminService.js` | Admin | Contracts/bookings/visitors/complaints/invoices |
| `adminResidentService.js` | Admin Resident | Accounts/residents/contracts |
| `propertyMapper.js` | Mapping | Apartment -> property UI model |

## F.3. Nguyen tac lam viec voi service layer

Neu backend co endpoint moi:

1. Them ham trong `services`
2. Doc response shape
3. Normalize neu can
4. Chi sau do moi day vao page/component

---

## G. Domain: News

## G.1. File lien quan

### Pages

- `src/pages/NewsPage.jsx`
- `src/pages/NewsDetailPage.jsx`

### Components

- `src/components/sections/news/NewsHero.jsx`
- `src/components/sections/news/NewsCategories.jsx`
- `src/components/sections/news/NewsList.jsx`
- `src/components/sections/news/NewsCard.jsx`
- `src/components/sections/news/NewsContent.jsx`
- `src/components/sections/news/NewsSidebar.jsx`

### Service

- `src/services/newsService.js`

## G.2. Backend endpoints dang dung

| Endpoint | Method | Frontend dung o dau |
|----------|--------|---------------------|
| `/news` | GET | `Home.jsx`, `NewsList.jsx`, `NewsDetailPage.jsx` |
| `/news/{id}` | GET | `NewsDetailPage.jsx` |

## G.3. Backend response frontend ky vong

Backend news item thuong co:

```json
{
  "id": 1,
  "title": "Bao tri he thong nuoc",
  "content": "Noi dung chi tiet",
  "imageUrl": "https://...",
  "lastUpdate": "2026-03-30T10:00:00",
  "createdByUser": {
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

## G.4. Frontend map news nhu the nao

`newsService.js` map ve model:

```js
{
  id,
  title,
  content,
  desc,
  image,
  date,
  lastUpdateRaw,
  author
}
```

### Mapping rule

| Backend field | Frontend field | Ghi chu |
|--------------|----------------|--------|
| `id` | `id` | Bat buoc |
| `title` | `title` | Neu null -> `"Untitled article"` |
| `content` | `content` | Neu null -> `""` |
| `content` | `desc` | Tu cat excerpt |
| `imageUrl` | `image` | Neu null -> fallback unsplash |
| `lastUpdate` | `date` | Format `en-GB` |
| `lastUpdate` | `lastUpdateRaw` | Giup sort |
| `createdByUser.username/email` | `author` | Fallback `"Vinhomes Team"` |

## G.5. Frontend render news o dau

| UI | Dung data gi |
|----|--------------|
| `Home.jsx` -> `NewsSection` | 3 bai moi nhat |
| `NewsList.jsx` | danh sach news + pagination + filter |
| `NewsDetailPage.jsx` | 1 article + related articles |
| `NewsSidebar.jsx` | top 5 bai lien quan/gan day |

## G.6. Neu backend them field moi cho news

Vi du backend them:

- `category`
- `tags`
- `summary`
- `isPinned`

Thu tu xu ly:

1. them field vao `normalizeNewsItem`
2. sua component can dung field do
3. neu can filter/sort moi, sua `NewsList.jsx`
4. neu can hien tren home, sua `Home.jsx` / `NewsSection`

## G.7. Dau hieu backend doi response lam hong frontend

- `NewsCard` khong hien anh
- date hien `"Updating..."`
- author mat
- detail page mo duoc nhung content rong

Khi gap tinh trang nay, kiem tra `newsService.js` truoc.

---

## H. Domain: Apartments va Property Listing

## H.1. File lien quan

### Pages

- `src/pages/Home.jsx`
- `src/pages/MarketPage.jsx`
- `src/pages/ProductDetailPage.jsx`

### Components listing

- `src/components/sections/listing/PropertyHero.jsx`
- `src/components/sections/listing/PropertyToolbar.jsx`
- `src/components/sections/listing/PropertyGrid.jsx`
- `src/components/sections/listing/PropertyCard.jsx`

### Components product detail

- `src/components/sections/product/Breadcrumb.jsx`
- `src/components/sections/product/Gallery.jsx`
- `src/components/sections/product/ProductHeader.jsx`
- `src/components/sections/product/ProductMeta.jsx`
- `src/components/sections/product/Description.jsx`
- `src/components/sections/product/Features.jsx`
- `src/components/sections/product/LegalInfo.jsx`
- `src/components/sections/product/MapSection.jsx`
- `src/components/sections/product/SimilarProperties.jsx`
- `src/components/sections/product/ContactSidebar.jsx`

### Services/helpers

- `src/services/apartmentService.js`
- `src/services/propertyMapper.js`

## H.2. Backend endpoints dang dung

| Endpoint | Method | Frontend dung o dau |
|----------|--------|---------------------|
| `/apartments` | GET | `PropertyGrid.jsx`, `ProductDetailPage.jsx` |
| `/apartments/{id}` | GET | `ProductDetailPage.jsx` |
| `/apartments/type` | GET | `Home.jsx`, `PropertyGrid.jsx`, `ProductDetailPage.jsx`, admin |
| `/apartments/type/{id}` | GET | Admin use-case |
| `/apartments/type` | POST/PUT/DELETE | Admin apartment type manager |

## H.3. Backend apartment response frontend ky vong

Apartment:

```json
{
  "id": 1,
  "roomNumber": 101,
  "floorNumber": 1,
  "direction": "East",
  "status": 0,
  "apartmentTypeId": 2,
  "specificPriceForBuying": 2500000000,
  "specificPriceForRenting": 18000000
}
```

Apartment type:

```json
{
  "id": 2,
  "name": "2 Bedrooms",
  "designSqrt": 75.5,
  "numberOfBedroom": 2,
  "numberOfBathroom": 2,
  "overview": "Can ho 2 phong ngu",
  "commonPriceForBuying": 2200000000,
  "commonPriceForRent": 15000000,
  "furniture": 1,
  "createdAt": "2026-03-01T08:00:00"
}
```

## H.4. Frontend map apartment -> property UI nhu the nao

File trung tam:

- `src/services/propertyMapper.js`

`mapApartmentToProperty(apartment, apartmentType)` tra ra:

```js
{
  id,
  title,
  location,
  fullLocation,
  bedrooms,
  bathrooms,
  area,
  price,
  rawPrice,
  rentPrice,
  buyPrice,
  image,
  images,
  statusLabel,
  rawStatus,
  isAvailable,
  sortPrice,
  roomNumber,
  floorNumber,
  direction,
  propertyType,
  overview,
  furniture,
  legalStatus,
  pricePerSquareMeter,
  postedDate,
  hasMapLocation
}
```

### Mapping rule chinh

| Backend | Frontend | Ghi chu |
|--------|----------|--------|
| `apartment.id` | `id` | Bat buoc |
| `apartmentType.name` | `title` | fallback theo room number |
| `roomNumber + floorNumber` | `location` | build label |
| `direction` | `direction` | fallback `"Dang cap nhat"` |
| `status` | `statusLabel` + `isAvailable` | 0 = available, 1 = occupied |
| `specificPriceForBuying/commonPriceForBuying` | `buyPrice` | uu tien gia rieng cua apartment |
| `specificPriceForRenting/commonPriceForRent` | `rentPrice` | uu tien gia rieng cua apartment |
| gia mua hoac thue | `price` | dung de hien thi chinh |
| `designSqrt` | `area` | dien tich |
| `numberOfBedroom` | `bedrooms` | |
| `numberOfBathroom` | `bathrooms` | |
| `overview` | `overview` | |
| `furniture` | `furniture` | normalize string |
| `createdAt` cua apartmentType | `postedDate` | dung hien thi |

## H.5. Frontend dung model property o dau

| UI | Dung field nao |
|----|----------------|
| `PropertyCard` | title, image, price, area, status |
| `PropertyToolbar` | result count, available count, page meta |
| `ProductHeader/ProductMeta` | title, price, location, bedrooms, bathrooms |
| `Gallery` | images |
| `Description/Features/LegalInfo` | overview, furniture, legalStatus |
| `MapSection` | fullLocation |
| `SimilarProperties` | danh sach property da map |

## H.6. Home page dung apartment type the nao

`Home.jsx` khong dung apartment raw de render project cards.
No:

1. goi `getApartmentTypes()`
2. sort theo `createdAt`
3. cat 3 item
4. map nhe thanh:

```js
{
  id,
  name,
  description,
  image,
  bedrooms,
  bathrooms,
  area
}
```

Neu backend them anh cho apartment type, co the cap nhat o day hoac sua `getImageByTypeName`.

## H.7. Neu backend doi field apartment

Vi du doi:

- `specificPriceForRenting` -> `specificRentPrice`
- `status` -> `apartmentStatus`

Thi chinh sua:

1. `propertyMapper.js`
2. neu can, `PropertyGrid.jsx`
3. `ProductDetailPage.jsx` neu relation apartmentType doi

---

## I. Domain: Services va Booking

## I.1. File lien quan

### Pages

- `src/pages/ServicePage.jsx`
- `src/pages/BookingPage.jsx`

### Components

- `src/components/sections/service/ServiceHero.jsx`
- `src/components/sections/service/ServiceList.jsx`
- `src/components/sections/service/ServiceBenefits.jsx`
- `src/components/sections/service/ServiceHowItWorks.jsx`

### Services

- `src/services/serviceService.js`
- `src/data/serviceCatalog.js`

## I.2. Backend endpoints dang dung

| Endpoint | Method | Frontend dung o dau |
|----------|--------|---------------------|
| `/services` | GET | `ServiceList.jsx`, `BookingPage.jsx`, `BillingPage.jsx` |
| `/service-resource` | GET | `BookingPage.jsx` |
| `/bookings` | POST | `BookingPage.jsx` |

## I.3. Backend service response frontend ky vong

Service:

```json
{
  "id": 1,
  "serviceName": "Swimming Pool",
  "serviceCode": "POOL_01",
  "feePerUnit": 150000,
  "unitType": "hour",
  "imageUrl": "https://..."
}
```

Service resource:

```json
{
  "id": 10,
  "resourceCode": "POOL-A",
  "location": "Tower A - Floor 5",
  "isAvailable": true,
  "service": {
    "id": 1,
    "serviceName": "Swimming Pool"
  },
  "imageUrl": "https://..."
}
```

## I.4. Frontend map service nhu the nao

File trung tam:

- `src/services/serviceService.js`

`normalizeServiceItem(item)` tra ra:

```js
{
  id,
  title,
  desc,
  image,
  tagline,
  areas,
  imageUrls,
  serviceCode,
  feePerUnit,
  unitType
}
```

### Mapping rule

| Backend | Frontend | Ghi chu |
|--------|----------|--------|
| `serviceName` | `title` | fallback `"Unnamed service"` |
| `feePerUnit + unitType` | `desc` | tao chuoi mo ta phi |
| `imageUrl/image/thumbnailUrl` | `image` | fallback tu `serviceCatalog` |
| `serviceCode` | `serviceCode` | dung de billing phan biet dien/nuoc |
| `feePerUnit` | `feePerUnit` | tinh booking/billing |
| `unitType` | `unitType` | hien thi price |

## I.5. Frontend map service resource nhu the nao

`normalizeServiceResource(item)` tra ra:

```js
{
  id,
  resourceCode,
  location,
  isAvailable,
  serviceId,
  serviceName,
  imageUrl,
  imageUrls
}
```

Backend service resource la nguon du lieu cuc ky quan trong cho `BookingPage`.

Neu backend doi nested relation:

- `service.id`
- `service.serviceName`

thi `BookingPage` rat de vo vi no loc resource theo `serviceId`.

## I.6. `ServicePage` dung du lieu nhu the nao

`ServiceList.jsx`:

- goi `getServices()`
- render card dich vu
- hien `serviceCode`
- hien `desc`
- neu user la `RESIDENT` thi cho di den `/booking`

## I.7. `BookingPage` dung backend nhu the nao

`BookingPage` la page phuc tap nhat cua service domain.

No:

1. goi `getServices()`
2. goi `getServiceResources()`
3. neu co token thi goi `getMyAccount()`
4. loc ra nhung service co resource available
5. loc resource theo service dang chon
6. tinh tong tien `feePerUnit * duration`
7. submit payload tao booking

## I.8. Payload tao booking frontend dang gui

```json
{
  "resourceId": 10,
  "accountId": 3,
  "bookFrom": "2026-03-31T08:00:00",
  "bookTo": "2026-03-31T10:00:00",
  "status": 0,
  "totalAmount": 300000
}
```

## I.9. Neu backend doi booking contract

Kiem tra:

- `createBooking()` trong `serviceService.js`
- `handleSubmit()` trong `BookingPage.jsx`

Vi du backend doi:

- `resourceId` -> `serviceResourceId`
- `totalAmount` -> `amount`

thi day la 2 diem sua chinh.

---

## J. Domain: Billing

## J.1. File lien quan

### Page

- `src/pages/BillingPage.jsx`

### Components

- `src/components/sections/billing/PropertySidebar.jsx`
- `src/components/sections/billing/BillingSummary.jsx`
- `src/components/sections/billing/BillingPayableBreakdown.jsx`
- `src/components/sections/billing/BillingPricingTable.jsx`
- `src/components/sections/billing/BillingTable.jsx`
- `src/components/sections/billing/BillingChart.jsx`
- `src/components/sections/billing/BillingFilters.jsx`
- `src/components/sections/billing/PaymentHistory.jsx`

### Complaint widgets

- `src/components/sections/complaint/ComplaintButton.jsx`
- `src/components/sections/complaint/ComplaintList.jsx`

### Services

- `src/services/billingService.js`
- `src/services/profileService.js`
- `src/services/serviceService.js`
- `src/services/adminResidentService.js`

## J.2. Backend endpoints dang dung

| Endpoint | Method | Frontend dung o dau |
|----------|--------|---------------------|
| `/auth/accounts/me` | GET | lay account hien tai |
| `/contracts/list/account/{accountId}` | GET | tim apartment cua user |
| `/utilities-invoice/apartment/{apartmentId}` | GET | load hoa don utility |
| `/services` | GET | lay don gia dien/nuoc |
| `/service-invoice` | GET | service invoice support / admin |
| `/bookings/account/{accountId}` | GET | booking history support |

## J.3. Billing page dang "hieu" backend theo cach nao

`BillingPage.jsx` khong nhan san 1 object "bill" tu backend.
No tu build model bill trong frontend.

Noi cu the:

1. backend tra utility invoice
2. frontend lay `services` de tim service code `ELEC_01` va `WAT_01`
3. frontend nhan:
   - so dien
   - so nuoc
   - don gia
4. frontend tu tinh tong bill utility
5. frontend map thanh object bill de render bang va chart

## J.4. Backend utility invoice frontend ky vong

```json
{
  "id": 1,
  "billingYear": 2026,
  "billingMonth": 3,
  "totalElectricUsed": 120,
  "totalWaterUsed": 15,
  "status": 0,
  "createdAt": "2026-03-30T10:00:00"
}
```

## J.5. Frontend build bill model nhu the nao

Sau khi map, 1 bill utility co dang:

```js
{
  id,
  source: "utility",
  category: "utility",
  name,
  monthKey,
  dueDate,
  amount,
  statusKey,
  statusLabel,
  utilityDetails: {
    electricity: {...},
    water: {...}
  }
}
```

## J.6. Service code bat buoc de BillingPage chay dung

`BillingPage` dang hardcode:

- `ELEC_01` -> Electricity
- `WAT_01` -> Water

Neu backend doi service code, page billing se tinh sai.
Khi backend thay doi danh muc service utility, phai sua `BillingPage.jsx`.

## J.7. Neu backend doi field utility invoice

Can kiem tra:

- `getUtilitiesInvoicesByApartmentId()` trong `billingService.js`
- `buildUtilityBills()` trong `BillingPage.jsx`

Vi du doi:

- `totalElectricUsed` -> `electricUsed`
- `totalWaterUsed` -> `waterUsed`

thi page billing se vo o phan tinh amount.

---

## K. Domain: Profile va Authentication

## K.1. File lien quan

### Auth

- `src/components/sections/auth/AuthContext.jsx`
- `src/components/sections/auth/AuthForm.jsx`
- `src/components/sections/auth/AuthLayout.jsx`
- `src/pages/Authpage.jsx`
- `src/services/authService.js`

### Profile

- `src/pages/ProfilePage.jsx`
- `src/components/sections/profile/ProfileView.jsx`
- `src/components/sections/profile/ProfileEdit.jsx`
- `src/components/sections/profile/UserHouses.jsx`
- `src/services/profileService.js`

## K.2. Backend endpoints dang dung

| Endpoint | Method | Frontend dung o dau |
|----------|--------|---------------------|
| `/auth/login` | POST | login |
| `/auth/accounts/me` | GET | AuthContext, ProfilePage, BookingPage, BillingPage |
| `/auth/profile/me` | GET | ProfilePage |
| `/accounts/{id}` | PUT | Profile edit |
| `/residents/{id}` | PUT | Profile edit |

## K.3. User/account model frontend dang ky vong

Account:

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "resident01",
  "isActive": true,
  "role": {
    "id": 2,
    "roleName": "RESIDENT"
  }
}
```

Resident profile:

```json
{
  "id": 5,
  "fullName": "Nguyen Van A",
  "gender": "Male",
  "dateOfBirth": "1998-01-01",
  "identityId": "001234567890",
  "phoneNumber": "0901234567",
  "account": {
    "id": 1
  }
}
```

## K.4. AuthContext dang dung field nao

| Backend | Frontend | Ghi chu |
|--------|----------|--------|
| token | `token` state | luu localStorage |
| user role | `normalizedRole` | `role.roleName.toUpperCase()` |
| user object | `user` | luu localStorage |

## K.5. Redirect sau login

`Authpage.jsx` map role -> dashboard:

| Role | Redirect |
|------|----------|
| `ADMIN` | `/admin` |
| `MANAGER` | `/admin` |
| `RESIDENT` | `/` |
| `STAFF_APARTMENT` | `/staff/apartment` |
| `STAFF_SERVICE` | `/staff/service` |
| `STAFF_SECURITY` | `/staff/security` |
| `STAFF` | `/staff/apartment` |

Neu backend them role moi, phai cap nhat bang nay.

## K.6. ProfilePage dang dung backend the nao

`ProfilePage.jsx`:

1. goi `getMyAccount()`
2. neu role la `RESIDENT`
3. goi them `getMyProfile()`
4. render `ProfileView` hoac `ProfileEdit`

Neu role khac resident, phan `resident` co the null.

---

## L. Domain: Admin

## L.1. File lien quan

- `src/admin/AdminCore.jsx`
- `src/admin/AdminManagement.jsx`
- `src/services/adminService.js`
- `src/services/adminResidentService.js`
- `src/services/apartmentService.js`

## L.2. Kien truc admin hien tai

### `AdminCore.jsx`

Chua:

- `AdminLayout`
- `AdminDashboard`

### `AdminManagement.jsx`

Chua nhieu module admin trong 1 file lon:

- role manager
- resident account manager
- account manager
- contracts
- apartment layout
- apartment type manager
- bookings
- service fee stats
- visitor manager
- complaint manager

## L.3. Backend endpoints admin dang dung

Admin dang goi rat nhieu endpoint:

- `/contracts`
- `/bookings`
- `/visitors`
- `/staff`
- `/complaints`
- `/replies/complaint/{id}`
- `/utilities-invoice`
- `/service-invoice`
- `/stay-at-history/apartment/{id}`
- `/residents`
- `/accounts`
- `/contracts/list/account/{accountId}`
- `/apartments`
- `/apartments/type`

## L.4. Frontend admin dang co dac diem gi

- `AdminDashboard` tong hop data tu nhieu endpoint
- `AdminManagement.jsx` rat lon
- co nhieu logic normalize phuc tap ben trong component
- mot so request co `requestWithAuthFallback`

## L.5. Neu backend thay doi response admin

Thu tu kiem tra:

1. `adminService.js`
2. `adminResidentService.js`
3. module export tu `AdminManagement.jsx`
4. `AdminDashboard` trong `AdminCore.jsx`

## L.6. Loi khuyen khi them feature admin

Khong nen nhot them 1 module to nua vao `AdminManagement.jsx` neu co the tach file rieng.

Luong de lam:

1. tao component module moi
2. them route admin
3. them item sidebar neu can
4. tao/update service
5. map response tai service hoac helper

---

## M. Domain: Staff

## M.1. File lien quan

- `src/staff/StaffApartment.jsx`
- `src/staff/StaffService.jsx`
- `src/staff/StaffSecurity.jsx`
- `src/staff/StaffApartmentMainContent.jsx`
- `src/staff/StaffServiceMainContent.jsx`
- `src/staff/StaffSecurityMainContent.jsx`

## M.2. Tinh chat hien tai cua staff area

Staff area hien tai la khu UI da co form va workflow, nhung van con nhieu data local/mock.

Dieu nay rat quan trong khi nhin backend:

- khong phai endpoint nao staff cung da noi that
- co tinh nang staff hien tai chi moi la mock UI

## M.3. Neu muon noi that staff voi backend

Can lam theo thu tu:

1. xac dinh man hinh staff nao dang mock
2. tim endpoint backend phu hop
3. tao service moi hoac dung lai `adminService.js`
4. thay state local bang state tu API
5. xu ly loading/error/empty state

---

## N. Shared Components va Styles

## N.1. Layout

- `src/components/layout/Navbar.jsx`
- `src/components/layout/Footer.jsx`

Tat ca page user side thuong dung 2 file nay.

## N.2. Common/UI

- `src/components/common/Pagination.jsx`
- `src/components/common/AdminPagination.jsx`
- `src/components/ui/Button.jsx`
- `src/components/ui/Card.jsx`

## N.3. Data tinh va helper

- `src/data/serviceCatalog.js`
  - bo sung metadata cho service
- `src/hooks/useScrollEffect.js`
  - effect khi scroll

## N.4. Styles

- `globals.css`
- `about.css`
- `auth.css`
- `billing.css`
- `booking.css`
- `contact.css`
- `news.css`
- `news-detail.css`
- `product.css`
- `profile.css`
- `service.css`
- `admin.css`
- `staff.css`

---

## O. Cach them mot man hinh moi

## O.1. Them page user moi

Vi du: them page `Events`

Buoc lam:

1. Tao `src/pages/EventsPage.jsx`
2. Tao section neu can trong `src/components/sections/events/`
3. Tao `src/styles/events.css` neu page lon
4. Them route trong `AppRoutes.jsx`
5. Neu can goi backend, tao `src/services/eventService.js`
6. Neu can menu, sua `Navbar.jsx`

## O.2. Them page admin moi

1. Tao component admin moi
2. Them route `/admin/...`
3. Them menu trong sidebar admin
4. Tao service goi backend
5. Neu response phuc tap, normalize truoc khi render

## O.3. Them page staff moi

1. Xac dinh co dung flow mock hay live
2. Tao UI component
3. Neu live, tao service
4. Them route staff
5. Them tab/menu trong page staff tuong ung

---

## P. Cach them mot API moi tu backend

Khi backend them endpoint moi, frontend nen lam theo mau nay:

### Buoc 1. Xac dinh domain

Vi du endpoint moi lien quan:

- news
- apartments
- services
- billing
- admin
- profile

### Buoc 2. Them ham trong service dung domain

Vi du:

```js
export const getEvents = async () => {
  const res = await api.get("/events");
  return res.data.result ?? [];
};
```

### Buoc 3. Normalize response neu can

Neu backend tra nested object kho dung, normalize:

```js
export const normalizeEvent = (item) => ({
  id: item?.id,
  title: item?.name || "Untitled event",
  date: item?.startDate || null,
});
```

### Buoc 4. Chi day model da normalize vao UI

Khong day raw response phuc tap xuong component neu khong can.

### Buoc 5. Xu ly 3 state co ban

Page/component phai co:

- loading
- error
- empty

---

## Q. Checklist khi nhan response backend moi

Khi backend tra 1 object/array moi va frontend can an vao, tu hoi 10 cau nay:

1. Endpoint nay thuoc domain nao?
2. Da co file `services` dung domain chua?
3. Response co nam trong `result` hay tra thang?
4. Field nao bat buoc de UI render duoc?
5. Field nao can fallback neu null?
6. Co can format date/currency/status khong?
7. Co can flatten nested object khong?
8. Component nao se dung du lieu nay?
9. Co can auth/role khong?
10. Co can loading/error/empty state khong?

### Checklist ky hon cho frontend dev

Neu backend giao 1 response moi, ban nen ghi ra:

| Cau hoi | Vi du |
|--------|------|
| Dung cho man hinh nao? | `NewsPage`, `AdminDashboard` |
| Dung o page hay section? | `NewsList`, `BillingTable` |
| Dat logic o dau? | `service`, `page`, hay `helper` |
| Model UI can dang nao? | card/list/detail/table/chart |
| Can map field gi? | `title`, `image`, `statusLabel`, `amount` |

---

## R. Thu tu file nen doc khi onboarding

Neu la nguoi moi vao project, doc theo thu tu nay:

1. `src/App.jsx`
2. `src/routers/AppRoutes.jsx`
3. `src/components/sections/auth/AuthContext.jsx`
4. `src/services/api.js`
5. `src/services/`
6. `src/pages/`
7. `src/components/sections/`
8. `src/admin/`
9. `src/staff/`

Neu vao de sua 1 domain cu the:

- news -> doc `newsService.js` truoc
- property -> doc `propertyMapper.js` truoc
- booking -> doc `serviceService.js` va `BookingPage.jsx`
- billing -> doc `BillingPage.jsx`
- auth -> doc `AuthContext.jsx`
- admin -> doc `AdminCore.jsx` va `AdminManagement.jsx`

---

## Notes quan trong

### 1. Noi frontend "hieu backend" nhieu nhat la o dau?

Tra loi: o `services/` va cac file mapper/normalize.

Cu the:

- `newsService.js`
- `serviceService.js`
- `billingService.js`
- `propertyMapper.js`
- mot phan `BillingPage.jsx`

### 2. Neu backend doi field ma frontend vo, can check dau tien o dau?

| Domain | Check file dau tien |
|--------|---------------------|
| News | `newsService.js` |
| Apartments | `propertyMapper.js` |
| Services | `serviceService.js` |
| Billing | `BillingPage.jsx` + `billingService.js` |
| Auth | `AuthContext.jsx` |
| Admin | `adminService.js` / `adminResidentService.js` |

### 3. Frontend nay co can doc het tung file khong?

Khong.

Can xac dinh dung 4 diem:

1. route nao chua man hinh
2. page nao giu state tong
3. service nao hieu backend response
4. component nao render du lieu

Nam duoc 4 diem nay la da co the lam feature moi ma khong can dao tung file mot cach may moc.
