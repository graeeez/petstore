# Implementation Plan: Pet Listing Page

**Branch**: `003-listing-page` | **Date**: 2026-04-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-listing-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The pet listing page is the primary discovery entry point for the Petstore e-commerce platform. The feature enables shoppers to browse available pets with core details, filter by category and price, sort results, and navigate to detail views. The page MUST display available pets (dogs, cats, birds, fishes) with name, category, price, and availability status. Filtering, sorting, and empty-state handling are critical for search efficiency and user guidance. Backend listing service will be implemented in Java Spring Boot with PostgreSQL persistence, consuming contract-first APIs. Frontend will be React + Tailwind CSS + MUI, with client-side filter/sort logic consuming the listing API. The solution prioritizes test-first verification, security controls for data access boundaries, and observability for load failures and degraded conditions.

## Technical Context

**Language/Version**: Java 17 (backend) + React 18 (frontend)  
**Primary Dependencies**: Spring Boot 3.x, Spring Data JPA, React Query, MUI 5, Tailwind CSS 3  
**Storage**: PostgreSQL 14+ for pet catalog, listings, and inventory  
**Testing**: JUnit 5 + Mockito (backend), Jest + React Testing Library (frontend)  
**Target Platform**: Render (web service hosting) + modern web browsers  
**Project Type**: Web service with frontend (e-commerce listing page)  
**Performance Goals**: 95% of shoppers load and view results within 3 seconds; 90% can find desired category within 60 seconds  
**Constraints**: 99% accuracy for filter/sort results; 100% coverage for empty-state and error messaging; availability freshness sufficient for checkout accuracy  
**Scale/Scope**: Multi-category pet listing (4+ categories: dogs, cats, birds, fishes); support for pagination, filtering (category, price range), and sorting (price, popularity, newest)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Stack compliance**: Java Spring Boot + PostgreSQL backend (catalog/inventory domains), React + Tailwind + MUI frontend. Aligns with Petstore Constitution I (Domain-Centric Commerce Architecture).

✅ **Contract-first design**: API contracts for `/listings` endpoint (GET with filters/sort) will be versioned and documented before backend implementation. Aligns with Constitution II (Contract-First API and UI Consistency).

✅ **Test-first readiness**: Acceptance criteria in spec define unit tests (filter logic, sort logic, API response handling) and integration tests (listing retrieval, filter/sort combination, empty states, error handling). Critical user story (browse listings) will have end-to-end coverage. Aligns with Constitution III (Test-First Delivery Gates).

✅ **Security controls**: API access boundaries will enforce authentication if required for shopper context; input validation for filter parameters (price range bounds, category enum); sensitive backend fields (cost, supplier info) will NOT be exposed to shoppers. Aligns with Constitution IV (Security and Data Protection by Default).

✅ **Observability and operations**: Structured logs for listing API load failures, empty-state conditions, and performance metrics (p95 load time). Health checks and smoke tests for Render deployment readiness will be documented. Aligns with Constitution V (Observability and Operational Readiness).

**Status**: ✅ **PASSED** — Feature is ready for Phase 0 research and Phase 1 design.

## Project Structure

### Documentation (this feature)

```text
specs/003-listing-page/
├── plan.md              # This file (implementation plan with tech context, research, design)
├── research.md          # Phase 0 research outcomes (contract options, filtering patterns, API latency considerations)
├── data-model.md        # Phase 1: Data model (PetListingSummary, ListingFilterState, ListingSortPreference)
├── quickstart.md        # Phase 1: Development setup and running the feature locally
├── contracts/           # Phase 1: API contract definitions
│   ├── GET_listings.md  # Contract for listing retrieval with filter/sort parameters
│   └── responses/       # Response schema examples
└── checklists/          # Requirements tracking
    └── requirements.md  # Acceptance criteria checklist
```

### Source Code (repository structure)

**Backend** (Java Spring Boot):
```text
backend/
├── src/main/java/com/pastoral/petstore/listing/
│   ├── controller/
│   │   └── ListingController.java       # REST endpoints for /pastoral/listings
│   ├── service/
│   │   └── ListingService.java          # Business logic: filtering, sorting, pagination
│   ├── repository/
│   │   └── ListingRepository.java       # JPA repository for Pet/Listing persistence
│   ├── model/
│   │   ├── PetListing.java              # JPA entity
│   │   ├── ListingFilterCriteria.java   # Filter state DTO
│   │   └── ListingSortOrder.java        # Sort order enum
│   └── exception/
│       └── ListingException.java        # Custom exceptions for error handling
├── src/test/java/com/pastoral/petstore/listing/
│   ├── controller/
│   │   └── ListingControllerTest.java   # Integration tests for endpoints
│   ├── service/
│   │   └── ListingServiceTest.java      # Unit tests for filter/sort logic
│   └── repository/
│       └── ListingRepositoryTest.java   # Integration tests for database queries
└── src/main/resources/
    └── application.yml                  # Configuration for PostgreSQL, logging
```

