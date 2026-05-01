# Phase 1: Data Model - Pet Listing Page

**Generated**: 2026-04-30  
**Related**: [plan.md](plan.md), [research.md](research.md)

## Overview

This document defines the data entities, relationships, and validation rules for the Pet Listing Page feature. The model supports filtering by category and price, sorting, pagination, and accurate availability tracking for shoppers.

---

## Core Entities

### 1. PetListing (Database Entity)

Represents a pet available for sale in the Petstore catalog.

**Entity Definition**:
```java
@Entity
@Table(name = "pet_listings", indexes = {
  @Index(name = "idx_category", columnList = "category"),
  @Index(name = "idx_price", columnList = "price"),
  @Index(name = "idx_availability", columnList = "availability")
})
public class PetListing {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotBlank(message = "Pet name is required")
  @Length(min = 1, max = 255)
  private String name;
  
  @NotNull(message = "Category is required")
  @Enumerated(EnumType.STRING)
  private PetCategory category;
  
  @NotNull(message = "Price is required")
  @DecimalMin(value = "0.01", message = "Price must be greater than 0")
  @DecimalMax(value = "999999.99")
  private BigDecimal price;
  
  @NotNull
  private Boolean availability;
  
  @Length(max = 2000)
  private String description;
  
  @Length(max = 500)
  private String imageUrl;
  
  @CreationTimestamp
  private Instant createdAt;
  
  @UpdateTimestamp
  private Instant updatedAt;
  
  private Instant deletedAt; // Soft delete for audit trail
  
  // Getters, setters, toString, equals/hashCode omitted for brevity
}
```

**Validation Rules**:
- `name`: Required, 1-255 characters
- `category`: Required, must be one of {DOGS, CATS, BIRDS, FISHES}
- `price`: Required, must be > 0, formatted as USD
- `availability`: Required, boolean flag (true = available for purchase)
- `description`: Optional, max 2000 characters
- `imageUrl`: Optional, max 500 characters, valid URL format
- `deletedAt`: NULL for active listings; set for soft-deleted entries

**Audit Trail**:
- `createdAt`: Immutable timestamp of creation
- `updatedAt`: Updated whenever entity changes
- `deletedAt`: Set when soft-deleted; used to exclude from listing queries

---

### 2. PetCategory (Enum)

Represents the supported pet categories in the Petstore catalog.

**Definition**:
```java
public enum PetCategory {
  DOGS("Dogs"),
  CATS("Cats"),
  BIRDS("Birds"),
  FISHES("Fishes");
  
  private final String displayName;
  
  PetCategory(String displayName) {
    this.displayName = displayName;
  }
  
  public String getDisplayName() {
    return displayName;
  }
  
  public static PetCategory fromString(String value) {
    return PetCategory.valueOf(value.toUpperCase());
  }
}
```

**Valid Values**:
- DOGS → "Dogs"
- CATS → "Cats"
- BIRDS → "Birds"
- FISHES → "Fishes"

**Validation**:
- Only these four values are accepted
- Case-insensitive when parsing from API requests
- Invalid category triggers HTTP 400 Bad Request

---

### 3. ListingFilterState (Frontend DTO)

Represents active filter criteria selected by the shopper.

**Definition** (React/TypeScript):
```typescript
interface ListingFilterState {
  // Category filter
  selectedCategories: PetCategory[];  // Empty array = no filter (show all)
  
  // Price range filter
  priceRange: {
    min: number;   // Minimum price in dollars (0 = no lower bound)
    max: number;   // Maximum price in dollars (Infinity = no upper bound)
  };
  
  // Availability filter
  includeUnavailable: boolean;  // true = show unavailable items; false = show only available
  
  // Pagination
  page: number;      // 0-indexed page number
  limit: number;     // Items per page (default 20, max 100)
  
  // Sorting
  sortBy: SortField; // "price" | "createdAt" | "popularity"
  sortOrder: "asc" | "desc";
}

type SortField = "price" | "createdAt" | "popularity";
type PetCategory = "DOGS" | "CATS" | "BIRDS" | "FISHES";
```

