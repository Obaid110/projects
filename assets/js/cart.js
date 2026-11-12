/**
 * Karachi Eats - Cart Management with Multi-Restaurant Safeguard
 */
import { APP_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { formatPKR, showToast } from './utils.js';

class CartManager {
  constructor() {
    this.cart = Storage.get(APP_CONFIG.storageKeys.CART, {
      restaurantId: null,
      restaurantName: "",
      items: [],
      coupon: null
    });
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    Storage.set(APP_CONFIG.storageKeys.CART, this.cart);
    this.listeners.forEach(fn => fn(this.cart));
    this.updateBadge();
  }

  getCart() {
    return this.cart;
  }

  addItem(restaurant, item) {
    // Single restaurant safeguard
    if (this.cart.restaurantId && this.cart.restaurantId !== restaurant.id && this.cart.items.length > 0) {
      const confirmChange = confirm(
        `Your cart contains items from "${this.cart.restaurantName}". Clear your cart to start a new order from "${restaurant.name}"?`
      );
      if (!confirmChange) return false;
      this.clearCart(false);
    }

    this.cart.restaurantId = restaurant.id;
    this.cart.restaurantName = restaurant.name;

    const existingIndex = this.cart.items.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      this.cart.items[existingIndex].quantity += 1;
    } else {
      this.cart.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      });
    }

    showToast(`Added "${item.name}" to cart!`, 'success');
    this.notify();
    return true;
  }

  updateQuantity(itemId, delta) {
    const index = this.cart.items.findIndex(i => i.id === itemId);
    if (index === -1) return;

    this.cart.items[index].quantity += delta;
    if (this.cart.items[index].quantity <= 0) {
      this.cart.items.splice(index, 1);
      showToast("Item removed from cart", 'info');
    }

    if (this.cart.items.length === 0) {
      this.cart.restaurantId = null;
      this.cart.restaurantName = "";
      this.cart.coupon = null;
    }

    this.notify();
  }

  removeItem(itemId) {
    this.cart.items = this.cart.items.filter(i => i.id !== itemId);
    if (this.cart.items.length === 0) {
      this.cart.restaurantId = null;
      this.cart.restaurantName = "";
      this.cart.coupon = null;
    }
    showToast("Item removed", 'info');
    this.notify();
  }

  clearCart(notify = true) {
    this.cart = {
      restaurantId: null,
      restaurantName: "",
      items: [],
      coupon: null
    };
    if (notify) this.notify();
  }

  applyCoupon(coupon) {
    this.cart.coupon = coupon;
    this.notify();
    showToast(`Coupon "${coupon.code}" applied!`, 'success');
  }

  removeCoupon() {
    this.cart.coupon = null;
    this.notify();
    showToast("Coupon removed", 'info');
  }

  getTotals(deliveryFee = APP_CONFIG.defaultDeliveryFee) {
    const subtotal = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (this.cart.coupon) {
      if (this.cart.coupon.isFreeDelivery) {
        deliveryFee = 0;
      } else if (this.cart.coupon.discountPercent) {
        discount = Math.round((subtotal * this.cart.coupon.discountPercent) / 100);
        if (this.cart.coupon.maxDiscount && discount > this.cart.coupon.maxDiscount) {
          discount = this.cart.coupon.maxDiscount;
        }
      }
    }

    const tax = Math.round(subtotal * APP_CONFIG.taxRate);
    const grandTotal = Math.max(0, subtotal + deliveryFee + tax - discount);

    return {
      itemCount: this.cart.items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee,
      tax,
      discount,
      grandTotal
    };
  }

  updateBadge() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const totalCount = this.cart.items.reduce((sum, i) => sum + i.quantity, 0);
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });
  }
}

export const Cart = new CartManager();
