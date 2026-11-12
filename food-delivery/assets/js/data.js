/**
 * Karachi Eats - Comprehensive Restaurant & Menu Seed Data (200+ Sample Restaurants)
 */
import { APP_CONFIG } from './config.js';

const RESTAURANT_BRANDS = [
  { name: "Kolachi Restaurant", cuisine: "BBQ & Pakistani", category: "bbq", minPrice: 1500, rating: 4.8, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" },
  { name: "Student Biryani", cuisine: "Biryani & Pakistani", category: "biryani", minPrice: 450, rating: 4.5, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80" },
  { name: "Javed Nihari", cuisine: "Pakistani Karahi", category: "pakistani", minPrice: 650, rating: 4.9, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80" },
  { name: "Zahid Nihari", cuisine: "Pakistani Karahi", category: "pakistani", minPrice: 600, rating: 4.7, img: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
  { name: "Ginsoy Extreme Chinese", cuisine: "Chinese & Asian", category: "chinese", minPrice: 1100, rating: 4.6, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80" },
  { name: "Burger O'Clock", cuisine: "Burgers & Broast", category: "burgers", minPrice: 750, rating: 4.6, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80" },
  { name: "Broadway Pizza", cuisine: "Pizza & Italian", category: "pizza", minPrice: 999, rating: 4.4, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80" },
  { name: "Hot N Spicy", cuisine: "Fast Food & Rolls", category: "fastfood", minPrice: 350, rating: 4.5, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80" },
  { name: "Red Apple", cuisine: "Fast Food & Rolls", category: "fastfood", minPrice: 400, rating: 4.6, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80" },
  { name: "Al-Kabab", cuisine: "BBQ & Tikka", category: "bbq", minPrice: 850, rating: 4.7, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80" },
  { name: "BBQ Tonight", cuisine: "BBQ & Pakistani", category: "bbq", minPrice: 1200, rating: 4.8, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80" },
  { name: "Meerath Nawab Kabab", cuisine: "BBQ & Paratha", category: "bbq", minPrice: 500, rating: 4.6, img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80" },
  { name: "Lal Qila Restaurant", cuisine: "Pakistani & Mughal", category: "pakistani", minPrice: 1800, rating: 4.7, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80" },
  { name: "Kaybees Snacks", cuisine: "Fast Food & Broast", category: "burgers", minPrice: 650, rating: 4.5, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80" },
  { name: "Daily Dubai Restaurant", cuisine: "Arabic & Pakistani", category: "pakistani", minPrice: 900, rating: 4.4, img: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
  { name: "Tooso Restaurant", cuisine: "Pakistani Breakfast & Snacks", category: "pakistani", minPrice: 400, rating: 4.5, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80" },
  { name: "Bumzee's Burgers", cuisine: "Burgers & Shakes", category: "burgers", minPrice: 550, rating: 4.3, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80" },
  { name: "Yadgar Fish", cuisine: "Fish & Seafood", category: "seafood", minPrice: 800, rating: 4.6, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80" },
  { name: "Rehmat-e-Shereen", cuisine: "Desserts & Sweets", category: "desserts", minPrice: 350, rating: 4.8, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80" },
  { name: "Chai Wala", cuisine: "Chai & Paratha", category: "drinks", minPrice: 200, rating: 4.7, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80" }
];

const SUFFIXES = ["Express", "Original", "Kitchen", "Bistro", "Diner", "Corner", "Hub", "Grill", "Court", "House", "Special", "Delight"];

export function generateSeedRestaurants() {
  const restaurants = [];
  const areas = APP_CONFIG.karachiAreas;
  let idCounter = 1;

  areas.forEach((area, areaIdx) => {
    RESTAURANT_BRANDS.forEach((brand, brandIdx) => {
      if (restaurants.length >= 210) return;
      const suffix = SUFFIXES[(areaIdx + brandIdx) % SUFFIXES.length];
      const isFreeDelivery = (idCounter % 3 === 0);
      const discountPct = (idCounter % 4 === 0) ? 20 : (idCounter % 5 === 0) ? 15 : 0;
      const rating = +(brand.rating - ((idCounter % 5) * 0.1)).toFixed(1);

      restaurants.push({
        id: `rest_${idCounter}`,
        name: `${brand.name} (${suffix})`,
        slug: `${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${area.id}-${idCounter}`,
        cuisine: brand.cuisine,
        category: brand.category,
        areaId: area.id,
        areaName: area.name,
        address: `Shop #${10 + (idCounter % 40)}, Block ${1 + (idCounter % 15)}, ${area.name}, Karachi`,
        phone: `+92 21 3${4000000 + idCounter * 123}`,
        rating: Math.max(3.8, rating),
        reviewsCount: 120 + (idCounter * 7) % 600,
        deliveryTime: area.estimatedTime,
        deliveryFee: isFreeDelivery ? 0 : area.deliveryFee,
        minOrder: area.minOrder,
        discount: discountPct > 0 ? `${discountPct}% OFF` : null,
        discountPercent: discountPct,
        image: brand.img,
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=FF4722&color=fff&size=128`,
        featured: idCounter % 7 === 0,
        popular: idCounter % 5 === 0,
        isOpen: true,
        hours: "11:00 AM - 02:00 AM"
      });
      idCounter++;
    });
  });

  return restaurants;
}

export function generateSeedMenus(restaurants) {
  const menus = {};
  restaurants.forEach(rest => {
    menus[rest.id] = [
      {
        id: `${rest.id}_m1`,
        name: "Special Chicken Biryani (Double Plate)",
        category: "Biryani & Rice",
        price: 490,
        originalPrice: 550,
        description: "Fragrant basmati rice cooked with authentic Karachi spices, tender chicken, and spiced potato (Aloo).",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        isPopular: true,
        inStock: true
      },
      {
        id: `${rest.id}_m2`,
        name: "Beef Boti Paratha Roll",
        category: "Fast Food & Rolls",
        price: 360,
        originalPrice: 400,
        description: "Charcoal grilled juicy beef boti wrapped in crispy pan-fried paratha with fresh onions and green chutney.",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80",
        isPopular: true,
        inStock: true
      },
      {
        id: `${rest.id}_m3`,
        name: "Chicken Shinwari White Karahi (Half)",
        category: "Pakistani Karahi",
        price: 1150,
        originalPrice: 1250,
        description: "Cooked in butter with green chilies, yogurt, and crushed black pepper in traditional wok.",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80",
        isPopular: false,
        inStock: true
      },
      {
        id: `${rest.id}_m4`,
        name: "Karachi Crispy Broast (Quarter)",
        category: "Burgers & Broast",
        price: 520,
        originalPrice: 580,
        description: "Golden fried crispy chicken served with garlic mayo sauce, dinner roll, and seasoned french fries.",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80",
        isPopular: true,
        inStock: true
      },
      {
        id: `${rest.id}_m5`,
        name: "Chicken Malai Boti (8 Pcs)",
        category: "BBQ & Tikka",
        price: 680,
        originalPrice: 750,
        description: "Boneless chicken marinated in rich clotted cream, green chilies, and light spices skewered over coal.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80",
        isPopular: true,
        inStock: true
      },
      {
        id: `${rest.id}_m6`,
        name: "Karak Dudh Patti Chai",
        category: "Chai & Drinks",
        price: 120,
        originalPrice: 140,
        description: "Pure milk slow-boiled with premium tea leaves, cardamom pods, and saffron touch.",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
        isPopular: false,
        inStock: true
      },
      {
        id: `${rest.id}_m7`,
        name: "Gulab Jamun with Rabri (2 Pcs)",
        category: "Desserts & Sweets",
        price: 250,
        originalPrice: 280,
        description: "Warm soft khoya dumplings soaked in fragrant sugar syrup served with thick chilled rabri.",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        isPopular: false,
        inStock: true
      }
    ];
  });
  return menus;
}

export const SEED_OFFERS = [
  { id: "off_1", code: "KARACHI50", title: "Flat 50% Welcome Discount", discountPercent: 50, maxDiscount: 500, minSpend: 1000, expiresAt: "2026-12-31", description: "Get 50% discount on your first order across all restaurants in Karachi." },
  { id: "off_2", code: "JOHARDEAL", title: "Gulistan-e-Johar Free Delivery", discountPercent: 100, isFreeDelivery: true, minSpend: 800, expiresAt: "2026-11-30", description: "Enjoy zero delivery fees on orders above Rs. 800 in Johar area." },
  { id: "off_3", code: "BIRYANI20", title: "Biryani Fest - Flat 20% OFF", discountPercent: 20, maxDiscount: 400, minSpend: 600, expiresAt: "2026-12-15", description: "Special weekend discount on all Biryani & Rice category meals." },
  { id: "off_4", code: "DHAWEEKEND", title: "DHA & Clifton Gourmet 15% OFF", discountPercent: 15, maxDiscount: 1000, minSpend: 2000, expiresAt: "2026-12-31", description: "Exclusive fine-dining promotion for Defence and Clifton residents." }
];

export const SEED_ORDERS = [
  {
    id: "KE-91823",
    createdAt: "2026-11-12T20:30:00Z",
    restaurantId: "rest_1",
    restaurantName: "Kolachi Restaurant (Express)",
    customer: {
      name: "Hamza Tariq",
      phone: "+92 321 9876543",
      email: "hamza@example.com",
      area: "DHA (Defence)",
      address: "House 42/B, Khayaban-e-Shamsheer, Phase 5, DHA, Karachi",
      mapLink: "https://maps.google.com/?q=24.8138,67.0345",
      notes: "Please deliver at the back gate. Call upon arrival."
    },
    items: [
      { id: "rest_1_m5", name: "Chicken Malai Boti (8 Pcs)", price: 680, quantity: 2 },
      { id: "rest_1_m1", name: "Special Chicken Biryani", price: 490, quantity: 1 }
    ],
    subtotal: 1850,
    deliveryFee: 200,
    discount: 200,
    tax: 92,
    total: 1942,
    paymentMethod: "Cash on Delivery",
    status: "Delivered"
  },
  {
    id: "KE-91824",
    createdAt: "2026-11-13T00:15:00Z",
    restaurantId: "rest_2",
    restaurantName: "Student Biryani (Original)",
    customer: {
      name: "Ayesha Siddiqui",
      phone: "+92 300 1122334",
      email: "ayesha.s@example.com",
      area: "Gulshan-e-Iqbal",
      address: "Flat 402, Al-Razi Heights, Block 13-D, Gulshan, Karachi",
      mapLink: "",
      notes: "Extra raita and salad please."
    },
    items: [
      { id: "rest_2_m1", name: "Special Chicken Biryani (Double Plate)", price: 490, quantity: 3 }
    ],
    subtotal: 1470,
    deliveryFee: 120,
    discount: 0,
    tax: 73,
    total: 1663,
    paymentMethod: "Online Payment (JazzCash)",
    status: "Preparing"
  }
];
