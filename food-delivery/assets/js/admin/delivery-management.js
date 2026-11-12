/**
 * Karachi Eats - Admin Delivery Management Controller
 */
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { formatPKR, showToast } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();
  renderDeliveryAreasTable();
  setupAddAreaModal();
});

export function renderDeliveryAreasTable() {
  const tbody = document.getElementById('delivery-areas-tbody');
  if (!tbody) return;

  const areas = Storage.getAreas();
  tbody.innerHTML = areas.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${formatPKR(a.deliveryFee)}</td>
      <td>${formatPKR(a.minOrder)}</td>
      <td>${a.estimatedTime}</td>
      <td>
        <span class="badge ${a.active !== false ? 'badge-success' : 'badge-danger'}">
          ${a.active !== false ? 'Active' : 'Disabled'}
        </span>
      </td>
      <td>
        <button class="btn btn-xs btn-outline toggle-area-btn" data-id="${a.id}">
          ${a.active !== false ? 'Disable' : 'Enable'}
        </button>
        <button class="btn btn-xs btn-danger del-area-btn" data-id="${a.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.toggle-area-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const areas = Storage.getAreas();
      const area = areas.find(a => a.id === btn.dataset.id);
      if (area) {
        area.active = area.active === false ? true : false;
        Storage.saveAreas(areas);
        showToast(`${area.name} status updated`, "info");
        renderDeliveryAreasTable();
      }
    });
  });

  tbody.querySelectorAll('.del-area-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm("Delete this delivery zone?")) return;
      let areas = Storage.getAreas();
      areas = areas.filter(a => a.id !== btn.dataset.id);
      Storage.saveAreas(areas);
      showToast("Area deleted", "info");
      renderDeliveryAreasTable();
    });
  });
}

function setupAddAreaModal() {
  const addBtn = document.getElementById('open-add-area-btn');
  const modal = document.getElementById('area-modal');
  const form = document.getElementById('area-form');

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
      const areas = Storage.getAreas();
      const name = document.getElementById('area-name').value.trim();
      const newArea = {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: name,
        deliveryFee: parseInt(document.getElementById('area-fee').value) || 150,
        minOrder: parseInt(document.getElementById('area-min').value) || 500,
        estimatedTime: document.getElementById('area-time').value || "30-45 min",
        active: true
      };

      areas.push(newArea);
      Storage.saveAreas(areas);
      showToast("New delivery area added to Karachi!", "success");
      modal.style.display = 'none';
      renderDeliveryAreasTable();
    });
  }
}
