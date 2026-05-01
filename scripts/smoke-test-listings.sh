#!/bin/bash

# Smoke test script for Petstore API
# Validates that the listing endpoint is responding correctly after deployment

set -e

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
CONTEXT_PATH="/pastoral"
MAX_RETRIES=30
RETRY_DELAY=2

echo "🧪 Starting Petstore API smoke tests..."
echo "API Base URL: $API_BASE_URL"
echo ""

# Function to check health endpoint
check_health() {
    echo "✓ Checking health endpoint..."
    response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL$CONTEXT_PATH/actuator/health" 2>/dev/null || echo "")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        echo "  Status: UP (HTTP $http_code)"
        return 0
    else
        echo "  Status: DOWN (HTTP $http_code)"
        return 1
    fi
}

# Function to check listings endpoint
check_listings() {
    echo "✓ Checking /listings endpoint..."
    response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL$CONTEXT_PATH/listings?limit=5" 2>/dev/null || echo "")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        # Verify response structure
        if echo "$body" | grep -q '"status":"success"'; then
            items_count=$(echo "$body" | grep -o '"items"' | wc -l)
            echo "  Status: OK (HTTP $http_code)"
            echo "  Response structure: Valid"
            echo "  Sample items returned"
            return 0
        else
            echo "  Status: ERROR - Invalid response structure (HTTP $http_code)"
            return 1
        fi
    else
        echo "  Status: ERROR (HTTP $http_code)"
        return 1
    fi
}

# Function to retry with backoff
retry_with_backoff() {
    local counter=0
    local max=$MAX_RETRIES
    
    while [ $counter -lt $max ]; do
        if check_health; then
            return 0
        fi
        
        counter=$((counter + 1))
        if [ $counter -lt $max ]; then
            echo "  Retrying in ${RETRY_DELAY}s... (attempt $((counter + 1))/$max)"
            sleep $RETRY_DELAY
        fi
    done
    
    return 1
}

# Main execution
echo "🔄 Waiting for API to be ready..."
if retry_with_backoff; then
    echo ""
    echo "✅ Health check passed!"
    echo ""
    
    # Run functional tests
    if check_listings; then
        echo ""
        echo "✅ All smoke tests passed!"
        exit 0
    else
        echo ""
        echo "❌ Listings endpoint test failed"
        exit 1
    fi
else
    echo ""
    echo "❌ Health check failed after $MAX_RETRIES attempts"
    exit 1
fi