**Default State**:
```typescript
{
  selectedCategories: [],
  priceRange: { min: 0, max: Infinity },
  includeUnavailable: false,
  page: 0,
  limit: 20,
  sortBy: "price",
  sortOrder: "asc"
}
```

**Validation Rules**:
- `selectedCategories`: Max 4 items (one per category)
- `priceRange.min`: Must be >= 0
- `priceRange.max`: Must be >= min
- `page`: Must be >= 0
- `limit`: Must be between 1 and 100 (default 20)
- `sortBy`: One of {price, createdAt, popularity}
- `sortOrder`: One of {asc, desc}

---

### 4. ListingSortPreference (Frontend UI State)

Represents the shopper's sort order preference.

**Definition** (React/TypeScript):
```typescript
enum ListingSortPreference {
  PRICE_LOW_TO_HIGH = { label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  PRICE_HIGH_TO_LOW = { label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  NEWEST_FIRST = { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
}

interface SortOption {
  label: string;        // Display text for dropdown
  sortBy: string;       // API field name
  sortOrder: "asc" | "desc";
}
```

**UI Mapping** (MUI Select component):
```typescript
const sortOptions: SortOption[] = [
  { label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
];
```

---

### 5. PetListingSummary (API Response DTO)

Represents the shopper-facing view of a listing (contract response).

**Definition** (Backend):
```java
public class PetListingSummary {
  private Long id;
  private String name;
  private String category;
  private BigDecimal price;
  private Boolean availability;
  private String description;
  private String imageUrl;
  private Instant createdAt;
  
  // Constructor, getters, setters omitted
}
```

**JSON Serialization** (API Response):
```json
{
  "id": 1,
  "name": "Golden Retriever Puppy",
  "category": "DOGS",
  "price": 75.99,
  "availability": true,
  "description": "Friendly and energetic 3-month-old puppy",
  "imageUrl": "https://images.petstore.com/golden-1.jpg",
  "createdAt": "2026-04-28T10:30:00Z"
}
```

**Frontend TypeScript Definition**:
```typescript
interface PetListingSummary {
  id: number;
  name: string;
  category: "DOGS" | "CATS" | "BIRDS" | "FISHES";
  price: number;
  availability: boolean;
  description: string;
  imageUrl: string;
  createdAt: string; // ISO 8601 timestamp
}
```

**Validation**:
- All fields required (non-null)
- `id`: Unique identifier from database
- `price`: Always positive, formatted to 2 decimal places
- `availability`: True if purchasable now, false if out of stock or delisted
- `imageUrl`: Must be valid HTTPS URL
- `createdAt`: ISO 8601 format

---

## Data Relationships

### Entity Graph

```
PetListing (1..N)
├── id: Primary Key
├── category: Foreign reference to PetCategory enum
├── price: Indexed for range filtering
├── availability: Indexed for availability filtering
└── createdAt: Indexed for sort operations (newest first)
```

**No direct foreign keys initially**. Future relationships:
- `Supplier` (many listings per supplier) — Phase 2
- `Inventory` (track stock separately) — Phase 2
- `Review` (shopper reviews per listing) — Phase 3

### Query Patterns (Backend)

**Pattern 1: Filter by Category and Price Range**
```sql
SELECT * FROM pet_listings
WHERE category = 'DOGS'
  AND price BETWEEN 20.00 AND 150.00
  AND availability = true
  AND deleted_at IS NULL
ORDER BY price ASC
LIMIT 20 OFFSET 0;
```

**Pattern 2: Clear Filters (All Available)**
```sql
SELECT * FROM pet_listings
WHERE availability = true
  AND deleted_at IS NULL
ORDER BY price ASC
LIMIT 20 OFFSET 0;
```

**Pattern 3: Count Results (Empty State Check)**
```sql
SELECT COUNT(*) FROM pet_listings
WHERE category = 'DOGS'
  AND price BETWEEN 20.00 AND 150.00
  AND availability = true
  AND deleted_at IS NULL;
```

