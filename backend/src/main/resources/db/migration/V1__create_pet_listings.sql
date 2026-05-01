-- V1__create_pet_listings.sql
-- Migration: Create pet_listings table with all required columns and indexes

CREATE TABLE IF NOT EXISTS pet_listings (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT check_price_positive CHECK (price > 0),
    CONSTRAINT check_category_valid CHECK (category IN ('DOGS', 'CATS', 'BIRDS', 'FISHES'))
);

-- Create indexes for query performance
CREATE INDEX idx_pet_listings_category ON pet_listings(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_pet_listings_availability ON pet_listings(availability) WHERE deleted_at IS NULL;
CREATE INDEX idx_pet_listings_price ON pet_listings(price) WHERE deleted_at IS NULL;
CREATE INDEX idx_pet_listings_created_at ON pet_listings(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_pet_listings_deleted_at ON pet_listings(deleted_at);
CREATE INDEX idx_pet_listings_soft_delete_active ON pet_listings(id) WHERE deleted_at IS NULL;

-- Create composite index for common filter combinations
CREATE INDEX idx_pet_listings_category_availability ON pet_listings(category, availability) WHERE deleted_at IS NULL;
CREATE INDEX idx_pet_listings_price_availability ON pet_listings(price, availability) WHERE deleted_at IS NULL;

COMMENT ON TABLE pet_listings IS 'Pet listing catalog for e-commerce platform';
COMMENT ON COLUMN pet_listings.category IS 'Pet category: DOGS, CATS, BIRDS, FISHES';
COMMENT ON COLUMN pet_listings.availability IS 'Whether the pet is currently available for purchase';
COMMENT ON COLUMN pet_listings.deleted_at IS 'Soft delete timestamp; NULL means active listing';
