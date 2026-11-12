/**
 * Karachi Eats - Core Configuration
 */
export const APP_CONFIG = {
  appName: "Karachi Eats",
  tagline: "Taste the Soul of Karachi",
  currency: "PKR",
  currencySymbol: "Rs.",
  businessWhatsApp: "923001234567", // Configurable Pakistani business WhatsApp number
  supportPhone: "+92 21 34567890",
  supportEmail: "orders@karachieats.pk",
  defaultDeliveryFee: 150,
  freeDeliveryThreshold: 2500,
  taxRate: 0.05, // 5% Sindh Sales Tax on food services
  storageKeys: {
    RESTAURANTS: "ke_restaurants_v1",
    MENUS: "ke_menus_v1",
    ORDERS: "ke_orders_v1",
    CART: "ke_cart_v1",
    AREAS: "ke_areas_v1",
    OFFERS: "ke_offers_v1",
    AUTH_USER: "ke_auth_user_v1",
    SETTINGS: "ke_settings_v1",
    ACTIVE_LOCATION: "ke_active_location_v1"
  },
  karachiAreas: [
    { id: "gulshan", name: "Gulshan-e-Iqbal", deliveryFee: 120, minOrder: 500, estimatedTime: "30-40 min", active: true },
    { id: "johar", name: "Gulistan-e-Johar", deliveryFee: 140, minOrder: 500, estimatedTime: "35-45 min", active: true },
    { id: "dha", name: "DHA (Defence)", deliveryFee: 200, minOrder: 1000, estimatedTime: "25-35 min", active: true },
    { id: "clifton", name: "Clifton", deliveryFee: 180, minOrder: 800, estimatedTime: "25-35 min", active: true },
    { id: "north_nazimabad", name: "North Nazimabad", deliveryFee: 150, minOrder: 500, estimatedTime: "30-40 min", active: true },
    { id: "pechs", name: "PECHS", deliveryFee: 130, minOrder: 600, estimatedTime: "25-35 min", active: true },
    { id: "bahadurabad", name: "Bahadurabad", deliveryFee: 120, minOrder: 500, estimatedTime: "20-30 min", active: true },
    { id: "saddar", name: "Saddar", deliveryFee: 140, minOrder: 500, estimatedTime: "30-40 min", active: true },
    { id: "fb_area", name: "Federal B Area", deliveryFee: 140, minOrder: 500, estimatedTime: "30-45 min", active: true },
    { id: "malir", name: "Malir Cantonment", deliveryFee: 220, minOrder: 1000, estimatedTime: "40-50 min", active: true },
    { id: "korangi", name: "Korangi", deliveryFee: 190, minOrder: 700, estimatedTime: "40-55 min", active: true },
    { id: "nazimabad", name: "Nazimabad", deliveryFee: 140, minOrder: 500, estimatedTime: "30-40 min", active: true },
    { id: "shah_faisal", name: "Shah Faisal Colony", deliveryFee: 160, minOrder: 600, estimatedTime: "35-45 min", active: true },
    { id: "buffer_zone", name: "Buffer Zone", deliveryFee: 160, minOrder: 500, estimatedTime: "35-50 min", active: true }
  ],
  categories: [
    { id: "biryani", name: "Biryani & Rice", icon: "fa-bowl-rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80" },
    { id: "bbq", name: "BBQ & Tikka", icon: "fa-fire-burner", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80" },
    { id: "pakistani", name: "Pakistani Karahi", icon: "fa-utensils", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80" },
    { id: "burgers", name: "Burgers & Broast", icon: "fa-burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80" },
    { id: "pizza", name: "Pizza & Italian", icon: "fa-pizza-slice", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80" },
    { id: "fastfood", name: "Fast Food & Rolls", icon: "fa-hotdog", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80" },
    { id: "chinese", name: "Chinese & Asian", icon: "fa-bowl-food", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80" },
    { id: "seafood", name: "Fish & Seafood", icon: "fa-fish", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80" },
    { id: "sandwiches", name: "Sandwiches & Club", icon: "fa-bread-slice", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80" },
    { id: "desserts", name: "Desserts & Sweets", icon: "fa-ice-cream", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80" },
    { id: "drinks", name: "Chai & Drinks", icon: "fa-mug-hot", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80" },
    { id: "healthy", name: "Salads & Healthy", icon: "fa-leaf", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80" }
  ]
};
