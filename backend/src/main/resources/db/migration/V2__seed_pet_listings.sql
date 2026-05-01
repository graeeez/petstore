-- V2__seed_pet_listings.sql
-- Migration: Insert sample pet listings for testing

INSERT INTO pet_listings (name, category, price, availability, description, image_url, created_at, updated_at) VALUES
('Golden Retriever', 'DOGS', 899.99, true, 'Friendly and loyal golden retriever puppy. Great with families. Comes with first vaccinations.', 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww?w=500&h=190&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Siamese Kitten', 'CATS', 299.99, true, 'Beautiful blue-eyed Siamese kitten. Playful and affectionate. Litter trained.', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500&h=190&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Siamese Kitten', 'CATS', 299.99, true, 'Beautiful blue-eyed Siamese kitten. Playful and affectionate. Litter trained.', 'https://images.unsplash.com/photo-1669095658634-2a5d9fae6d64?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lhbWVzZXxlbnwwfHwwfHx8MA%3D%3D?w=500&h=190&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Amazon Parrot', 'BIRDS', 1299.99, true, 'Intelligent and colorful Amazon parrot. Long lifespan. Social and entertaining.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQYhoHblQZuzn4FA2HUtE8paXFldGXy6rOA&s', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Goldfish', 'FISHES', 19.99, true, 'Classic goldfish for beginners. Hardy and easy to care for. Perfect for aquariums.', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=190&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Labrador Mix', 'DOGS', 749.99, true, 'Energetic and friendly Labrador mix. Good for active families. Fully vaccinated.', 'https://images.unsplash.com/photo-1565313753908-7b1da784e4f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjBwdXBweXxlbnwwfHwwfHx8MA%3Dus?w=500&h=190&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

('Goldfish', 'FISHES', 19.99, true, 'Classic goldfish for beginners. Hardy and easy to care for. Perfect for aquariums.', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Labrador Mix', 'DOGS', 749.99, true, 'Energetic and friendly Labrador mix. Good for active families. Fully vaccinated.', 'https://images.unsplash.com/photo-1565313753908-7b1da784e4f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjBwdXBweXxlbnwwfHwwfHx8MA%3Dus?w=500', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
