# Phase 0: Research Outcomes - Pet Listing Page

**Completed**: 2026-04-30  
**Related Plan**: [plan.md](plan.md)

## Overview

This document consolidates research decisions for the Pet Listing Page feature, resolving technical unknowns and establishing patterns for API design, filtering/sorting, pagination, observability, and database schema.

---

## Research Findings

### 1. API Contract Pattern for Listings

**Question**: How should the listing API be designed to support filtering, sorting, and pagination?

**Decision**: REST API with query parameters

```
GET /pastoral/listings?category=DOGS&priceMin=10&priceMax=100&sortBy=price&sortOrder=asc&page=0&limit=20
```

**Rationale**:
- REST conventions align with browser-native fetch and modern API expectations
- Query parameters are stateless and easy to cache via HTTP headers
- Query parameters support bookmarking and sharing filtered views
- Supports pagination without server-side state

**Alternatives Considered**:
- **GraphQL** (rejected): Adds complexity for a single resource; overhead in initial release; browser caching less straightforward
- **gRPC** (rejected): Incompatible with browser clients; unnecessary overhead for web UI

**Contract Compliance**: ✅ Aligns with Constitution II (Contract-First API)

---

### 2. Filtering and Sorting Implementation

**Question**: Should filtering and sorting be handled server-side, client-side, or hybrid?

**Decision**: Server-side filtering/sorting with client-side state management

**Rationale**:
- **Server-side**: Ensures data consistency, security (validated filters), scalability with large catalogs
- **Client-side state**: React Query caches results, manages pagination, handles request deduplication
- Hybrid approach: Best of both—validated backend ensures correctness; client cache improves UX

**Implementation**:
- Backend: JPA Specifications or Criteria API for dynamic query building based on filter parameters
- Frontend: React Query for caching, React hooks for local filter state
- Example: User selects category=DOGS and priceMax=50, frontend sends to backend, backend validates and queries database

**Alternatives Considered**:
- **Pure client-side filtering** (rejected): Requires loading entire dataset; unscalable; security risk (exposing all data)
- **Graphql filters** (rejected): Deferred per API contract decision

**Contract Compliance**: ✅ Aligns with Constitution I (Domain-Centric) and IV (Security)

---

### 3. Pagination Strategy

**Question**: Which pagination pattern is best for the listing page?

**Decision**: Offset-based pagination with page and limit parameters

```
?page=0&limit=20  (fetches items 0-19)
?page=1&limit=20  (fetches items 20-39)
```

