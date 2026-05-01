# Petstore Local Development Setup

Quick start guide for running the Pet Listing Page feature locally.

## Prerequisites

- **Java 26+** - [Download](https://adoptium.net/)
- **Maven 3.8+** - `brew install maven` (macOS) or [download](https://maven.apache.org/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - `brew install postgresql` (macOS) or [download](https://www.postgresql.org/download/)
- **Git** - `brew install git` (macOS) or [download](https://git-scm.com/)

## Step 1: Set Up PostgreSQL Database

```bash
# Start PostgreSQL service
brew services start postgresql  # macOS
# or `pg_ctl -D /usr/local/var/postgres start`

# Create database
createdb petstore_dev

# Connect and verify
psql petstore_dev
# Should show: petstore_dev=#

# Quit psql
\q
```

## Step 2: Build and Run Backend

```bash
cd backend

# Install dependencies and compile
mvn clean compile

# Run all tests
mvn test

# Start the backend server (dev profile)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Expected output:
# ... Tomcat started on port(s): 8080 (http) with context path '/pastoral'
# ... Application 'petstore-backend' started successfully
```

**Verify Backend**:
```bash
# Health check
curl http://localhost:8080/pastoral/actuator/health

# Get listings
curl http://localhost:8080/pastoral/listings

# Expected response:
# {"status":"success","message":"Listings retrieved successfully","data":{"items":[...],"pagination":{...}},"timestamp":"..."}
```

## Step 3: Install and Run Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Output:
# VITE v4.4.x ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

**Access the App**:
- Open http://localhost:5173/
- Should see "Available Pets" listing page with cards
- Filter and sort should work
- Click cards to test interactions

## Step 4: Run Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests (after npm install)
cd frontend
npm test

# Frontend lint
npm run lint

# Frontend format check
npm run format
```

## Step 5: Build for Production

```bash
# Backend WAR file
cd backend
mvn clean package
# Creates: target/petstore-backend-1.0.0.jar

# Frontend optimized build
cd frontend
npm run build
# Creates: dist/ directory with optimized assets
```

## Environment Variables

### Backend Development
- `SPRING_PROFILES_ACTIVE`: `dev` (default)
- `SPRING_DATASOURCE_URL`: `jdbc:postgresql://localhost:5432/petstore_dev` (default)
- `SPRING_DATASOURCE_USERNAME`: `postgres` (default)
- `SPRING_DATASOURCE_PASSWORD`: `admin` (default)

### Frontend Development
- `VITE_API_BASE_URL`: `/pastoral` (proxied to backend via Vite config)

### Production (Render Deployment)
- `DATABASE_URL`: PostgreSQL connection string (set by Render)
- `PORT`: Application port (default 8080)
- `JAVA_OPTS`: JVM options (memory tuning)

## Troubleshooting

### Backend Won't Start

```bash
# Check if port 8080 is in use
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process using port 8080
kill -9 <PID>  # macOS/Linux
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running
psql postgres -l

# Check petstore_dev database exists
psql -l | grep petstore_dev

# Recreate if needed
dropdb petstore_dev
createdb petstore_dev
# Backend will auto-run Flyway migrations on next start
```

### Frontend Can't Access Backend

```bash
# Verify backend is running on 8080
curl http://localhost:8080/pastoral/listings

# Check Vite proxy config in vite.config.js
# Should have: `/pastoral` -> `http://localhost:8080`

# Check browser console for CORS or network errors
# The proxy should handle requests transparently
```

### Maven Build Fails

```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Try again
mvn clean install -U
```

## Project Structure

```
petstore/
├── backend/
│   ├── src/main/java/com/pastoral/petstore/
│   │   ├── PetstoreBackendApplication.java
│   │   ├── listing/
│   │   │   ├── model/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   └── controller/
│   │   └── common/
│   │       ├── ApiResponse.java
│   │       ├── GlobalExceptionHandler.java
│   │       └── ListingException.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-render.yml
│   │   ├── logback-spring.xml
│   │   └── db/migration/
│   │       ├── V1__create_pet_listings.sql
│   │       └── V2__seed_pet_listings.sql
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── ListingPage.jsx
│   │   ├── components/
│   │   │   ├── ListingGrid.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   └── listingService.js
│   │   ├── hooks/
│   │   │   └── useListingQueryKey.js
│   │   ├── types/
│   │   │   └── listing.ts
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .eslintrc.cjs
│   └── prettier.config.cjs
├── specs/003-listing-page/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── data-model.md
│   ├── research.md
│   ├── quickstart.md (this file)
│   ├── contracts/GET_listings.md
│   └── checklists/requirements.md
├── render.yaml
├── .gitignore
└── IMPLEMENTATION_STATUS.md
```

## API Endpoints

### Get Listings
```
GET /pastoral/listings?category=DOGS&priceMin=0&priceMax=1000&sortBy=price&sortOrder=asc&page=0&limit=20
```

**Response**:
```json
{
  "status": "success",
  "message": "Listings retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Golden Retriever",
        "category": "DOGS",
        "price": 899.99,
        "availability": true,
        "description": "...",
        "imageUrl": "...",
        "createdAt": "2026-04-30T...",
        "updatedAt": "2026-04-30T..."
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 20,
      "totalElements": 5,
      "totalPages": 1,
      "hasMore": false
    }
  },
  "timestamp": "2026-04-30T...",
  "traceId": "uuid"
}
```

### Health Check
```
GET /pastoral/actuator/health
```

**Response**:
```json
{
  "status": "UP",
  "components": {...}
}
```

## Performance Targets

- **P95 Latency**: < 1 second (including database, network, rendering)
- **P99 Latency**: < 3 seconds
- **Default Page Size**: 20 items
- **Max Page Size**: 100 items
- **Concurrent Users**: 100 (production Render deployment)

## Next Steps

1. ✅ Run backend locally
2. ✅ Run frontend locally
3. ✅ Test browse, filter, sort functionality
4. ⏳ Implement tests (T010, T011)
5. ⏳ Deploy to Render
6. ⏳ Performance testing

For full feature details, see [specs/003-listing-page/spec.md](../specs/003-listing-page/spec.md)
For implementation status, see [IMPLEMENTATION_STATUS.md](../../IMPLEMENTATION_STATUS.md)
