# Tasks: Pet Listing Page

**Input**: Design documents from `/specs/003-listing-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included because the feature spec and constitution require unit, integration, and contract coverage for the listing journey.

**Organization**: Tasks are grouped by user story so each increment can be implemented and verified independently. Total: 36 tasks across 6 phases (T001-T036).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and shared source structure for the listing feature

- [x] T001 Create the backend and frontend source skeleton for the listing feature under backend/src/main/java/com/pastoral/petstore/listing/, backend/src/test/java/com/pastoral/petstore/listing/, and frontend/src/
- [x] T002 Initialize the Spring Boot backend build and runtime configuration in backend/pom.xml and backend/src/main/resources/application.yml with the com.pastoral.petstore package namespace and /pastoral context path
- [x] T003 [P] Initialize the React 18 frontend shell with Tailwind CSS, MUI, and React Query in frontend/package.json, frontend/tailwind.config.js, frontend/src/main.jsx, and frontend/src/App.jsx
- [x] T004 [P] Configure local developer tooling for the feature in backend/src/main/resources/logback-spring.xml, frontend/.eslintrc.cjs, and frontend/prettier.config.cjs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must exist before any user story work begins

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

- [x] T005 Create the PostgreSQL migration framework and pet_listings table schema in backend/src/main/resources/db/migration/V1__create_pet_listings.sql and backend/src/main/resources/db/migration/V2__seed_pet_listings.sql
- [x] T006 Create shared API response envelopes, listing error codes, and global exception handling in backend/src/main/java/com/pastoral/petstore/common/ApiResponse.java, backend/src/main/java/com/pastoral/petstore/common/ApiError.java, and backend/src/main/java/com/pastoral/petstore/common/GlobalExceptionHandler.java
- [x] T007 Configure Render-safe application profiles, validation defaults, and the /pastoral servlet mapping in backend/src/main/resources/application.yml and backend/src/main/resources/application-render.yml
- [x] T008 [P] Create the shared frontend API client, query-key helpers, and listing type definitions in frontend/src/services/apiClient.js, frontend/src/services/listingService.js, frontend/src/hooks/useListingQueryKey.js, and frontend/src/types/listing.ts
- [x] T009 [P] Add observability foundation with Spring Boot Actuator, Micrometer, and structured logging dependencies in backend/pom.xml and backend/src/main/resources/logback-spring.xml

---

## Phase 3: User Story 1 - Browse available pets (Priority: P1) 🎯 MVP

**Goal**: Show shoppers available pets with the core listing details they need to start browsing.

**Independent Test**: Open the listing page and verify available pet cards render with name, category, price, and availability, with paging continuing the browse flow.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add contract test coverage for the default GET /pastoral/listings browse response in backend/src/test/java/com/pastoral/petstore/listing/controller/ListingControllerTest.java
- [ ] T011 [P] [US1] Add service and repository integration tests for available-only listing retrieval, pagination, and empty-results behavior in backend/src/test/java/com/pastoral/petstore/listing/service/ListingServiceTest.java and backend/src/test/java/com/pastoral/petstore/listing/repository/ListingRepositoryTest.java

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement PetCategory, PetListing, and PetListingSummary in backend/src/main/java/com/pastoral/petstore/listing/model/PetCategory.java, backend/src/main/java/com/pastoral/petstore/listing/model/PetListing.java, and backend/src/main/java/com/pastoral/petstore/listing/model/PetListingSummary.java
- [x] T013 [US1] Implement the base listing repository queries and availability filtering in backend/src/main/java/com/pastoral/petstore/listing/repository/ListingRepository.java
- [x] T014 [US1] Implement the browse service, pagination mapping, and summary projection in backend/src/main/java/com/pastoral/petstore/listing/service/ListingService.java
- [x] T015 [US1] Implement GET /pastoral/listings in backend/src/main/java/com/pastoral/petstore/listing/controller/ListingController.java using the com.pastoral.petstore.listing package namespace and the contract response envelope
- [x] T016 [P] [US1] Build the React Query browse hook and API adapter in frontend/src/hooks/useListings.js and frontend/src/services/listingService.js
- [x] T017 [P] [US1] Build the listing page, grid, and card UI in frontend/src/pages/ListingPage.jsx, frontend/src/components/ListingGrid.jsx, and frontend/src/components/ListingCard.jsx
- [x] T018 [US1] Add browse empty-state, error-state, and availability rendering in frontend/src/components/EmptyState.jsx and frontend/src/components/ErrorState.jsx
- [ ] T019 [US1] Wire the listing page into the app entry point and local navigation in frontend/src/App.jsx and frontend/src/pages/ListingPage.jsx

**Checkpoint**: User Story 1 should now be fully functional and testable independently.

---

## Phase 4: User Story 2 - Filter and sort listings (Priority: P2)

**Goal**: Let shoppers narrow the catalog by category and price, and reorder results with meaningful sort options.

**Independent Test**: Apply category and price filters, clear them, and switch sort order; verify results update correctly and preserve the selected state.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test coverage for category, price range, sort, and pagination combinations in backend/src/test/java/com/pastoral/petstore/listing/controller/ListingControllerTest.java
- [ ] T021 [P] [US2] Add frontend component and hook tests for FilterPanel, SortDropdown, clear-filters, and zero-result behavior in frontend/src/test/components/FilterPanel.test.jsx, frontend/src/test/components/SortDropdown.test.jsx, frontend/src/test/components/EmptyState.test.jsx, and frontend/src/test/hooks/useListings.test.js

### Implementation for User Story 2

- [ ] T022 [US2] Extend the backend query layer to support category, priceMin, priceMax, sortBy, sortOrder, and validation rules in backend/src/main/java/com/pastoral/petstore/listing/service/ListingService.java and backend/src/main/java/com/pastoral/petstore/listing/repository/ListingRepository.java
- [ ] T023 [US2] Add invalid-filter and invalid-price-range handling in backend/src/main/java/com/pastoral/petstore/listing/exception/ListingException.java and backend/src/main/java/com/pastoral/petstore/common/GlobalExceptionHandler.java
- [x] T024 [P] [US2] Implement the FilterPanel and SortDropdown controls in frontend/src/components/FilterPanel.jsx, frontend/src/components/SortDropdown.jsx, and frontend/src/pages/ListingPage.jsx
- [ ] T025 [US2] Connect filter and sort state to the React Query cache key and request parameters in frontend/src/hooks/useListings.js, frontend/src/hooks/useListingQueryKey.js, and frontend/src/services/listingService.js
- [ ] T026 [US2] Add shopper-facing empty-state copy for zero-result filter combinations in frontend/src/components/EmptyState.jsx and frontend/src/pages/ListingPage.jsx

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Open listing details from page (Priority: P3)

**Goal**: Let shoppers open a listing card and move to the corresponding detail view for evaluation.

**Independent Test**: Click a listing card and confirm navigation reaches the configured detail route with the correct item identity.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add navigation-focused UI test coverage for listing-card clicks and route handoff in frontend/src/test/components/ListingCard.test.jsx and frontend/src/test/pages/ListingPage.test.jsx
- [ ] T028 [P] [US3] Add backend coverage for unavailable-listing projection and status messaging in backend/src/test/java/com/pastoral/petstore/listing/controller/ListingControllerTest.java

### Implementation for User Story 3

- [ ] T029 [US3] Wire listing card clicks to the existing detail route and preserve unavailable-status messaging in frontend/src/components/ListingCard.jsx and frontend/src/pages/ListingPage.jsx
- [ ] T030 [US3] Ensure availability freshness and soft-delete exclusion are enforced in backend/src/main/java/com/pastoral/petstore/listing/service/ListingService.java and backend/src/main/java/com/pastoral/petstore/listing/repository/ListingRepository.java

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, operational readiness, and deployment

- [ ] T031 [P] Add structured request logging, Micrometer counters and timers, and actuator health exposure in backend/src/main/resources/logback-spring.xml and backend/src/main/java/com/pastoral/petstore/listing/controller/ListingController.java
- [ ] T032 [P] Prepare Render deployment configuration and smoke-test coverage for GET /pastoral/listings in render.yaml and scripts/smoke-test-listings.sh
- [ ] T033 [P] Validate the quickstart and feature docs against the implemented build and runtime paths in specs/003-listing-page/quickstart.md and specs/003-listing-page/plan.md
- [ ] T034 Add end-to-end test coverage for the complete browse→filter→navigate path using Cypress or Playwright in frontend/e2e/tests/listing-flow.spec.ts or .cy.js, covering all three user stories (US1 browse, US2 filter/sort, US3 detail navigation) with explicit acceptance criteria validation before production release
- [ ] T035 Conduct performance verification and load testing to validate SLA targets in backend/; execute load test for P95 latency < 1 second and P99 < 3 seconds under 100 concurrent users using JMeter or similar; document results against success criteria SC-001 and SC-002; validate database query indexes are effective before Render deployment
- [ ] T036 Conduct security review per Constitution IV: validate API input validation strictness, confirm PetListingSummary excludes sensitive fields (cost, supplier, profit), verify soft-delete enforcement in all listing queries, and document security findings in pull request review before production release

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
- **Polish (Phase 6)**: Depends on the desired user stories being complete
- **Quality Assurance (T034-T036)**: E2E tests (T034) require User Stories 1-3 complete; performance verification (T035) and security review (T036) depend on all implementation tasks done and require completion before production deployment

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational - no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational - may reuse US1 page state but remains independently testable
- **User Story 3 (P3)**: Starts after Foundational - may integrate with US1/US2 but remains independently testable

### Within Each User Story

- Tests should be written before implementation and should fail first
- Backend model and repository work before service logic
- Service logic before controller or UI wiring
- UI state wiring before polish and deployment tasks

---

## Parallel Opportunities

- Setup tasks T003 and T004 can run in parallel with the backend and frontend scaffolding work after T001-T002 establish the project shape
- Foundational tasks T008 and T009 can run in parallel once the schema and shared error envelope are defined
- In US1, the backend tests T010-T011, data model T012, and frontend hook/UI tasks T016-T017 can be split across backend and frontend contributors
- In US2, the tests T020-T021 and the UI control work T024 can run in parallel with backend query expansion T022-T023
- In US3, UI navigation tests T027 and backend projection coverage T028 can run in parallel with the route wiring task T029

---

## Parallel Example: User Story 1

```bash
Task: "Add contract test coverage for the default GET /pastoral/listings browse response in backend/src/test/java/com/pastoral/petstore/listing/controller/ListingControllerTest.java"
Task: "Build the React Query browse hook and API adapter in frontend/src/hooks/useListings.js and frontend/src/services/listingService.js"
Task: "Build the listing page, grid, and card UI in frontend/src/pages/ListingPage.jsx, frontend/src/components/ListingGrid.jsx, and frontend/src/components/ListingCard.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Status**: US1 Core Implementation Complete (75%) - Tests Pending

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. ⏳ Complete Phase 3: User Story 1 (code done, tests pending)
   - ✅ Backend: Service, Repository, Controller, Models
   - ✅ Frontend: Components, API client, React Query integration
   - ⏳ Tests: T010, T011 contract/integration tests needed
   - ⏳ Wiring: T019 component integration verification
4. 🔄 Deploy to local/dev and validate the listing browse flow independently
5. 🔄 Add tests before production release

### Incremental Delivery

1. Phase 1-2: ✅ Complete
2. Phase 3 MVP: ✅ 75% (code), ⏳ 0% (tests)
3. Phase 4: Filter/Sort UI components done, backend validation pending
4. Phase 5: Detail navigation
5. Phase 6: Quality assurance (E2E, performance, security tests)

### Parallel Team Strategy

With multiple developers:

1. **Backend Dev**: Implement T022-T023 validation, T027-T030 availability checks
2. **Frontend Dev**: Complete T025-T026 filter state, T029 navigation wiring
3. **QA/DevOps**: Create T010-T011 tests, T034-T036 E2E/perf/security tests, T032 Render deployment
4. **Ops**: T031 observability metrics, T033 documentation validation

---

## Notes

- [P] tasks should be scoped to different files with no dependency overlap
- [Story] labels map each task to its user story for traceability
- The API contract path prefix is /pastoral, and the backend namespace is com.pastoral.petstore
- Keep the listing page independently testable after each user story checkpoint
