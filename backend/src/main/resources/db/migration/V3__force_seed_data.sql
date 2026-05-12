-- V3__force_seed_data.sql
-- Migration: Ensure sample pet listings are present in production

INSERT INTO pet_listings (name, category, price, availability, description, image_url, created_at, updated_at)
SELECT 'Golden Retriever', 'DOGS', 899.99, true, 'Friendly and loyal golden retriever puppy. Great with families.', 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pet_listings WHERE name = 'Golden Retriever');

INSERT INTO pet_listings (name, category, price, availability, description, image_url, created_at, updated_at)
SELECT 'Siamese Kitten', 'CATS', 299.99, true, 'Beautiful blue-eyed Siamese kitten.', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pet_listings WHERE name = 'Siamese Kitten');

INSERT INTO pet_listings (name, category, price, availability, description, image_url, created_at, updated_at)
SELECT 'Amazon Parrot', 'BIRDS', 1299.99, true, 'Intelligent and colorful Amazon parrot.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQYhoHblQZuzn4FA2HUtE8paXFldGXy6rOA&s', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pet_listings WHERE name = 'Amazon Parrot');

INSERT INTO pet_listings (name, category, price, availability, description, image_url, created_at, updated_at)
SELECT 'Goldfish', 'FISHES', 19.99, true, 'Classic goldfish for beginners.', 'https://images.unsplash.com/photo-1574158622682-e40e69881006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pet_listings WHERE name = 'Goldfish');