**Frontend** (React + Tailwind + MUI):
```text
frontend/
├── src/
│   ├── pages/
│   │   └── ListingPage.jsx              # Main listing page component
│   ├── components/
│   │   ├── ListingGrid.jsx              # Grid display of listing cards
│   │   ├── ListingCard.jsx              # Individual pet listing card
│   │   ├── FilterPanel.jsx              # Category and price filter UI
│   │   ├── SortDropdown.jsx             # Sort order selector
│   │   ├── EmptyState.jsx               # No results messaging
│   │   └── ErrorState.jsx               # Load failure messaging
│   ├── hooks/
│   │   └── useListings.js               # React Query hook for listing API calls
│   ├── services/
│   │   └── listingService.js            # API client for /listings endpoint
│   └── types/
│       └── listing.ts                   # TypeScript interfaces for PetListingSummary
└── src/test/
    ├── components/
    │   ├── ListingGrid.test.jsx
    │   ├── FilterPanel.test.jsx
    │   └── EmptyState.test.jsx
    └── hooks/
        └── useListings.test.js
```

**Structure Decision**: Web application with separated backend (Java Spring Boot) and frontend (React). The backend provides contract-first API for listing retrieval with filtering/sorting. The frontend consumes this API and manages client-side filter state, pagination, and UI rendering with accessibility and performance in mind.

## Complexity Tracking

| Aspect | Status | Notes |
|--------|--------|-------|
| Constitutional Violations | None | Feature fully complies with all five Petstore Constitution principles |
| Technology Choices | Clear | Java Spring Boot + PostgreSQL + React + Tailwind + MUI align with platform standards |
| Architectural Decisions | Clear | Backend API (contract-first), frontend consumption, client-side filter/sort state management |
| Test Strategy | Clear | Unit tests for business logic, integration tests for API, component tests for UI |
| Security Design | Clear | Input validation on filter params, separation of shopper-visible vs. internal fields |
| Deployment Path | Clear | Render deployment with observability (logs, metrics, health checks) |

---

## Phase 0: Research Outcomes

### Research Tasks Completed

1. **API Contract Patterns for E-Commerce Listings**
   - Decision: Use REST API with query parameters for filtering (category, priceMin, priceMax, sortBy, page, limit)
   - Rationale: Standard pattern for e-commerce, easy client-side pagination, stateless server implementation
   - Alternatives: GraphQL (rejected for added complexity in initial release), gRPC (rejected for browser incompatibility)

2. **Filtering and Sorting Implementation Strategy**
   - Decision: Server-side filtering and sorting via JPA Specifications; client-side state management via React Query
   - Rationale: Server-side ensures data consistency and security (validated filters), React Query handles caching and pagination
   - Alternatives: Client-side filtering (rejected due to scalability with large catalogs), GraphQL filters (rejected per contract decision)

3. **Pagination and Performance**
   - Decision: Cursor-based pagination with limit parameter (e.g., ?page=0&limit=20)
   - Rationale: Stateless, efficient, reduces N+1 queries via JPA eager loading
   - Alternatives: Offset pagination (accepted but cursor-based preferable for large datasets in future)

4. **Error Handling and Empty States**
   - Decision: HTTP 200 with empty array for no results; HTTP 5xx with structured error response for failures; client-side UI states for each scenario
   - Rationale: RESTful conventions, clear error diagnosis, user-friendly messaging
   - Alternatives: Different HTTP codes for empty vs. error (rejected to keep contract simple)

5. **Observability Requirements**
   - Decision: Structured JSON logging (SLF4J + Logback), metrics for request count/latency (Micrometer), health checks (/actuator/health)
   - Rationale: Render-friendly, detects degradation, supports alerting
   - Alternatives: Custom logging (rejected for lack of standardization)

6. **Database Schema for Listings**
   - Decision: Pet entity with columns: id, name, category (enum: DOGS, CATS, BIRDS, FISHES), price, availability (boolean), createdAt
   - Rationale: Supports filtering by category and price, availability check, audit trail
   - Alternatives: JSONB columns for flexible attributes (accepted for future extensibility but not needed for MVP)

### Research Summary

The listing page architecture uses a **contract-first REST API** with **server-side filtering/sorting** and **client-side state management**. The backend will provide a single `/pastoral/listings` endpoint accepting category, price range, sort order, and pagination parameters. The frontend consumes this API via React Query, manages filter state locally, and renders responsive cards using MUI components. Database schema is optimized for the four core categories (dogs, cats, birds, fishes) with price and availability filtering. Error handling and empty states follow HTTP conventions with structured error responses. Observability is built in with SLF4J logging and Micrometer metrics for Render deployment diagnostics.