---

## State Management (Frontend)

### React Query Cache Structure

```typescript
// Query key for listings with specific filters
const listingQueryKey = (filters: ListingFilterState) => [
  'listings',
  filters.selectedCategories,
  filters.priceRange.min,
  filters.priceRange.max,
  filters.includeUnavailable,
  filters.page,
  filters.limit,
  filters.sortBy,
  filters.sortOrder,
];

// Example: Query key for "DOGS, $20-$150, page 0"
['listings', ['DOGS'], 20, 150, false, 0, 20, 'price', 'asc']
```

### useListings Hook (React Custom Hook)

```typescript
interface UseListingsOptions {
  filters: ListingFilterState;
}

interface UseListingsResult {
  data: {
    items: PetListingSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useListings(options: UseListingsOptions): UseListingsResult {
  const { filters } = options;
  const queryKey = listingQueryKey(filters);
  
  const query = useQuery({
    queryKey,
    queryFn: () => fetchListings(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

---

## Validation Rules Summary

| Field | Entity | Rules |
|-------|--------|-------|
| id | PetListing | Auto-generated, unique, immutable |
| name | PetListing | Required, 1-255 chars, non-blank |
| category | PetListing | Required, enum {DOGS, CATS, BIRDS, FISHES} |
| price | PetListing | Required, > 0, <= 999999.99, 2 decimals |
| availability | PetListing | Required, boolean |
| description | PetListing | Optional, <= 2000 chars |
| imageUrl | PetListing | Optional, valid HTTPS URL, <= 500 chars |
| createdAt | PetListing | Auto-set, immutable, ISO 8601 |
| updatedAt | PetListing | Auto-updated, ISO 8601 |
| deletedAt | PetListing | NULL (active) or ISO 8601 (deleted) |
| priceMin (filter) | ListingFilterState | >= 0, <= priceMax |
| priceMax (filter) | ListingFilterState | >= priceMin, finite |
| page (filter) | ListingFilterState | >= 0, integer |
| limit (filter) | ListingFilterState | 1-100, default 20 |
| sortBy | ListingFilterState | One of {price, createdAt, popularity} |
| sortOrder | ListingFilterState | "asc" or "desc" |

---

## Acceptance Criteria (Testing)

### Unit Tests (Backend)

- ✅ Validate PetListing creation with valid inputs
- ✅ Validate PetListing rejects invalid category
- ✅ Validate PetListing rejects negative or zero price
- ✅ Validate PetListing rejects name > 255 chars
- ✅ Validate soft delete sets deletedAt timestamp
- ✅ Validate deleted listings excluded from queries

### Integration Tests (Backend)

- ✅ Query listings by category returns correct results
- ✅ Query listings by price range filters correctly
- ✅ Query listings by availability excludes unavailable items
- ✅ Sort by price (asc/desc) returns correct order
- ✅ Sort by createdAt (desc) returns newest first
- ✅ Pagination: page 0, limit 20 returns first 20 items
- ✅ Pagination: offset calculation correct for page N
- ✅ Empty result set returns empty array (not null)

### Component Tests (Frontend)

- ✅ ListingCard renders all required fields (name, category, price, availability, image)
- ✅ ListingGrid renders multiple cards in grid layout
- ✅ FilterPanel updates filter state on category selection
- ✅ FilterPanel validates price range (min <= max)
- ✅ SortDropdown updates sort order
- ✅ EmptyState displayed when zero results
- ✅ ErrorState displayed on API failure

---

## Migration Path (Future)

If catalog grows beyond current scope:
- Add `Supplier` entity (one-to-many with PetListing)
- Add `Inventory` tracking (move availability to separate table)
- Add `Tags` for flexible categorization (many-to-many)
- Archive old listings to separate table for audit trail

---

**Status**: ✅ Ready for backend service implementation  
**Last Updated**: 2026-04-30
