const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:8080/pastoral/listings';

const seedData = [
  {
    name: 'Golden Retriever',
    category: 'DOGS',
    price: 899.99,
    availability: true,
    description: 'Friendly and loyal golden retriever puppy. Great with families. Comes with first vaccinations.',
    imageUrl: 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww?w=500&h=190&fit=crop&q=80'
  },
  {
    name: 'Siamese Kitten',
    category: 'CATS',
    price: 299.99,
    availability: true,
    description: 'Beautiful blue-eyed Siamese kitten. Playful and affectionate. Litter trained.',
    imageUrl: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500&h=190&fit=crop&q=80'
  },
  {
    name: 'Amazon Parrot',
    category: 'BIRDS',
    price: 1299.99,
    availability: true,
    description: 'Intelligent and colorful Amazon parrot. Long lifespan. Social and entertaining.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQYhoHblQZuzn4FA2HUtE8paXFldGXy6rOA&s'
  },
  {
    name: 'Goldfish',
    category: 'FISHES',
    price: 19.99,
    availability: true,
    description: 'Classic goldfish for beginners. Hardy and easy to care for. Perfect for aquariums.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=190&fit=crop&q=80'
  },
  {
    name: 'Labrador Mix',
    category: 'DOGS',
    price: 749.99,
    availability: true,
    description: 'Energetic and friendly Labrador mix. Good for active families. Fully vaccinated.',
    imageUrl: 'https://images.unsplash.com/photo-1565313753908-7b1da784e4f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjBwdXBweXxlbnwwfHwwfHx8MA%3Dus?w=500&h=190&fit=crop&q=80'
  }
];

async function seed() {
  for (const item of seedData) {
    try {
      const response = await axios.post(API_URL, item);
      console.log(`Created: ${item.name}`);
    } catch (error) {
      console.error(`Failed to create ${item.name}: ${error.message}`);
    }
  }
}

seed();
