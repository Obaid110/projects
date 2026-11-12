/**
 * Karachi Eats - Admin Restaurant CRUD Controller
 */
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { formatPKR, showToast } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();
  renderRestaurantsTable();
  setupAddRestaurantModal();
});

export function renderRestaurantsTable() {
  const tbody = document.getElementById('restaurants-tbody');
  if (!tbody) return;

  const restaurants = Storage.getRestaurants();
  tbody.innerHTML = restaurants.map(r => `
    <tr>
      <td><img src="${r.image}" class="table-thumb" alt="${r.name}" /></td>
      <td>
        <strong>${r.name}</strong><br>
        <small class="text-muted">${r.cuisine}</small>
      </td>
      <td>${r.areaName}</td>
      <td><i class="fa-solid fa-star text-warning" style="color: #F59E0B;"></i> ${r.rating}</td>
      <td>${formatPKR(r.deliveryFee)}</td>
      <td>${formatPKR(r.minOrder)}</td>
      <td>
        <span class="badge ${r.isOpen ? 'badge-success' : 'badge-danger'}">
          ${r.isOpen ? 'Open' : 'Closed'}
        </span>
      </td>
      <td>
        <button class="btn btn-xs btn-outline toggle-status-btn" data-id="${r.id}">${r.isOpen ? 'Close' : 'Open'}</button>
        <button class="btn btn-xs btn-danger delete-rest-btn" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const restaurants = Storage.getRestaurants();
      const rest = restaurants.find(r => r.id === btn.dataset.id);
      if (rest) {
        rest.isOpen = !rest.isOpen;
        Storage.saveRestaurants(restaurants);
        showToast(`${rest.name} is now ${rest.isOpen ? 'Open' : 'Closed'}`, "info");
        renderRestaurantsTable();
      }
    });
  });

  tbody.querySelectorAll('.delete-rest-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteRestaurant(btn.dataset.id));
  });
}

function deleteRestaurant(id) {
  if (!confirm("Are you sure you want to delete this restaurant and its menu?")) return;
  let restaurants = Storage.getRestaurants();
  restaurants = restaurants.filter(r => r.id !== id);
  Storage.saveRestaurants(restaurants);
  showToast("Restaurant deleted successfully", "success");
  renderRestaurantsTable();
}

function setupAddRestaurantModal() {
  const addBtn = document.getElementById('open-add-restaurant-btn');
  const modal = document.getElementById('restaurant-modal');
  const form = document.getElementById('restaurant-form');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      form.reset();
    });

    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const restaurants = Storage.getRestaurants();
      const areaSelect = document.getElementById('rest-area');
      const newRest = {
        id: `rest_${Date.now()}`,
        name: document.getElementById('rest-name').value,
        cuisine: document.getElementById('rest-cuisine').value,
        category: document.getElementById('rest-category').value,
        areaId: areaSelect.value,
        areaName: areaSelect.options[areaSelect.selectedIndex].text,
        phone: document.getElementById('rest-phone').value,
        rating: 4.5,
        reviewsCount: 1,
        deliveryTime: "30-45 min",
        deliveryFee: parseInt(document.getElementById('rest-fee').value) || 150,
        minOrder: parseInt(document.getElementById('rest-min').value) || 500,
        image: document.getElementById('rest-image').value || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(document.getElementById('rest-name').value)}&background=FF4722&color=fff`,
        isOpen: true,
        featured: false,
        popular: false
      };

      restaurants.unshift(newRest);
      Storage.saveRestaurants(restaurants);
      showToast("Restaurant added to Karachi Eats!", "success");
      modal.style.display = 'none';
      renderRestaurantsTable();
    });
  }
}
