/**
 * Karachi Eats - Admin Offers & Coupons Management Controller
 */
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { formatPKR, showToast } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();
  renderOffersTable();
  setupAddOfferModal();
});

export function renderOffersTable() {
  const tbody = document.getElementById('offers-tbody');
  if (!tbody) return;

  const offers = Storage.getOffers();
  tbody.innerHTML = offers.map(o => `
    <tr>
      <td><strong style="color: var(--primary); font-size: 1.05rem;">${o.code}</strong></td>
      <td>${o.title}<br><small class="text-muted">${o.description}</small></td>
      <td><strong>${o.discountPercent}%</strong></td>
      <td>${formatPKR(o.minSpend)}</td>
      <td>${o.expiresAt}</td>
      <td>
        <button class="btn btn-xs btn-danger del-offer-btn" data-id="${o.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.del-offer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm("Delete this promo coupon?")) return;
      let offers = Storage.getOffers();
      offers = offers.filter(o => o.id !== btn.dataset.id);
      Storage.saveOffers(offers);
      showToast("Coupon removed", "info");
      renderOffersTable();
    });
  });
}

function setupAddOfferModal() {
  const addBtn = document.getElementById('open-add-offer-btn');
  const modal = document.getElementById('offer-modal');
  const form = document.getElementById('offer-form');

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
      const offers = Storage.getOffers();
      const newOffer = {
        id: `off_${Date.now()}`,
        code: document.getElementById('offer-code').value.trim().toUpperCase(),
        title: document.getElementById('offer-title').value.trim(),
        description: document.getElementById('offer-desc').value.trim(),
        discountPercent: parseInt(document.getElementById('offer-discount').value) || 10,
        maxDiscount: parseInt(document.getElementById('offer-max').value) || 500,
        minSpend: parseInt(document.getElementById('offer-min').value) || 500,
        expiresAt: document.getElementById('offer-expiry').value || "2026-12-31"
      };

      offers.push(newOffer);
      Storage.saveOffers(offers);
      showToast("Coupon created successfully!", "success");
      modal.style.display = 'none';
      renderOffersTable();
    });
  }
}