**Rationale**:
- Stateless (server doesn't maintain page state)
- Easy to implement with SQL OFFSET/LIMIT
- JPA/Hibernate handles efficiently
- Standard pattern—users understand it
- Works well with sorting

**Implementation**:
- Backend returns metadata: `{items: [...], total: 150, page: 0, limit: 20, totalPages: 8}`
- Frontend uses React Query `useInfiniteQuery` for seamless infinite scroll or pagination controls

**Alternatives Considered**:
- **Cursor-based pagination** (accepted for future): More efficient for large datasets; complex to implement initially; better for real-time data changes
- **Keyset pagination** (noted): Alternative cursor approach; similar tradeoffs

**Contract Compliance**: ✅ Aligns with performance goals (SC-001: load within 3 seconds)

---

### 4. Filtering Parameters

**Question**: Which filter fields should the API support?

**Decision**: Category, price range, and availability

**Categories**:
- DOGS
- CATS
- BIRDS
- FISHES

**Price Range**:
- `priceMin` (inclusive, in cents or dollars—decision: dollars for simplicity)
- `priceMax` (inclusive)

**Availability**:
- Boolean flag: include/exclude unavailable items

**Rationale**:
- Categories from spec requirement FR-003
- Price range from spec requirement FR-005
- Availability from spec requirement FR-011 (keep current)

**Example Query**:
```
GET /pastoral/listings?category=DOGS&priceMin=20&priceMax=150&available=true&sortBy=price&sortOrder=asc&page=0&limit=20
```

**Contract Compliance**: ✅ Aligns with spec FR-004, FR-005, FR-007

---

### 5. Sort Criteria

**Question**: Which sort options should be available to shoppers?

**Decision**: Sort by price (ascending/descending), newest first, and popularity (future)

**Initial Sort Options**:
1. **Price: Low to High** (sortBy=price&sortOrder=asc)
2. **Price: High to Low** (sortBy=price&sortOrder=desc)
3. **Newest First** (sortBy=createdAt&sortOrder=desc)

**Rationale**:
- Price sorting aligns with e-commerce expectations (FR-006)
- Newest first supports discovery and feature highlights
- "Popularity" deferred to Phase 2 (requires click-tracking or similar)

**Frontend UX**: Dropdown with labels; user-friendly names map to API parameters

**Contract Compliance**: ✅ Aligns with spec FR-006

---

### 6. Error Handling and Empty States

**Question**: How should the API communicate empty results vs. errors?

**Decision**: Use HTTP 200 for both empty results and successful responses; use 4xx/5xx for errors

**Responses**:

**Success (empty results)**:
```json
HTTP 200 OK
{
  "items": [],
  "total": 0,
  "page": 0,
  "limit": 20,
  "totalPages": 0,
  "message": "No listings match your filters"
}
```

**Error (e.g., invalid category)**:
```json
HTTP 400 Bad Request
{
  "error": "INVALID_FILTER",
  "message": "Category 'HAMSTERS' is not supported. Valid options: DOGS, CATS, BIRDS, FISHES",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Error (e.g., database failure)**:
```json
HTTP 500 Internal Server Error
{
  "error": "SERVICE_UNAVAILABLE",
  "message": "Unable to retrieve listings. Please try again later.",
  "timestamp": "2026-04-30T12:00:00Z",
  "requestId": "abc123xyz"
}
```

**Frontend Handling**:
- Empty state: Show friendly messaging (FR-009)
- User-facing errors: Display error state with retry option (FR-010)
- Request ID in error: Helps support team debug issues

**Rationale**:
- 200 for empty results keeps contracts simple (predictable response format)
- 4xx/5xx for errors follows HTTP conventions
- Structured errors aid debugging and frontend error handling

**Contract Compliance**: ✅ Aligns with spec FR-009, FR-010

---

### 7. Database Schema

**Question**: What schema should store pet listings?

**Decision**: Core Pet/Listing table with indexed filtering columns

**Schema**:
```sql
CREATE TABLE pet_listings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('DOGS', 'CATS', 'BIRDS', 'FISHES')),
  price DECIMAL(10, 2) NOT NULL,
  availability BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL (soft delete for audit trail)
);

