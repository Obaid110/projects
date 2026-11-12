/**
 * Karachi Eats - Customer Home Page Controller
 */
import { APP_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { initNavigation } from './navigation.js';
import { renderRestaurantCard } from './restaurants.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderCategoryChips();
  renderFeaturedRestaurants();
  renderTopRatedRestaurants();
  setupHeroSearch();
});

function renderCategoryChips() {
  const container = document.getElementById('categories-slider');
  if (!container) return;

  container.innerHTML = APP_CONFIG.categories.map(cat => `
    <a href="restaurants.html?category=${cat.id}" class="category-chip">
      <div class="category-img-box">
        <img src="${cat.image}" alt="${cat.name}" />
      </div>
      <span class="category-name">${cat.name}</span>
    </a>
  `).join('');
}

function renderFeaturedRestaurants() {
  const container = document.getElementById('featured-restaurants-grid');
  if (!container) return;

  const all = Storage.getRestaurants();
  const featured = all.filter(r => r.featured).slice(0, 8);
  container.innerHTML = featured.map(renderRestaurantCard).join('');
}

function renderTopRatedRestaurants() {
  const container = document.getElementById('top-rated-restaurants-grid');
  if (!container) return;

  const all = Storage.getRestaurants();
  const topRated = all.sort((a, b) => b.rating - a.rating).slice(0, 8);
  container.innerHTML = topRated.map(renderRestaurantCard).join('');
}

function setupHeroSearch() {
  const searchForm = document.getElementById('hero-search-form');
  const searchInput = document.getElementById('hero-search-input');
  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = `restaurants.html`;
    }
  });
}
