/**
 * Karachi Eats - LocalStorage Data Engine
 */
import { APP_CONFIG } from './config.js';
import { generateSeedRestaurants, generateSeedMenus, SEED_OFFERS, SEED_ORDERS } from './data.js';

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(APP_CONFIG.storageKeys.RESTAURANTS)) {
      const restaurants = generateSeedRestaurants();
      const menus = generateSeedMenus(restaurants);
      localStorage.setItem(APP_CONFIG.storageKeys.RESTAURANTS, JSON.stringify(restaurants));
      localStorage.setItem(APP_CONFIG.storageKeys.MENUS, JSON.stringify(menus));
      localStorage.setItem(APP_CONFIG.storageKeys.AREAS, JSON.stringify(APP_CONFIG.karachiAreas));
      localStorage.setItem(APP_CONFIG.storageKeys.OFFERS, JSON.stringify(SEED_OFFERS));
      localStorage.setItem(APP_CONFIG.storageKeys.ORDERS, JSON.stringify(SEED_ORDERS));
      localStorage.setItem(APP_CONFIG.storageKeys.SETTINGS, JSON.stringify({
        businessName: APP_CONFIG.appName,
        whatsApp: APP_CONFIG.businessWhatsApp,
        phone: APP_CONFIG.supportPhone,
        email: APP_CONFIG.supportEmail,
        currency: APP_CONFIG.currency,
        defaultDeliveryFee: APP_CONFIG.defaultDeliveryFee
      }));
    }
  }

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing key ${key} to storage:`, e);
      return false;
    }
  }

  getRestaurants() {
    return this.get(APP_CONFIG.storageKeys.RESTAURANTS, []);
  }

  saveRestaurants(restaurants) {
    return this.set(APP_CONFIG.storageKeys.RESTAURANTS, restaurants);
  }

  getMenus(restaurantId = null) {
    const allMenus = this.get(APP_CONFIG.storageKeys.MENUS, {});
    return restaurantId ? (allMenus[restaurantId] || []) : allMenus;
  }

  saveMenus(allMenus) {
    return this.set(APP_CONFIG.storageKeys.MENUS, allMenus);
  }

  getOrders() {
    return this.get(APP_CONFIG.storageKeys.ORDERS, []);
  }

  saveOrders(orders) {
    return this.set(APP_CONFIG.storageKeys.ORDERS, orders);
  }

  getOffers() {
    return this.get(APP_CONFIG.storageKeys.OFFERS, []);
  }

  saveOffers(offers) {
    return this.set(APP_CONFIG.storageKeys.OFFERS, offers);
  }

  getAreas() {
    return this.get(APP_CONFIG.storageKeys.AREAS, APP_CONFIG.karachiAreas);
  }

  saveAreas(areas) {
    return this.set(APP_CONFIG.storageKeys.AREAS, areas);
  }

  getSettings() {
    return this.get(APP_CONFIG.storageKeys.SETTINGS, {});
  }

  saveSettings(settings) {
    return this.set(APP_CONFIG.storageKeys.SETTINGS, settings);
  }

  resetAllData() {
    localStorage.clear();
    this.init();
  }
}

export const Storage = new StorageManager();
