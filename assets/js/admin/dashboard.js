/**
 * Karachi Eats - Admin Dashboard Controller
 */
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { formatPKR } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();
  renderAdminMetrics();
  renderRecentOrders();
});

export function renderAdminMetrics() {
  const restaurants = Storage.getRestaurants();
  const orders = Storage.getOrders();
  const menus = Storage.getMenus();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  let totalMenuItems = 0;
  Object.values(menus).forEach(list => totalMenuItems += list.length);

  document.getElementById('metric-total-restaurants').textContent = restaurants.length;
  document.getElementById('metric-total-menus').textContent = totalMenuItems;
  document.getElementById('metric-total-orders').textContent = totalOrders;
  document.getElementById('metric-pending-orders').textContent = pendingOrders;
  document.getElementById('metric-completed-orders').textContent = completedOrders;
  document.getElementById('metric-total-revenue').textContent = formatPKR(totalRevenue);
}

export function renderRecentOrders() {
  const tableBody = document.getElementById('recent-orders-tbody');
  if (!tableBody) return;

  const orders = Storage.getOrders().slice(0, 8);
  if (orders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No orders recorded yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = orders.map(order => `
    <tr>
      <td><strong>#${order.id}</strong></td>
      <td>${order.customer.name}<br><small class="text-muted">${order.customer.area}</small></td>
      <td>${order.restaurantName}</td>
      <td>${order.items.length} items</td>
      <td><strong>${formatPKR(order.total)}</strong></td>
      <td><span class="status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span></td>
      <td>
        <a href="orders.html" class="btn btn-xs btn-outline">Manage</a>
      </td>
    </tr>
  `).join('');
}
