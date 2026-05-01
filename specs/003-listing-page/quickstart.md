# Quickstart: Pet Listing Page Development

**Last Updated**: 2026-04-30  
**Feature Branch**: `003-listing-page`  
**Status**: Ready for implementation

## Overview

This guide walks through setting up the development environment for the Pet Listing Page feature, including database schema, backend API service, and frontend React application.

---

## Prerequisites

- **Java 17+** (backend)
- **Node.js 18+** (frontend)
- **PostgreSQL 14+** (database)
- **Git** (version control)
- **Maven** (Java build tool)
- **npm** or **yarn** (Node package manager)

---

## Part 1: Database Setup

### 1.1 Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE petstore_dev;

# Connect to new database
\c petstore_dev

# Create schema for listings
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
  deleted_at TIMESTAMP NULL
);

# Create indexes for filtering and sorting
CREATE INDEX idx_pet_listings_category ON pet_listings(category);
CREATE INDEX idx_pet_listings_price ON pet_listings(price);
CREATE INDEX idx_pet_listings_availability ON pet_listings(availability);
```

### 1.2 Seed Sample Data

```sql
INSERT INTO pet_listings (name, category, price, availability, description, image_url) VALUES
  ('Golden Retriever Puppy', 'DOGS', 75.99, true, 'Friendly and energetic 3-month-old puppy', 'https://images.petstore.com/dogs/golden-1.jpg'),
  ('Labrador Mix', 'DOGS', 65.50, true, 'Adult dog, calm temperament', 'https://images.petstore.com/dogs/lab-1.jpg'),
  ('Siamese Kitten', 'CATS', 45.00, true, 'Playful blue-point Siamese, 2 months old', 'https://images.petstore.com/cats/siamese-1.jpg'),
  ('Parrot (Amazon)', 'BIRDS', 120.00, true, 'Colorful parrot, social and vocal', 'https://images.petstore.com/birds/amazon-1.jpg'),
  ('Goldfish', 'FISHES', 5.99, true, 'Classic goldfish, hardy and easy to care for', 'https://images.petstore.com/fishes/goldfish-1.jpg');
```

### 1.3 Verify Database Connection

```bash
psql -U postgres -d petstore_dev -c "SELECT COUNT(*) FROM pet_listings;"
# Expected output: 5
```

---

## Part 2: Backend Setup (Java Spring Boot)

### 2.1 Clone Repository and Create Feature Branch

```bash
cd /path/to/petstore
git checkout -b 003-listing-page
```

### 2.2 Project Structure

Ensure the following structure exists in `backend/`:

```
backend/
├── pom.xml                              # Maven configuration
├── src/main/java/com/pastoral/petstore/listing/
│   ├── PetstoreListingApplication.java  # Spring Boot main class
│   ├── controller/
│   │   └── ListingController.java       # REST endpoints
│   ├── service/
│   │   └── ListingService.java          # Business logic
│   ├── repository/
│   │   └── ListingRepository.java       # JPA repository
│   ├── model/
│   │   ├── PetListing.java              # JPA entity
│   │   ├── PetCategory.java             # Enum
│   │   └── ListingResponse.java         # DTO
│   ├── exception/
│   │   └── ListingException.java        # Custom exceptions
│   └── config/
│       └── DataSourceConfig.java        # DB configuration
├── src/main/resources/
│   ├── application-dev.yml              # Development configuration
│   └── logback-spring.xml               # Logging configuration
└── src/test/java/com/pastoral/petstore/listing/
    ├── controller/
    │   └── ListingControllerTest.java
    ├── service/
    │   └── ListingServiceTest.java
    └── repository/
        └── ListingRepositoryTest.java
```

### 2.3 Maven pom.xml Configuration

Add dependencies for Spring Boot, Spring Data JPA, and PostgreSQL:

```xml
<!-- pom.xml snippet -->
<dependencies>
  <!-- Spring Boot Web -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- Spring Data JPA -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- PostgreSQL Driver -->
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
    <scope>runtime</scope>
  </dependency>
  
  <!-- Logging -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- Validation -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- Micrometer for Metrics -->
  <dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-core</artifactId>
    <version>1.12.0</version>
  </dependency>
  
  <!-- Testing -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>3.2.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

### 2.4 Application Configuration (application-dev.yml)

