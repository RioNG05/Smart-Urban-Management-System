# Booking Image Backend Changes

## Summary

This note records the backend changes made to support DB-backed images for the `/booking` flow.

## Problem

The booking page was not reading the full image data from the backend/database:

- `ServiceResources` in the SQL schema contains an `ImageUrl` column.
- The backend `ServiceResource` entity did not map that column.
- The resource image API returned image URLs, but did not expose which `serviceResourceId` each image belonged to.
- Because of that, the frontend could not reliably attach gallery images to the correct resource.

## Database Context

In [`db/SUMS.sql`](./db/SUMS.sql):

- `ServiceResources` includes `ImageUrl`
- resource seed data already stores image URLs directly in the table
- resource gallery images are also stored separately in `ServiceResourceImages`

## Backend Changes

### 1. Map `ServiceResources.ImageUrl`

Updated:

- [`src/main/java/com/example/backend/Entity/ServiceResource.java`](./src/main/java/com/example/backend/Entity/ServiceResource.java)

Added the `imageUrl` field so backend responses now include the primary image already stored in the `ServiceResources` table.

### 2. Expose `serviceResourceId` in image responses

Updated:

- [`src/main/java/com/example/backend/DTO/Response/ImageResponseDTO.java`](./src/main/java/com/example/backend/DTO/Response/ImageResponseDTO.java)

Added:

- `serviceResourceId`

This allows the frontend to know which image belongs to which resource.

### 3. Return service resource images in stable order

Updated:

- [`src/main/java/com/example/backend/Repository/ServiceResourceImageRepository.java`](./src/main/java/com/example/backend/Repository/ServiceResourceImageRepository.java)

Added repository method:

- `findAllByOrderByServiceResourceIdAscIdAsc()`

This helps keep resource image lists predictable.

### 4. Include `serviceResourceId` in `/api/images/service-resource`

Updated:

- [`src/main/java/com/example/backend/Service/ImageService.java`](./src/main/java/com/example/backend/Service/ImageService.java)

Changes:

- apartment image responses explicitly set `serviceResourceId = null`
- service resource image responses now include:
  - `id`
  - `imageUrl`
  - `description`
  - `serviceResourceId`

## Result

After these backend changes, the frontend can:

- load the main image from `ServiceResources.ImageUrl`
- load extra gallery images from `/api/images/service-resource`
- correctly group all gallery images by resource

This makes `/booking` read images from database-backed data instead of relying on local browser storage or unrelated fallback sources.
