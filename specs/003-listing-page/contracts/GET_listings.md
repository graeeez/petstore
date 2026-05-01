# API Contract: GET /pastoral/listings

**Version**: 1.0.0  
**Status**: Final  
**Last Updated**: 2026-04-30  
**Feature**: Pet Listing Page

## Overview

This contract defines the REST API endpoint for retrieving pet listings with support for filtering (category, price range, availability), sorting, and pagination. The endpoint is contract-first and MUST NOT change without versioning.

---

## Endpoint

```
GET /pastoral/listings
```

---

## Request Parameters

All parameters are optional query parameters. If omitted, defaults apply.

### Query Parameters

| Parameter | Type | Default | Constraints | Description |
|-----------|------|---------|-------------|-------------|
| `category` | string | None (all) | One of: DOGS, CATS, BIRDS, FISHES | Filter by pet category (case-insensitive) |
| `priceMin` | number | 0.00 | >= 0, <= priceMax, up to 2 decimals | Minimum price (inclusive), in USD dollars |
| `priceMax` | number | 999999.99 | >= priceMin, up to 2 decimals | Maximum price (inclusive), in USD dollars |
| `available` | boolean | true | true or false | Filter by availability (true = only available; false = include unavailable) |
| `sortBy` | string | "price" | One of: price, createdAt, popularity | Field to sort by |
| `sortOrder` | string | "asc" | "asc" or "desc" | Sort direction |
| `page` | integer | 0 | >= 0 | 0-indexed page number for pagination |
| `limit` | integer | 20 | 1-100 | Number of items per page |

### Example Requests

**Request 1: Browse available dogs, low price first**
```
GET /pastoral/listings?category=DOGS&available=true&sortBy=price&sortOrder=asc&page=0&limit=20
```

**Request 2: Filter by price range, paginate to page 2**
```
GET /pastoral/listings?priceMin=50.00&priceMax=200.00&page=2&limit=20
```

**Request 3: Multiple categories (if future requirement)**
```
GET /pastoral/listings?category=DOGS&category=CATS&sortBy=createdAt&sortOrder=desc
```
*Note: Initial release supports single category; multi-category deferred.*

**Request 4: All parameters**
```
GET /pastoral/listings?category=BIRDS&priceMin=10.00&priceMax=100.00&available=true&sortBy=price&sortOrder=asc&page=0&limit=20
```

**Request 5: Defaults (all available, price ascending, page 0, 20 items)**
```
GET /pastoral/listings
```

---

## Response Format

All responses are JSON with the following structure.

### Success Response (HTTP 200 OK)

**Body**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Golden Retriever Puppy",
        "category": "DOGS",
        "price": 75.99,
        "availability": true,
        "description": "Friendly and energetic 3-month-old puppy, fully vaccinated",
        "imageUrl": "https://images.petstore.com/dogs/golden-1.jpg",
        "createdAt": "2026-04-28T10:30:00Z"
      },
      {
        "id": 2,
        "name": "Siamese Kitten",
        "category": "CATS",
        "price": 45.00,
        "availability": true,
        "description": "Playful blue-point Siamese, 2 months old",
        "imageUrl": "https://images.petstore.com/cats/siamese-1.jpg",
        "createdAt": "2026-04-27T14:15:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 20,
      "total": 42,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Field Descriptions**:
- `status`: Always "success" for HTTP 200
- `data.items`: Array of PetListingSummary objects (may be empty)
- `data.items[].id`: Unique listing identifier
- `data.items[].name`: Pet name
- `data.items[].category`: Pet category (DOGS, CATS, BIRDS, or FISHES)
- `data.items[].price`: Price in USD with 2 decimal places
- `data.items[].availability`: Boolean (true = purchasable; false = out of stock)
- `data.items[].description`: Optional longer description
- `data.items[].imageUrl`: HTTPS URL to pet image
- `data.items[].createdAt`: ISO 8601 timestamp of listing creation
- `pagination.page`: Requested page number (0-indexed)
- `pagination.limit`: Items per page
- `pagination.total`: Total number of items matching filter criteria
- `pagination.totalPages`: Ceiling(total / limit)
- `pagination.hasNextPage`: Boolean (true if page+1 exists)
- `pagination.hasPreviousPage`: Boolean (true if page > 0)
- `timestamp`: Server timestamp of response

### Empty Results (HTTP 200 OK, No Matches)

```json
{
  "status": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 0,
      "limit": 20,
      "total": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

---

## Error Responses

### Bad Request (HTTP 400)

**Scenario**: Invalid filter parameter (e.g., invalid category)

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_FILTER",
    "message": "Invalid category: HAMSTERS. Valid options: DOGS, CATS, BIRDS, FISHES",
    "details": {
      "invalidParameter": "category",
      "providedValue": "HAMSTERS",
      "validValues": ["DOGS", "CATS", "BIRDS", "FISHES"]
    }
  },
  "timestamp": "2026-04-30T12:00:00Z",
  "requestId": "req-abc123xyz"
}
```

**Scenario**: Invalid price range (min > max)

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_PRICE_RANGE",
    "message": "priceMin (200.00) must be less than or equal to priceMax (100.00)",
    "details": {
      "priceMin": 200.00,
      "priceMax": 100.00
    }
  },
  "timestamp": "2026-04-30T12:00:00Z",
  "requestId": "req-def456uvw"
}
```

**Scenario**: Invalid pagination parameters

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_PAGINATION",
    "message": "limit must be between 1 and 100, got 500",
    "details": {
      "invalidParameter": "limit",
      "providedValue": 500,
      "allowedRange": [1, 100]
    }
  },
  "timestamp": "2026-04-30T12:00:00Z",
  "requestId": "req-ghi789rst"
}
```