```yaml
spring:
  application:
    name: petstore-listing-service
  
  datasource:
    url: jdbc:postgresql://localhost:5432/petstore_dev
    username: postgres
    password: admin
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate  # Don't auto-create; use migrations
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
      hibernate.format_sql: true
      hibernate.generate_statistics: false
  
  servlet:
    multipart:
      max-file-size: 10MB

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    com.pastoral.petstore: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/petstore-listing.log

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
  endpoint:
    health:
      show-details: always
```

### 2.5 Build and Run Backend

```bash
cd backend

# Build project
mvn clean package -DskipTests

# Run application
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Expected output:
# Started PetstoreListingApplication in 5.2 seconds
# Server running on http://localhost:8080/pastoral
```

### 2.6 Verify Backend API

```bash
# Test GET /pastoral/listings (should return all 5 sample pets)
curl -X GET "http://localhost:8080/pastoral/listings"

# Expected response:
# {
#   "status": "success",
#   "data": {
#     "items": [
#       {"id": 1, "name": "Golden Retriever Puppy", "category": "DOGS", "price": 75.99, ...},
#       ...
#     ],
#     "pagination": {"page": 0, "limit": 20, "total": 5, "totalPages": 1, ...}
#   },
#   "timestamp": "2026-04-30T12:00:00Z"
# }
```

### 2.7 Run Backend Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ListingControllerTest

# Expected output:
# Tests run: 12, Failures: 0, Errors: 0
```

---

## Part 3: Frontend Setup (React + Tailwind + MUI)

### 3.1 Create React Application

```bash
cd frontend

# If starting fresh, create new React project with Vite
npm create vite@latest . -- --template react
npm install

# If existing project, ensure dependencies below are installed
```

### 3.2 Install Dependencies

```bash
npm install react-query axios
npm install -D tailwindcss postcss autoprefixer @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# Initialize Tailwind
npx tailwindcss init -p

# Expected output:
# Created Tailwind config and PostCSS config
```

### 3.3 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── pages/
│   │   └── ListingPage.jsx
│   ├── components/
│   │   ├── ListingGrid.jsx
│   │   ├── ListingCard.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── SortDropdown.jsx
│   │   ├── EmptyState.jsx
│   │   └── ErrorState.jsx
│   ├── hooks/
│   │   └── useListings.js
│   ├── services/
│   │   └── listingService.js
│   ├── types/
│   │   └── listing.ts
│   ├── styles/
│   │   └── globals.css
│   └── App.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### 3.4 Environment Configuration

Create `.env.development`:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=5000
```

### 3.5 API Service (listingService.js)

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
});

export const fetchListings = async (filters) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.priceMin) params.append('priceMin', filters.priceMin);
  if (filters.priceMax) params.append('priceMax', filters.priceMax);
  params.append('available', filters.available);
  params.append('sortBy', filters.sortBy);
  params.append('sortOrder', filters.sortOrder);
  params.append('page', filters.page);
  params.append('limit', filters.limit);

  const response = await apiClient.get('/listings', { params });
  return response.data.data;
};

export default { fetchListings };
```

### 3.6 React Query Hook (useListings.js)

```javascript
import { useQuery } from 'react-query';
import { fetchListings } from '../services/listingService';

