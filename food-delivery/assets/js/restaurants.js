/**
 * Karachi Eats - Restaurants & Menu Controller (Mobile App-Like Experience)
 */
import { Storage } from './storage.js';
import { Cart } from './cart.js';
import { formatPKR, getQueryParam } from './utils.js';
import { filterRestaurants } from './search.js';

let currentPage = 1;
const ITEMS_PER_PAGE = 24;
let currentFilters = {
  keyword: "",
  category: "all",
  areaId: "all",
  sortBy: "recommended",
  hasDiscount: false,
  minRating: 0
};

export function initRestaurantsPage() {
  const catParam = getQueryParam('category');
  const areaParam = getQueryParam('area');
  const searchParam = getQueryParam('search');

  if (catParam) currentFilters.category = catParam;
  if (areaParam) currentFilters.areaId = areaParam;
  if (searchParam) currentFilters.keyword = searchParam;

  setupFilterListeners();
  setupMobileFilterPills();
  renderFilteredRestaurants();

  window.onLocationChanged = (selectedLocation) => {
    currentFilters.areaId = selectedLocation.id;
    const areaSelect = document.getElementById('filter-area');
    if (areaSelect) areaSelect.value = selectedLocation.id;
    currentPage = 1;
    renderFilteredRestaurants();
  };
}

