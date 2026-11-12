/**
 * Karachi Eats - Checkout & Order Submission Controller
 */
import { APP_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { Cart } from './cart.js';
import { formatPKR, generateOrderId, showToast } from './utils.js';

export function initCheckoutPage() {
  const cart = Cart.getCart();
  if (cart.items.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    window.location.href = "restaurants.html";
    return;
  }

  populateKarachiAreas();
  renderOrderSummary();

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleOrderSubmit);
  }

  const areaSelect = document.getElementById('checkout-area');
  if (areaSelect) {
    areaSelect.addEventListener('change', () => {
      renderOrderSummary();
    });
  }

  const couponBtn = document.getElementById('apply-coupon-btn');
  if (couponBtn) {
    couponBtn.addEventListener('click', handleCouponApply);
  }
}

function populateKarachiAreas() {
  const areaSelect = document.getElementById('checkout-area');
  if (!areaSelect) return;

  const areas = APP_CONFIG.karachiAreas;
  areaSelect.innerHTML = `
    <option value="">Select Karachi Delivery Area *</option>
    ${areas.map(a => `<option value="${a.name}" data-fee="${a.deliveryFee}">${a.name} (Fee: ${formatPKR(a.deliveryFee)})</option>`).join('')}
  `;
}

function getSelectedDeliveryFee() {
  const areaSelect = document.getElementById('checkout-area');
  if (!areaSelect || !areaSelect.value) return APP_CONFIG.defaultDeliveryFee;
  const opt = areaSelect.options[areaSelect.selectedIndex];
  return parseInt(opt.dataset.fee) || APP_CONFIG.defaultDeliveryFee;
}

function renderOrderSummary() {
  const container = document.getElementById('checkout-summary-container');
  if (!container) return;

  const cart = Cart.getCart();
  const deliveryFee = getSelectedDeliveryFee();
  const totals = Cart.getTotals(deliveryFee);

  container.innerHTML = `
    <div class="summary-card">
      <h3 class="summary-title" style="margin-bottom: 16px;"><i class="fa-solid fa-receipt"></i> Order Summary</h3>
      <p class="summary-restaurant" style="margin-bottom: 12px;">From: <strong>${cart.restaurantName}</strong></p>
      
      <div class="summary-items-list" style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 14px 0; margin-bottom: 16px;">
        ${cart.items.map(i => `
          <div class="summary-item-line" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>${i.name} <strong>x ${i.quantity}</strong></span>
            <span>${formatPKR(i.price * i.quantity)}</span>
          </div>
        `).join('')}
      </div>

      <div class="coupon-box" style="display: flex; gap: 8px; margin-bottom: 14px;">
        <input type="text" id="coupon-code-input" class="form-control" style="flex: 1;" placeholder="Promo code (e.g. KARACHI50)" />
        <button type="button" id="apply-coupon-btn" class="btn btn-sm btn-outline">Apply</button>
      </div>
      ${cart.coupon ? `<div style="background: var(--primary-light); color: var(--primary); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 14px;"><i class="fa-solid fa-check"></i> Coupon "${cart.coupon.code}" active!</div>` : ''}

      <div class="summary-calc-table">
        <div class="calc-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Subtotal</span><span>${formatPKR(totals.subtotal)}</span></div>
        <div class="calc-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Delivery Fee</span><span>${formatPKR(totals.deliveryFee)}</span></div>
        <div class="calc-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Sindh Sales Tax (5%)</span><span>${formatPKR(totals.tax)}</span></div>
        ${totals.discount > 0 ? `<div class="calc-row text-success" style="display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--success);"><span>Discount</span><span>-${formatPKR(totals.discount)}</span></div>` : ''}
        <div class="calc-row total-row" style="display: flex; justify-content: space-between; border-top: 2px dashed var(--border-color); padding-top: 12px; margin-top: 12px; font-size: 1.25rem; font-weight: 800;"><span>Grand Total</span><span>${formatPKR(totals.grandTotal)}</span></div>
      </div>
    </div>
  `;

  document.getElementById('apply-coupon-btn')?.addEventListener('click', handleCouponApply);
}

function handleCouponApply() {
  const input = document.getElementById('coupon-code-input');
  if (!input || !input.value.trim()) return;

  const code = input.value.trim().toUpperCase();
  const offers = Storage.getOffers();
  const matched = offers.find(o => o.code === code);

  if (matched) {
    Cart.applyCoupon(matched);
    renderOrderSummary();
  } else {
    showToast("Invalid promo code. Try KARACHI50 or BIRYANI20", "error");
  }
}

function handleOrderSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const email = document.getElementById('cust-email')?.value.trim() || "";
  const area = document.getElementById('checkout-area').value;
  const address = document.getElementById('cust-address').value.trim();
  const mapLink = document.getElementById('cust-map-link')?.value.trim() || "";
  const notes = document.getElementById('cust-notes')?.value.trim() || "";
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || "Cash on Delivery";

  if (!name || !phone || !area || !address) {
    showToast("Please fill in all required delivery fields", "error");
    return;
  }

  const cart = Cart.getCart();
  const deliveryFee = getSelectedDeliveryFee();
  const totals = Cart.getTotals(deliveryFee);

  const orderId = generateOrderId();
  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    restaurantId: cart.restaurantId,
    restaurantName: cart.restaurantName,
    customer: { name, phone, email, area, address, mapLink, notes },
    items: [...cart.items],
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.grandTotal,
    paymentMethod,
    status: "Pending"
  };

  const orders = Storage.getOrders();
  orders.unshift(newOrder);
  Storage.saveOrders(orders);
  Cart.clearCart();

  window.location.href = `order-success.html?orderId=${orderId}`;
}
