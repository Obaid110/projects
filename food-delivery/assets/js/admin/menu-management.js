/**
 * Karachi Eats - Admin Menu Management Controller
 */
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { formatPKR, showToast } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();
  populateRestaurantFilter();
  renderMenusTable();
  setupAddMenuModal();
});

function populateRestaurantFilter() {
  const select = document.getElementById('menu-restaurant-filter');
  const modalRestSelect = document.getElementById('item-restaurant-select');
  if (!select) return;

  const restaurants = Storage.getRestaurants();
  const optionsHtml = restaurants.map(r => `<option value="${r.id}">${r.name} (${r.areaName})</option>`).join('');
  
  select.innerHTML = `<option value="all">All Partner Restaurants</option>` + optionsHtml;
  if (modalRestSelect) modalRestSelect.innerHTML = optionsHtml;

  select.addEventListener('change', () => {
    renderMenusTable(select.value);
  });
}

export function renderMenusTable(restaurantId = 'all') {
  const tbody = document.getElementById('menus-tbody');
  if (!tbody) return;

  const allMenus = Storage.getMenus();
  const restaurants = Storage.getRestaurants();
  let itemsToRender = [];

  if (restaurantId === 'all') {
    Object.keys(allMenus).forEach(rId => {
      const rest = restaurants.find(r => r.id === rId);
      const restName = rest ? rest.name : rId;
      allMenus[rId].forEach(item => {
        itemsToRender.push({ ...item, restaurantId: rId, restaurantName: restName });
      });
    });
  } else {
    const rest = restaurants.find(r => r.id === restaurantId);
    const restName = rest ? rest.name : restaurantId;
    const items = allMenus[restaurantId] || [];
    itemsToRender = items.map(item => ({ ...item, restaurantId, restaurantName: restName }));
  }

  if (itemsToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 20px;">No menu items found.</td></tr>`;
    return;
  }

  tbody.innerHTML = itemsToRender.slice(0, 50).map(item => `
    <tr>
      <td><img src="${item.image}" class="table-thumb" alt="${item.name}" /></td>
      <td>
        <strong>${item.name}</strong><br>
        <small class="text-muted">${item.description.slice(0, 45)}...</small>
      </td>
      <td>${item.restaurantName}</td>
      <td><span class="badge" style="background: var(--bg-subtle); color: var(--text-main);">${item.category}</span></td>
      <td><strong>${formatPKR(item.price)}</strong></td>
      <td>
        <span class="badge ${item.inStock ? 'badge-success' : 'badge-danger'}">
          ${item.inStock ? 'In Stock' : 'Unavailable'}
        </span>
      </td>
      <td>
        <button class="btn btn-xs btn-outline toggle-stock-btn" data-rest="${item.restaurantId}" data-id="${item.id}">Toggle Stock</button>
        <button class="btn btn-xs btn-danger del-item-btn" data-rest="${item.restaurantId}" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.toggle-stock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rId = btn.dataset.rest;
      const itemId = btn.dataset.id;
      const menus = Storage.getMenus();
      if (menus[rId]) {
        const item = menus[rId].find(i => i.id === itemId);
        if (item) {
          item.inStock = !item.inStock;
          Storage.saveMenus(menus);
          showToast(`${item.name} is now ${item.inStock ? 'In Stock' : 'Unavailable'}`, "info");
          renderMenusTable(document.getElementById('menu-restaurant-filter')?.value || 'all');
        }
      }
    });
  });

  tbody.querySelectorAll('.del-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm("Delete this food item from the menu?")) return;
      const rId = btn.dataset.rest;
      const itemId = btn.dataset.id;
      const menus = Storage.getMenus();
      if (menus[rId]) {
        menus[rId] = menus[rId].filter(i => i.id !== itemId);
        Storage.saveMenus(menus);
        showToast("Food item removed", "info");
        renderMenusTable(document.getElementById('menu-restaurant-filter')?.value || 'all');
      }
    });
  });
}

function setupAddMenuModal() {
  const addBtn = document.getElementById('open-add-menu-btn');
  const modal = document.getElementById('menu-modal');
  const form = document.getElementById('menu-form');

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
      const rId = document.getElementById('item-restaurant-select').value;
      const menus = Storage.getMenus();
      if (!menus[rId]) menus[rId] = [];

      const newItem = {
        id: `${rId}_m_${Date.now()}`,
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        price: parseInt(document.getElementById('item-price').value),
        description: document.getElementById('item-desc').value,
        image: document.getElementById('item-image').value || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        isPopular: document.getElementById('item-popular').checked,
        inStock: true
      };

      menus[rId].unshift(newItem);
      Storage.saveMenus(menus);
      showToast("Dish added to restaurant menu!", "success");
      modal.style.display = 'none';
      renderMenusTable(document.getElementById('menu-restaurant-filter')?.value || 'all');
    });
  }
}
