// Sample Travel Destinations Data
const destinations = [
    {
        id: 1,
        name: "Manali",
        emoji: "🏔️",
        image: "images/Manali.jpg",
        location: "mountains",
        season: ["summer", "winter"],
        type: ["adventure", "family"],
        budget: "budget",
        price: 15000,
        description: "Beautiful hill station in Himachal Pradesh with snow-capped mountains and adventure activities.",
        highlights: ["Trekking", "Paragliding", "Snow Sports", "Scenic Views"],
        hotels: [
            { name: "Mountain View Resort", price: 3000, rating: 4.5 },
            { name: "Budget Inn", price: 1500, rating: 4.0 },
            { name: "Luxury Retreat", price: 8000, rating: 4.8 }
        ]
    },
    {
        id: 2,
        name: "Goa",
        emoji: "🏖️",
        image: "images/Goa.jpg",
        location: "beach",
        season: ["winter", "summer"],
        type: ["family", "honeymoon"],
        budget: "mid",
        price: 35000,
        description: "Tropical paradise with beautiful beaches, water sports, and vibrant nightlife.",
        highlights: ["Beach Relaxation", "Water Sports", "Nightlife", "Portuguese Architecture"],
        hotels: [
            { name: "Beachfront Hotel", price: 4000, rating: 4.6 },
            { name: "Cozy Beach Hut", price: 2000, rating: 4.2 },
            { name: "5-Star Resort", price: 10000, rating: 4.9 }
        ]
    },
    {
        id: 3,
        name: "Jaipur",
        emoji: "🏰",
        image: "images/Jaipur.jpg",
        location: "city",
        season: ["winter", "summer"],
        type: ["cultural", "family"],
        budget: "budget",
        price: 12000,
        description: "The Pink City with magnificent forts, palaces, and rich Rajasthani culture.",
        highlights: ["City Palace", "Hawa Mahal", "Jantar Mantar", "Local Markets"],
        hotels: [
            { name: "Heritage Hotel", price: 2500, rating: 4.4 },
            { name: "Budget Stay", price: 1200, rating: 4.0 },
            { name: "Luxury Palace", price: 7000, rating: 4.7 }
        ]
    },
    {
        id: 4,
        name: "Darjeeling",
        emoji: "🍵",
        image: "images/Darjeeling.jpg",
        location: "mountains",
        season: ["summer", "monsoon"],
        type: ["adventure", "cultural"],
        budget: "mid",
        price: 25000,
        description: "Tea gardens, toy train, and stunning views of Kanchenjunga mountain.",
        highlights: ["Tea Plantations", "Toy Train", "Mountain Views", "Local Culture"],
        hotels: [
            { name: "Tea Garden Resort", price: 3500, rating: 4.5 },
            { name: "Budget Lodge", price: 1800, rating: 4.1 },
            { name: "Premium Stay", price: 6500, rating: 4.8 }
        ]
    },
    {
        id: 5,
        name: "Jaisalmer",
        emoji: "🏜️",
        image: "images/Jaisalmer.jpg",
        location: "desert",
        season: ["winter", "summer"],
        type: ["adventure", "cultural"],
        budget: "budget",
        price: 18000,
        description: "Golden city with desert safaris, sand dunes, and ancient forts.",
        highlights: ["Desert Safari", "Jaisalmer Fort", "Sand Dunes", "Camel Rides"],
        hotels: [
            { name: "Desert Camp", price: 2000, rating: 4.3 },
            { name: "Budget Hostel", price: 1000, rating: 3.9 },
            { name: "Luxury Camp", price: 5000, rating: 4.6 }
        ]
    },
    {
        id: 6,
        name: "Kerala Backwaters",
        emoji: "🚤",
        image: "images/Kerala.jpg",
        location: "beach",
        season: ["monsoon", "winter"],
        type: ["honeymoon", "family"],
        budget: "luxury",
        price: 85000,
        description: "Serene backwaters with houseboat cruises and lush green landscapes.",
        highlights: ["Houseboat Cruise", "Backwater Views", "Ayurveda Spa", "Local Cuisine"],
        hotels: [
            { name: "Luxury Houseboat", price: 15000, rating: 4.9 },
            { name: "Mid-range Resort", price: 5000, rating: 4.5 },
            { name: "Budget Homestay", price: 2500, rating: 4.2 }
        ]
    },
    {
        id: 7,
        name: "Shimla",
        emoji: "❄️",
        image: "images/Shimla.jpg",
        location: "mountains",
        season: ["winter", "summer"],
        type: ["family", "adventure"],
        budget: "mid",
        price: 28000,
        description: "Hill station with colonial architecture, snow, and scenic trekking trails.",
        highlights: ["Snow Activities", "Mall Road", "Trekking", "Colonial Buildings"],
        hotels: [
            { name: "Heritage Hotel", price: 3500, rating: 4.5 },
            { name: "Budget Inn", price: 1500, rating: 4.0 },
            { name: "Luxury Resort", price: 7500, rating: 4.8 }
        ]
    },
    {
        id: 8,
        name: "Udaipur",
        emoji: "💎",
        image: "images/Udaipur.jpg",
        location: "city",
        season: ["winter", "summer"],
        type: ["honeymoon", "cultural"],
        budget: "luxury",
        price: 75000,
        description: "City of lakes with magnificent palaces and romantic ambiance.",
        highlights: ["City Palace", "Lake Pichola", "Romantic Cruises", "Local Crafts"],
        hotels: [
            { name: "Palace Hotel", price: 12000, rating: 4.9 },
            { name: "Mid-range Hotel", price: 4000, rating: 4.4 },
            { name: "Budget Hotel", price: 2000, rating: 4.1 }
        ]
    }
];

// Demo user for login
const demoUser = {
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
    phone: "9876543210"
};

// Admin credentials
const adminCredentials = {
    email: "admin@example.com",
    password: "admin123"
};