function setupFilterListeners() {
  const searchInput = document.getElementById('restaurant-search-input');
  const categorySelect = document.getElementById('filter-category');
  const areaSelect = document.getElementById('filter-area');
  const sortSelect = document.getElementById('filter-sort');
  const discountCheckbox = document.getElementById('filter-discount');
  const loadMoreBtn = document.getElementById('load-more-btn');

  if (searchInput) {
    if (currentFilters.keyword) searchInput.value = currentFilters.keyword;
    searchInput.addEventListener('input', (e) => {
      currentFilters.keyword = e.target.value;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  if (categorySelect) {
    if (currentFilters.category) categorySelect.value = currentFilters.category;
    categorySelect.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  if (areaSelect) {
    if (currentFilters.areaId) areaSelect.value = currentFilters.areaId;
    areaSelect.addEventListener('change', (e) => {
      currentFilters.areaId = e.target.value;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  if (discountCheckbox) {
    discountCheckbox.addEventListener('change', (e) => {
      currentFilters.hasDiscount = e.target.checked;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderFilteredRestaurants(true);
    });
  }
}

function setupMobileFilterPills() {
  const toggleBtn = document.getElementById('toggle-filter-btn');
  const closeBtn = document.getElementById('close-filter-btn');
  const applyBtn = document.getElementById('apply-mobile-filter-btn');
  const sidebar = document.querySelector('.filter-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeSidebar = () => {
    sidebar?.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      closeSidebar();
      renderFilteredRestaurants();
    });
  }

  // Quick filter pills
  const pillDeals = document.getElementById('pill-deals');
  if (pillDeals) {
    pillDeals.addEventListener('click', () => {
      currentFilters.hasDiscount = !currentFilters.hasDiscount;
      pillDeals.classList.toggle('active', currentFilters.hasDiscount);
      const discountCheckbox = document.getElementById('filter-discount');
      if (discountCheckbox) discountCheckbox.checked = currentFilters.hasDiscount;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  const pillRating = document.getElementById('pill-top-rated');
  if (pillRating) {
    pillRating.addEventListener('click', () => {
      currentFilters.minRating = currentFilters.minRating > 0 ? 0 : 4.5;
      pillRating.classList.toggle('active', currentFilters.minRating > 0);
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }

  const pillFast = document.getElementById('pill-fast-delivery');
  if (pillFast) {
    pillFast.addEventListener('click', () => {
      currentFilters.sortBy = currentFilters.sortBy === 'delivery_time' ? 'recommended' : 'delivery_time';
      pillFast.classList.toggle('active', currentFilters.sortBy === 'delivery_time');
      const sortSelect = document.getElementById('filter-sort');
      if (sortSelect) sortSelect.value = currentFilters.sortBy;
      currentPage = 1;
      renderFilteredRestaurants();
    });
  }
}

export function renderFilteredRestaurants(append = false) {
  const container = document.getElementById('restaurants-grid');
  const countBadge = document.getElementById('results-count');
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (!container) return;

  const results = filterRestaurants(currentFilters);
  if (countBadge) countBadge.textContent = `${results.length} Restaurants in Karachi`;

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginated = results.slice(0, currentPage * ITEMS_PER_PAGE);

  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card col-span-full" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 3.5rem; color: var(--border-dark); margin-bottom: 16px;"></i>
        <h3 style="font-size: 1.35rem; margin-bottom: 8px;">No restaurants found matching your criteria</h3>
        <p class="text-muted" style="margin-bottom: 20px;">Try switching Karachi neighborhood or resetting your filters.</p>
        <button class="btn btn-primary" onclick="window.location.href='restaurants.html'"><i class="fa-solid fa-rotate-left"></i> Reset All Filters</button>
      </div>
    `;
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  const cardsHtml = paginated.map(renderRestaurantCard).join('');

  if (append) {
    container.insertAdjacentHTML('beforeend', cardsHtml);
  } else {
    container.innerHTML = cardsHtml;
  }

  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentPage < totalPages ? 'inline-block' : 'none';
  }
}

export function renderRestaurantCard(r) {
  return `
    <div class="restaurant-card">
      <div class="card-img-wrap">
        <img src="${r.image}" alt="${r.name}" loading="lazy" />
        ${r.discount ? `<span class="badge-discount"><i class="fa-solid fa-tag"></i> ${r.discount}</span>` : ''}
        ${r.deliveryFee === 0 ? `<span class="badge-free-del"><i class="fa-solid fa-motorcycle"></i> Free Delivery</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-header-row">
          <h3 class="restaurant-title">${r.name}</h3>
          <span class="rating-pill"><i class="fa-solid fa-star"></i> ${r.rating}</span>
        </div>
        <p class="cuisine-text"><i class="fa-solid fa-location-dot text-primary"></i> ${r.areaName} • ${r.cuisine}</p>
        <div class="delivery-meta">
          <span><i class="fa-regular fa-clock"></i> ${r.deliveryTime}</span>
          <span><i class="fa-solid fa-motorcycle"></i> ${r.deliveryFee === 0 ? 'Free' : formatPKR(r.deliveryFee)}</span>
          <span>Min: ${formatPKR(r.minOrder)}</span>
        </div>
        <a href="restaurant-details.html?id=${r.id}" class="btn btn-primary btn-block btn-view-menu">
          View Menu <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i>
        </a>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// Individual Restaurant Details Page
// --------------------------------------------------------------------------
export function initRestaurantDetailsPage() {
  const restId = getQueryParam('id') || 'rest_1';
  const allRestaurants = Storage.getRestaurants();
  const restaurant = allRestaurants.find(r => r.id === restId) || allRestaurants[0];
  const menus = Storage.getMenus(restaurant.id);

  renderRestaurantHeader(restaurant);
  renderRestaurantMenu(restaurant, menus);
}

function renderRestaurantHeader(r) {
  const headerElem = document.getElementById('restaurant-hero-section');
  if (!headerElem) return;

  headerElem.innerHTML = `
    <div class="restaurant-hero-banner" style="background-image: linear-gradient(rgba(17, 24, 39, 0.72), rgba(17, 24, 39, 0.88)), url('${r.image}')">
      <div class="container hero-content">
        <a href="restaurants.html" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Restaurants</a>
        <div class="hero-details-row">
          <img src="${r.logo}" class="restaurant-logo-circle" alt="${r.name}" />
          <div>
            <h1 class="hero-rest-name">${r.name}</h1>
            <p class="hero-rest-meta"><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${r.areaName}, Karachi • ${r.cuisine}</p>
            <div class="hero-stats-row">
              <span class="stat-badge"><i class="fa-solid fa-star" style="color: #F59E0B;"></i> ${r.rating} (${r.reviewsCount}+ ratings)</span>
              <span class="stat-badge"><i class="fa-regular fa-clock"></i> ${r.deliveryTime}</span>
              <span class="stat-badge"><i class="fa-solid fa-motorcycle"></i> ${r.deliveryFee === 0 ? 'Free Delivery' : formatPKR(r.deliveryFee)}</span>
              <span class="stat-badge"><i class="fa-solid fa-phone"></i> ${r.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRestaurantMenu(restaurant, items) {
  const navContainer = document.getElementById('menu-categories-nav');
  const menuContainer = document.getElementById('menu-items-grid');
  if (!menuContainer) return;

  const categories = [...new Set(items.map(i => i.category))];

  if (navContainer) {
    navContainer.innerHTML = categories.map((cat, idx) => `
      <a href="#cat-${idx}" class="category-nav-link ${idx === 0 ? 'active' : ''}">${cat}</a>
    `).join('');

    // Smooth category link scrolling
    navContainer.querySelectorAll('.category-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        navContainer.querySelectorAll('.category-nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  menuContainer.innerHTML = categories.map((cat, idx) => {
    const catItems = items.filter(i => i.category === cat);
    return `
      <section id="cat-${idx}" class="menu-category-section" style="margin-bottom: 36px;">
        <h2 class="category-heading" style="margin-bottom: 18px; font-size: 1.45rem;">${cat}</h2>
        <div class="food-cards-grid">
          ${catItems.map(item => `
            <div class="food-card">
              <div class="food-info" style="flex: 1;">
                ${item.isPopular ? '<span class="badge badge-warning" style="margin-bottom: 6px;"><i class="fa-solid fa-fire"></i> Popular</span>' : ''}
                <h4 class="food-name">${item.name}</h4>
                <p class="food-desc">${item.description}</p>
                <div class="food-price-row">
                  <strong class="current-price">${formatPKR(item.price)}</strong>
                  ${item.originalPrice ? `<span class="original-price">${formatPKR(item.originalPrice)}</span>` : ''}
                </div>
              </div>
              <div class="food-img-col">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
                <button class="btn btn-sm btn-primary btn-add-cart" data-id="${item.id}">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }).join('');

  menuContainer.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      const item = items.find(i => i.id === itemId);
      if (item) {
        Cart.addItem(restaurant, item);
      }
    });
  });
}