export const useListings = (filters) => {
  const queryKey = [
    'listings',
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.available,
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
  ];

  return useQuery({
    queryKey,
    queryFn: () => fetchListings(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
```

### 3.7 ListingPage Component (ListingPage.jsx)

```jsx
import React, { useState } from 'react';
import { Container, CircularProgress, Alert } from '@mui/material';
import { useListings } from '../hooks/useListings';
import ListingGrid from '../components/ListingGrid';
import FilterPanel from '../components/FilterPanel';
import SortDropdown from '../components/SortDropdown';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function ListingPage() {
  const [filters, setFilters] = useState({
    category: '',
    priceMin: 0,
    priceMax: Infinity,
    available: true,
    page: 0,
    limit: 20,
    sortBy: 'price',
    sortOrder: 'asc',
  });

  const { data, isLoading, error } = useListings(filters);

  if (isLoading) return <CircularProgress />;
  if (error) return <ErrorState error={error} />;
  if (data?.items.length === 0) return <EmptyState filters={filters} />;

  return (
    <Container maxWidth="lg" className="py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Listings</h1>
      
      <div className="flex gap-4 mb-6">
        <FilterPanel filters={filters} setFilters={setFilters} />
        <SortDropdown filters={filters} setFilters={setFilters} />
      </div>

      <ListingGrid items={data?.items} />

      {/* Pagination controls */}
      <div className="mt-8 flex justify-center gap-4">
        {/* Previous/Next buttons */}
      </div>
    </Container>
  );
}
```

### 3.8 Build and Run Frontend

```bash
cd frontend

# Development server
npm run dev

# Expected output:
# VITE v4.4.9  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# Open browser to http://localhost:5173/
```

### 3.9 Verify Frontend Connection

- Navigate to `http://localhost:5173/`
- Verify ListingGrid displays 5 pet cards from API
- Filter by category (should update results)
- Change sort order (should reorder results)
- Verify no console errors

### 3.10 Run Frontend Tests

```bash
# Start test runner
npm run test

# Expected output:
# Tests: 8 passed (component + hook tests)
```

---

## Part 4: Local Integration Testing

### 4.1 E2E Test Scenario

```bash
# Terminal 1: Start PostgreSQL (if not running)
sudo systemctl start postgresql
# or
brew services start postgresql  # macOS

# Terminal 2: Start Backend
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Terminal 3: Start Frontend
cd frontend
npm run dev

# Browser: Open http://localhost:5173/
# 1. Verify 5 pet cards display
# 2. Filter by category "DOGS" → should show 2 dogs
# 3. Set price range $50-$100 → should show relevant pets
# 4. Sort by "Price: High to Low" → should reorder
# 5. Change to page 2 → should be empty (only 5 items total)
# 6. Clear filters → should show all 5 again
```

### 4.2 Health Checks

```bash
# Backend health check
curl http://localhost:8080/pastoral/actuator/health

# Expected:
# {"status":"UP","components":{"db":{"status":"UP"}}}

# Frontend health check (should load without errors)
curl http://localhost:5173/
# Expected: HTML response without console errors
```

---

## Part 5: Debugging Tips

### Backend Debug Mode

Enable debug logging in `application-dev.yml`:

```yaml
logging:
  level:
    com.pastoral.petstore: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

Then view `logs/petstore-listing.log` for detailed output.

### Frontend Debug Mode

Use React DevTools browser extension and verify React Query cache:

```javascript
// In console
import { useQueryClient } from 'react-query';
const queryClient = useQueryClient();
queryClient.getQueryData(['listings', '']); // View cache
```

### Database Query Debugging

```sql
-- Monitor active queries
SELECT pid, query, state FROM pg_stat_activity WHERE state = 'active';

-- Check indexes are being used
EXPLAIN ANALYZE SELECT * FROM pet_listings WHERE category = 'DOGS';
-- Should show "Index Scan using idx_pet_listings_category"
```

---

## Part 6: Deployment Preparation

### 6.1 Create .env.production

```
VITE_API_BASE_URL=https://petstore-api.render.com/api
VITE_API_TIMEOUT=10000
```

### 6.2 Build for Production

```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
# Outputs to dist/
```

### 6.3 Deploy to Render

See `.github/workflows/deploy.yml` (Phase 2 deliverable) for CI/CD pipeline configuration.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PostgreSQL connection refused | Verify `psql -U postgres` works; check credentials in application-dev.yml |
| Port 8080 already in use | Kill process: `lsof -ti:8080 \| xargs kill -9` |
| CORS errors in browser | Backend must set `Access-Control-Allow-Origin: *` (or whitelist localhost:5173) |
| React Query not caching | Verify `staleTime` is set; check `queryKey` is consistent |
| Empty table on startup | Run seed data SQL from section 1.2 |
| Listing card images not loading | Verify image URLs are accessible (HTTPS recommended) |

---

## Next Steps

1. **Implement Backend Service** (Phase 2)
   - Create `ListingController` with GET /listings endpoint
   - Implement `ListingService` with filter/sort logic
   - Write unit and integration tests

2. **Implement Frontend UI** (Phase 2)
   - Create React components for listing grid, cards, filters
   - Integrate React Query for data fetching and caching
   - Add error and empty-state handling

3. **Security & Observability** (Phase 2)
   - Add structured logging to backend
   - Configure Micrometer metrics
   - Set up health checks for Render deployment

4. **Deploy to Render** (Phase 3)
   - Set up Render backend service
   - Set up Render frontend service
   - Configure environment variables and secrets

---

**Ready to Start?** Create your first feature branch and begin implementing the backend service!

```bash
git checkout -b 003-listing-page-backend
# Start implementing ListingController.java...
```

---

**Last Updated**: 2026-04-30  
**Status**: ✅ Development environment ready for implementation