---

## Phase 1: Design Artifacts

### Deliverables Completed ✅

All Phase 1 design artifacts have been generated and are ready for implementation:

#### 1. Data Model Definition
**File**: [data-model.md](data-model.md)

Defines five core entities:
- **PetListing**: JPA entity with indexed columns for category, price, and availability
- **PetCategory**: Enum {DOGS, CATS, BIRDS, FISHES}
- **ListingFilterState**: Frontend DTO for active filter criteria
- **ListingSortPreference**: UI state enum for sort options
- **PetListingSummary**: API response DTO (shopper-facing view)

Includes validation rules, relationships, query patterns, React Query cache structure, and testing acceptance criteria.

#### 2. API Contract Specification
**File**: [contracts/GET_listings.md](contracts/GET_listings.md)

Complete REST API contract including:
- Request parameters: category, priceMin, priceMax, available, sortBy, sortOrder, page, limit
- Success response format with pagination metadata
- Error responses (HTTP 400, 503, 500) with structured error bodies
- Example requests and responses for all major scenarios
- Performance SLA (P95 < 1 second, P99 < 3 seconds)
- Security considerations and validation requirements
- Test coverage matrix (unit, integration, E2E)

#### 3. Development Quickstart Guide
**File**: [quickstart.md](quickstart.md)

Step-by-step setup guide for local development:
- Part 1: PostgreSQL database creation and schema
- Part 2: Backend (Java Spring Boot) setup, Maven configuration, application properties
- Part 3: Frontend (React + Tailwind + MUI) setup, dependencies, API service, hooks
- Part 4: Local integration testing scenarios
- Part 5: Debugging tips and troubleshooting
- Part 6: Production build and Render deployment preparation

#### 4. Research Outcomes Document
**File**: [research.md](research.md)

Comprehensive research findings with rationale for all technical decisions:
- API contract pattern (REST vs. GraphQL vs. gRPC)
- Filtering and sorting strategy (server-side with client cache)
- Pagination approach (offset-based)
- Filter parameters (category, price range, availability)
- Sort criteria (price, newest first, future: popularity)
- Error handling patterns
- Database schema design
- Observability requirements (SLF4J, Micrometer, health checks)
- Performance targets and monitoring
- Security controls
- Decision matrix with approval status

### Constitution Check: Phase 1 Re-Evaluation ✅

Re-validating all five Petstore Constitution principles post-design:

✅ **I. Domain-Centric Commerce Architecture**
- Listing service maps to catalog domain
- Backend: Java Spring Boot + PostgreSQL
- Frontend: React + Tailwind CSS + MUI
- Cross-domain coupling minimized via API contract

✅ **II. Contract-First API and UI Consistency**
- API contract versioned and documented in contracts/GET_listings.md
- Endpoint: GET /pastoral/listings with query parameters
- Response schema includes pagination, error details, timestamps
- Frontend consumes via React Query without bypassing validation

✅ **III. Test-First Delivery Gates**
- Data model includes acceptance criteria (unit, integration, component tests)
- Contract includes test coverage matrix (unit, integration, E2E)
- Quickstart includes local integration test scenarios
- All testing gates defined before implementation begins

✅ **IV. Security and Data Protection by Default**
- Input validation documented for all filter parameters
- Safe column projection: PetListingSummary excludes cost, supplier, profit
- Soft delete (deletedAt) for audit trail
- Error responses don't expose internal field names

✅ **V. Observability and Operational Readiness**
- Structured logging with SLF4J + Logback documented
- Metrics collection via Micrometer (request count, latency, filter counts)
- Health checks via Spring Boot Actuator
- Smoke test command included in Render deployment checklist

**Status**: ✅ **ALL GATES PASSED** — Design is constitutional and ready for implementation

---

## Next Steps

### Phase 2: Task Breakdown and Implementation
- Use `/speckit.tasks` command to generate implementation tasks
- Create tickets for backend service implementation (controller, service, repository, tests)
- Create tickets for frontend components (grid, cards, filters, hooks, tests)
- Create tickets for database migrations and seed data
- Assign tasks to development team

### Phase 3: Code Review and Deployment
- Code review checklist: contract compliance, test coverage, security review, observability metrics
- Smoke tests on Render staging environment
- Production deployment with health checks and rollback plan

### Tracking
- **Branch**: `003-listing-page`
- **Spec**: [spec.md](spec.md)
- **Plan**: This file
- **Team**: Backend (Java Spring Boot), Frontend (React), DevOps (Render deployment)

---

**Plan Status**: ✅ **COMPLETE**  
**Generated**: 2026-04-30  
**Generated By**: /speckit.plan workflow  
**Constitution Version**: 1.0.0  
**Next Command**: `/speckit.tasks` (Phase 2)