### Service Unavailable (HTTP 503)

**Scenario**: Database connection failure

```json
{
  "status": "error",
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "The listing service is temporarily unavailable. Please try again in a few moments.",
    "details": {}
  },
  "timestamp": "2026-04-30T12:00:30Z",
  "requestId": "req-jkl012mno"
}
```

### Internal Server Error (HTTP 500)

**Scenario**: Unexpected error

```json
{
  "status": "error",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred while retrieving listings.",
    "details": {}
  },
  "timestamp": "2026-04-30T12:00:30Z",
  "requestId": "req-pqr345stu"
}
```

---

## HTTP Status Codes

| Code | Meaning | Scenarios |
|------|---------|-----------|
| **200** | OK | Successful request (even if items array is empty) |
| **400** | Bad Request | Invalid filter, invalid pagination, invalid sort order, invalid category |
| **401** | Unauthorized | (Future) If authentication required for private listings |
| **404** | Not Found | Endpoint not found (should not occur for this endpoint) |
| **503** | Service Unavailable | Database error, external service failure |
| **500** | Internal Server Error | Unexpected server error |

---

## Request/Response Examples

### Example 1: Browse Dogs (Default Sort/Pagination)

**Request**:
```bash
curl -X GET "https://api.petstore.com/pastoral/listings?category=DOGS"
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Golden Retriever Puppy",
        "category": "DOGS",
        "price": 75.99,
        "availability": true,
        "description": "Friendly 3-month-old puppy",
        "imageUrl": "https://images.petstore.com/dogs/golden-1.jpg",
        "createdAt": "2026-04-28T10:30:00Z"
      },
      {
        "id": 3,
        "name": "Labrador Mix",
        "category": "DOGS",
        "price": 65.50,
        "availability": true,
        "description": "Adult dog, calm temperament",
        "imageUrl": "https://images.petstore.com/dogs/lab-1.jpg",
        "createdAt": "2026-04-25T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 20,
      "total": 2,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

### Example 2: Filter by Price Range, No Results

**Request**:
```bash
curl -X GET "https://api.petstore.com/pastoral/listings?priceMin=500&priceMax=1000"
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 0,
      "limit": 20,
      "total": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Frontend Empty State**: "No pets found in your price range. Try adjusting your filters."

### Example 3: Invalid Category

**Request**:
```bash
curl -X GET "https://api.petstore.com/pastoral/listings?category=REPTILES"
```

**Response (400 Bad Request)**:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_FILTER",
    "message": "Invalid category: REPTILES. Valid options: DOGS, CATS, BIRDS, FISHES",
    "details": {
      "invalidParameter": "category",
      "providedValue": "REPTILES",
      "validValues": ["DOGS", "CATS", "BIRDS", "FISHES"]
    }
  },
  "timestamp": "2026-04-30T12:00:00Z",
  "requestId": "req-xyz789abc"
}
```

---

## Caching Headers

The response SHOULD include caching headers for optimal performance:

```
Cache-Control: public, max-age=300
ETag: "abc123def456"
Last-Modified: Wed, 30 Apr 2026 12:00:00 GMT
```

**Rationale**: Listings are relatively stable; 5-minute cache window reduces database load.

---

## Versioning Policy

This contract uses URL-based versioning for breaking changes:

**Current**: `/pastoral/listings` (v1 implicit)

**Future breaking change**: `/pastoral/v2/listings` (if response structure changes)

**Migration path**: Maintain `/pastoral/listings` for ≥1 release cycle; emit deprecation headers:
```
Deprecation: true
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
Link: </pastoral/v2/listings>; rel="successor-version"
```

---

## Performance SLA

| Metric | Target | Monitor |
|--------|--------|---------|
| P95 Latency | < 1 second | Micrometer timers |
| P99 Latency | < 3 seconds | Micrometer percentiles |
| Availability | 99.9% | Health check probes |
| Error Rate | < 0.1% | Error count metrics |

---

## Security Considerations

1. **Input Validation**: All parameters validated server-side; no client-side trust
2. **SQL Injection Prevention**: Use parameterized queries (JPA Specifications)
3. **Rate Limiting**: (Phase 2) Implement per-IP rate limits if abuse detected
4. **Authentication**: (Future) If private listings added, enforce authentication
5. **Data Exposure**: Response omits cost, supplier, and internal profit fields

---

## Test Coverage Requirements

### Unit Tests
- ✅ Validate category parameter parsing
- ✅ Validate price range boundaries (min <= max)
- ✅ Validate pagination page/limit ranges

### Integration Tests
- ✅ GET /pastoral/listings?category=DOGS returns only dogs
- ✅ GET /pastoral/listings?priceMin=50&priceMax=100 filters correctly
- ✅ GET /pastoral/listings?available=false returns unavailable items
- ✅ GET /pastoral/listings?sortBy=price&sortOrder=asc sorts ascending
- ✅ GET /pastoral/listings?page=0&limit=5 returns first 5 items
- ✅ GET /pastoral/listings (no params) returns first 20 available items
- ✅ GET /pastoral/listings?category=INVALID returns HTTP 400

### End-to-End Tests
- ✅ Shopper filters to DOGS, sees only dogs, price range correct
- ✅ Shopper changes sort order, items reorder correctly
- ✅ Shopper navigates to page 2, sees different items
- ✅ Empty filter result shows friendly message

---

## Contract Change Log

| Date | Version | Change | Impact |
|------|---------|--------|--------|
| 2026-04-30 | 1.0.0 | Initial contract | New feature |

---

**Approved By**: /speckit.plan workflow  
**Status**: ✅ Ready for backend implementation  
**Last Updated**: 2026-04-30
