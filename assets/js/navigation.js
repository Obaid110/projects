/**
 * Karachi Eats - Header, Location Selector, Mobile Bottom Bar & Floating Cart Pill
 */
import { APP_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { Cart } from './cart.js';
import { Auth } from './auth.js';
import { formatPKR } from './utils.js';

export function initNavigation() {
  // Sync Cart Badge
  Cart.updateBadge();

  // Location selector initialization
  const locationSelector = document.getElementById('location-selector-btn');
  const activeLocation = Storage.get(APP_CONFIG.storageKeys.ACTIVE_LOCATION, { id: 'all', name: 'Karachi (All Areas)' });
  
  if (locationSelector) {
    const locNameElem = locationSelector.querySelector('.active-location-name');
    if (locNameElem) locNameElem.textContent = activeLocation.name;

    locationSelector.addEventListener('click', () => {
      openLocationModal();
    });
  }

  // Auth Status Bar
  const authNav = document.getElementById('auth-nav-container');
  if (authNav) {
    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      authNav.innerHTML = `
        <div class="user-profile-menu">
          <span class="user-badge"><i class="fa-solid fa-circle-user"></i> ${user.name}</span>
          ${user.role === 'admin' ? '<a href="admin/index.html" class="btn btn-sm btn-outline">Admin Panel</a>' : ''}
          <button id="logout-btn" class="btn btn-sm btn-ghost" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
        </div>
      `;
      document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());
    } else {
      authNav.innerHTML = `
        <a href="login.html" class="btn btn-sm btn-outline">Log In</a>
        <a href="register.html" class="btn btn-sm btn-primary">Sign Up</a>
      `;
    }
  }

  // Cart Drawer open/close listeners
  const cartTriggerBtns = document.querySelectorAll('.cart-drawer-trigger');
  cartTriggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  const cartCloseBtn = document.getElementById('close-cart-drawer');
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }

  // Render initial cart drawer content
  Cart.subscribe(() => {
    renderCartDrawer();
    updateFloatingCartPill();
  });
  renderCartDrawer();

  // Native Mobile App UI
  renderMobileBottomNav();
  renderFloatingCartPill();
  updateFloatingCartPill();
}

export function openLocationModal() {
  let modal = document.getElementById('location-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'location-modal';
    modal.className = 'modal-backdrop';
    
    const areas = APP_CONFIG.karachiAreas;
    const areasHtml = areas.map(a => `
      <button class="area-chip-btn" data-id="${a.id}" data-name="${a.name}">
        <i class="fa-solid fa-location-dot"></i>
        <div>
          <strong>${a.name}</strong>
          <small>Delivery: ${formatPKR(a.deliveryFee)} • ${a.estimatedTime}</small>
        </div>
      </button>
    `).join('');

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3><i class="fa-solid fa-map-location-dot" style="color: var(--primary);"></i> Select Your Karachi Location</h3>
          <button class="modal-close">&times;</button>
        </div>
        <p class="modal-subtitle">Choose your neighborhood to see delivery times and charges:</p>
        <div class="location-grid">
          <button class="area-chip-btn" data-id="all" data-name="All Karachi">
            <i class="fa-solid fa-city"></i>
            <div><strong>All Karachi</strong><small>Explore 200+ restaurants</small></div>
          </button>
          ${areasHtml}
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelectorAll('.area-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = { id: btn.dataset.id, name: btn.dataset.name };
        Storage.set(APP_CONFIG.storageKeys.ACTIVE_LOCATION, selected);
        const locElem = document.querySelector('.active-location-name');
        if (locElem) locElem.textContent = selected.name;
        modal.remove();
        if (window.onLocationChanged) window.onLocationChanged(selected);
      });
    });
  }
  modal.style.display = 'flex';
}

export function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

export function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