CREATE INDEX idx_pet_listings_category ON pet_listings(category);
CREATE INDEX idx_pet_listings_price ON pet_listings(price);
CREATE INDEX idx_pet_listings_availability ON pet_listings(availability);
```

**Rationale**:
- Simple, normalized schema supports filtering and sorting
- Indexed columns for category, price, availability improve query performance
- Soft delete (deleted_at) for audit trail and data recovery
- Timestamp columns track creation and updates for observability

**Alternatives Considered**:
- **JSONB attributes** (deferred): Adds flexibility for future extensions; not needed for MVP with fixed categories
- **Separate Category table** (rejected for simplicity): Enum sufficient for known categories

**Contract Compliance**: ✅ Aligns with Constitution I (Domain-Centric) and observability

---

### 8. Observability and Logging

**Question**: What observability is needed for production diagnostics on Render?

**Decision**: Structured JSON logging + request metrics + health checks

**Logging (SLF4J + Logback)**:
```
2026-04-30T12:00:00.123Z INFO  ListingService - GET /pastoral/listings called with category=DOGS, priceMin=10, priceMax=100
2026-04-30T12:00:00.456Z DEBUG ListingRepository - Executing query: SELECT * FROM pet_listings WHERE category='DOGS' AND price BETWEEN 10 AND 100
2026-04-30T12:00:00.789Z INFO  ListingController - Response: 20 items returned, totalPages=5, duration=666ms
```

**Metrics (Micrometer)**:
- `http.requests.total` (count by endpoint)
- `http.request.duration.seconds` (histogram for latency)
- `listings.filter.count` (count by filter type)
- `database.query.duration.seconds` (detect slow queries)

**Health Checks**:
- `/actuator/health` (Spring Boot Actuator)
- Database connectivity check
- Response: `{"status": "UP", "components": {"db": {"status": "UP"}}}`

**Smoke Test on Render Deploy**:
```bash
curl -f https://petstore-api.render.com/pastoral/listings || exit 1
echo "Listing page API is healthy"
```

**Rationale**:
- Structured logs enable Render's log aggregation
- Metrics detect performance regressions and failures
- Health checks enable automated alerting and rollback

**Contract Compliance**: ✅ Aligns with Constitution V (Observability)

---

### 9. Performance Targets

**Question**: What performance targets must the listing API meet?

**Decision**: 
- SC-001: 95% of shoppers load results within 3 seconds
- SC-002: 90% can find desired category within 60 seconds

**Implementation Approach**:
- Database indexes on category, price, availability (prevents full table scans)
- Result limit default 20 items (vs. unlimited)
- Connection pooling (HikariCP) to reduce connection overhead
- Response caching headers for static assets
- Frontend React Query caching for repeated filter combinations

**Monitoring**:
- Track p95 and p99 latency via Micrometer metrics
- Alert if p95 > 3 seconds
- Load test with 100+ concurrent users before release

**Contract Compliance**: ✅ Aligns with SC-001, SC-002

---

### 10. Security Considerations

**Question**: What security controls are needed for the listing API?

**Decision**:
- Input validation on all filter parameters (enum values, price ranges)
- No exposure of internal fields (cost, supplier, profit margin)
- Rate limiting (optional, Phase 2) to prevent abuse
- HTTPS only (enforced by Render)

**Implementation**:
- Backend: Validate category against enum; validate priceMin <= priceMax; reject unexpected fields
- Database: SELECT only shopper-visible columns (name, category, price, availability, description, image_url)
- Frontend: Use HTTPS; no sensitive data in local storage

**Example Safe Query**:
```java
List<PetListing> getListings(String category, BigDecimal priceMin, BigDecimal priceMax, String sortBy, String sortOrder, int page, int limit) {
  // Validate and sanitize inputs
  if (!isValidCategory(category)) throw new InvalidFilterException();
  if (priceMin < 0 || priceMax < priceMin) throw new InvalidPriceRangeException();
  
  // Query database with validated parameters
  return repository.findBy(category, priceMin, priceMax, Sort.by(sortBy).ascending/descending(), PageRequest.of(page, limit));
}
```

**Contract Compliance**: ✅ Aligns with Constitution IV (Security)

---

## Decisions Matrix

| Decision | Choice | Status |
|----------|--------|--------|
| API Style | REST with query parameters | ✅ Approved |
| Filtering | Server-side with JPA Specifications | ✅ Approved |
| Pagination | Offset-based (page, limit) | ✅ Approved |
| Sort Options | Price (asc/desc), Newest First | ✅ Approved |
| Error Handling | HTTP 200 for empty, 4xx/5xx for errors | ✅ Approved |
| Database | PostgreSQL with indexed columns | ✅ Approved |
| Observability | SLF4J + Micrometer + Health Checks | ✅ Approved |
| Performance | p95 < 3 seconds, indexed queries | ✅ Approved |
| Security | Input validation, safe column projection | ✅ Approved |

---

## Next Steps

- **Phase 1**: Generate data-model.md (entity definitions), contract specifications, and quickstart guide
- **Phase 2**: Create task breakdown with unit test, integration test, and E2E test acceptance criteria
- **Phase 3**: Implement backend service and frontend UI

---

**Approved By**: /speckit.plan workflow  
**Date**: 2026-04-30
