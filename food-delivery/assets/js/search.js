/**
 * Karachi Eats - Multi-Facet Search & Filter Engine
 */
import { Storage } from './storage.js';

export function filterRestaurants(options = {}) {
  const allRestaurants = Storage.getRestaurants();
  const {
    keyword = "",
    category = "all",
    areaId = "all",
    maxPrice = null,
    minRating = 0,
    hasDiscount = false,
    sortBy = "recommended"
  } = options;

  let results = allRestaurants.filter(rest => {
    // Keyword match (restaurant name or cuisine or area)
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      const matchName = rest.name.toLowerCase().includes(q);
      const matchCuisine = rest.cuisine.toLowerCase().includes(q);
      const matchArea = rest.areaName.toLowerCase().includes(q);
      if (!matchName && !matchCuisine && !matchArea) return false;
    }

    // Category match
    if (category !== "all" && rest.category !== category) {
      return false;
    }

    // Karachi Area match
    if (areaId !== "all" && rest.areaId !== areaId) {
      return false;
    }

    // Rating filter
    if (minRating > 0 && rest.rating < minRating) {
      return false;
    }

    // Free delivery or discount filter
    if (hasDiscount && !rest.discount && rest.deliveryFee > 0) {
      return false;
    }

    // Max minimum order price filter
    if (maxPrice && rest.minOrder > maxPrice) {
      return false;
    }

    return true;
  });

  // Sorting
  switch (sortBy) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'delivery_time':
      results.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      break;
    case 'delivery_fee':
      results.sort((a, b) => a.deliveryFee - b.deliveryFee);
      break;
    case 'min_order':
      results.sort((a, b) => a.minOrder - b.minOrder);
      break;
    default:
      // Recommended / Popular
      results.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  return results;
}