export function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-drawer-footer');
  if (!container || !footer) return;

  const cart = Cart.getCart();
  const totals = Cart.getTotals();

  if (cart.items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-bag-shopping empty-icon"></i>
        <h4>Your Karachi Eats cart is empty</h4>
        <p>Explore Biryani, Karahi, Burgers, and 200+ top eateries across Karachi!</p>
        <a href="restaurants.html" class="btn btn-primary" onclick="closeCartDrawer()">Browse Restaurants</a>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = `
    <div class="cart-restaurant-banner">
      <i class="fa-solid fa-store"></i> Ordering from: <strong>${cart.restaurantName}</strong>
    </div>
    <div class="cart-items-list">
      ${cart.items.map(item => `
        <div class="cart-item-row">
          <div class="item-info">
            <h5>${item.name}</h5>
            <span class="item-price">${formatPKR(item.price)} each</span>
          </div>
          <div class="qty-controller">
            <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
          </div>
          <div class="item-total">
            ${formatPKR(item.price * item.quantity)}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  footer.innerHTML = `
    <div class="cart-summary-lines">
      <div class="summary-line"><span>Subtotal</span><span>${formatPKR(totals.subtotal)}</span></div>
      <div class="summary-line"><span>Estimated Delivery</span><span>${formatPKR(totals.deliveryFee)}</span></div>
      ${totals.discount > 0 ? `<div class="summary-line text-success"><span>Discount</span><span>-${formatPKR(totals.discount)}</span></div>` : ''}
      <div class="summary-line grand-total"><span>Total</span><span>${formatPKR(totals.grandTotal)}</span></div>
    </div>
    <a href="checkout.html" class="btn btn-primary btn-block btn-checkout">
      Proceed to Checkout (${formatPKR(totals.grandTotal)})
    </a>
  `;

  container.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', () => Cart.updateQuantity(btn.dataset.id, -1));
  });
  container.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', () => Cart.updateQuantity(btn.dataset.id, 1));
  });
}

// --------------------------------------------------------------------------
// Mobile App Bottom Navigation Bar
// --------------------------------------------------------------------------
export function renderMobileBottomNav() {
  if (document.querySelector('.mobile-bottom-nav')) return;

  const currentPath = window.location.pathname.toLowerCase();
  const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
  const isRestaurants = currentPath.includes('restaurants.html') || currentPath.includes('restaurant-details.html');
  const isOffers = currentPath.includes('offers.html');
  const isCheckout = currentPath.includes('checkout.html');
  const isLoggedIn = Auth.isLoggedIn();

  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.innerHTML = `
    <a href="index.html" class="bottom-nav-item ${isHome ? 'active' : ''}">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </a>
    <a href="restaurants.html" class="bottom-nav-item ${isRestaurants ? 'active' : ''}">
      <i class="fa-solid fa-utensils"></i>
      <span>Explore</span>
    </a>
    <a href="offers.html" class="bottom-nav-item ${isOffers ? 'active' : ''}">
      <i class="fa-solid fa-percent"></i>
      <span>Offers</span>
    </a>
    <a href="#" class="bottom-nav-item bottom-nav-cart-trigger ${isCheckout ? 'active' : ''}">
      <div class="bottom-nav-icon-wrap">
        <i class="fa-solid fa-bag-shopping"></i>
        <span class="cart-count-badge" style="display: none;">0</span>
      </div>
      <span>Cart</span>
    </a>
    <a href="${isLoggedIn ? (Auth.isAdmin() ? 'admin/index.html' : 'index.html') : 'login.html'}" class="bottom-nav-item">
      <i class="fa-solid fa-user"></i>
      <span>${isLoggedIn ? 'Account' : 'Login'}</span>
    </a>
  `;

  document.body.appendChild(nav);

  nav.querySelector('.bottom-nav-cart-trigger')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  });
}

// --------------------------------------------------------------------------
// Floating Mobile Cart Pill
// --------------------------------------------------------------------------
export function renderFloatingCartPill() {
  if (document.querySelector('.floating-cart-pill')) return;

  const pill = document.createElement('div');
  pill.className = 'floating-cart-pill';
  pill.id = 'floating-cart-pill';
  pill.style.display = 'none';

  pill.innerHTML = `
    <div class="floating-cart-left">
      <span class="floating-cart-badge" id="pill-cart-count">0 items</span>
      <span class="floating-cart-total" id="pill-cart-total">Rs. 0</span>
    </div>
    <div class="floating-cart-right">
      <span>View Cart</span>
      <i class="fa-solid fa-arrow-right"></i>
    </div>
  `;

  pill.addEventListener('click', openCartDrawer);
  document.body.appendChild(pill);
}

export function updateFloatingCartPill() {
  const pill = document.getElementById('floating-cart-pill');
  if (!pill) return;

  // Don't show pill on checkout or order success pages
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes('checkout.html') || currentPath.includes('order-success.html')) {
    pill.style.display = 'none';
    return;
  }

  const totals = Cart.getTotals();
  if (totals.itemCount > 0) {
    document.getElementById('pill-cart-count').textContent = `${totals.itemCount} item${totals.itemCount > 1 ? 's' : ''}`;
    document.getElementById('pill-cart-total').textContent = formatPKR(totals.grandTotal);
    pill.style.display = 'flex';
  } else {
    pill.style.display = 'none';
  }
}
