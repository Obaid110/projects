/**
 * Karachi Eats - Admin Order Operations Controller
 */
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { formatPKR, showToast } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();
  renderOrdersTable();
  setupFilterHandlers();
});

export function renderOrdersTable(filterStatus = 'all', searchQuery = '') {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  let orders = Storage.getOrders();

  if (filterStatus !== 'all') {
    orders = orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(q) || 
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q)
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 24px;">No customer orders found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>${new Date(o.createdAt).toLocaleString('en-PK')}</td>
      <td>${o.customer.name}<br><small class="text-muted">${o.customer.phone} • ${o.customer.area}</small></td>
      <td>${o.restaurantName}</td>
      <td><strong>${formatPKR(o.total)}</strong><br><small class="text-muted">${o.paymentMethod}</small></td>
      <td>
        <select class="status-dropdown form-select-sm" data-id="${o.id}">
          <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
          <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn btn-xs btn-primary view-order-btn" data-id="${o.id}">View Details</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.status-dropdown').forEach(select => {
    select.addEventListener('change', (e) => {
      updateOrderStatus(select.dataset.id, e.target.value);
    });
  });

  tbody.querySelectorAll('.view-order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showOrderDetailModal(btn.dataset.id);
    });
  });
}

function updateOrderStatus(orderId, newStatus) {
  const orders = Storage.getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    Storage.saveOrders(orders);
    showToast(`Order #${orderId} marked as ${newStatus}`, "success");
  }
}

function showOrderDetailModal(orderId) {
  const orders = Storage.getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  let modal = document.getElementById('order-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'order-detail-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3>Order Details #${order.id}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body" style="line-height: 1.8;">
        <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
        <p><strong>Area:</strong> ${order.customer.area}</p>
        <p><strong>Address:</strong> ${order.customer.address}</p>
        ${order.customer.mapLink ? `<p><strong>Map Link:</strong> <a href="${order.customer.mapLink}" target="_blank" style="color: var(--primary);">Open Location</a></p>` : ''}
        ${order.customer.notes ? `<p><strong>Rider Instructions:</strong> <em>${order.customer.notes}</em></p>` : ''}
        <hr style="margin: 12px 0; border: none; border-top: 1px solid var(--border-color);">
        <h4>Items Ordered (${order.restaurantName})</h4>
        <ul style="padding-left: 20px; margin: 10px 0;">
          ${order.items.map(i => `<li>${i.name} x ${i.quantity} — ${formatPKR(i.price * i.quantity)}</li>`).join('')}
        </ul>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid var(--border-color);">
        <p>Subtotal: ${formatPKR(order.subtotal)}</p>
        <p>Delivery Charges: ${formatPKR(order.deliveryFee)}</p>
        <p>Sindh Sales Tax (5%): ${formatPKR(order.tax)}</p>
        ${order.discount > 0 ? `<p class="text-success">Discount: -${formatPKR(order.discount)}</p>` : ''}
        <h3 style="color: var(--primary); margin-top: 8px;">Total Payable: ${formatPKR(order.total)} (${order.paymentMethod})</h3>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.querySelector('.modal-close').addEventListener('click', () => modal.style.display = 'none');
}

function setupFilterHandlers() {
  const statusFilter = document.getElementById('order-status-filter');
  const searchInput = document.getElementById('order-search-input');

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      renderOrdersTable(statusFilter.value, searchInput?.value || '');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderOrdersTable(statusFilter?.value || 'all', searchInput.value);
    });
  }
}
