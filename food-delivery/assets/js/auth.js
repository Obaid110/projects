/**
 * Karachi Eats - Authentication & Session Engine
 */
import { APP_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { showToast } from './utils.js';

class AuthManager {
  constructor() {
    this.user = Storage.get(APP_CONFIG.storageKeys.AUTH_USER, null);
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.user;
  }

  isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  login(email, password) {
    if (email === "admin@karachieats.pk" && password === "admin123") {
      this.user = {
        id: "usr_admin",
        name: "Karachi Eats Admin",
        email: email,
        phone: "+92 300 1234567",
        role: "admin"
      };
      Storage.set(APP_CONFIG.storageKeys.AUTH_USER, this.user);
      showToast("Welcome back, Administrator!", "success");
      return { success: true, user: this.user };
    }

    if (password.length >= 6) {
      this.user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        phone: "+92 321 0000000",
        role: "customer"
      };
      Storage.set(APP_CONFIG.storageKeys.AUTH_USER, this.user);
      showToast(`Welcome to Karachi Eats, ${this.user.name}!`, "success");
      return { success: true, user: this.user };
    }

    showToast("Invalid credentials. Try password 'admin123' for admin.", "error");
    return { success: false, message: "Invalid credentials" };
  }

  register(name, email, phone, password) {
    if (!name || !email || password.length < 6) {
      showToast("Please provide valid details (Password min 6 chars)", "error");
      return { success: false };
    }

    this.user = {
      id: `usr_${Date.now()}`,
      name: name,
      email: email,
      phone: phone || "+92 300 0000000",
      role: "customer"
    };

    Storage.set(APP_CONFIG.storageKeys.AUTH_USER, this.user);
    showToast("Account created successfully!", "success");
    return { success: true, user: this.user };
  }

  logout() {
    this.user = null;
    localStorage.removeItem(APP_CONFIG.storageKeys.AUTH_USER);
    showToast("Logged out successfully", "info");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  }

  requireAdmin() {
    if (!this.isAdmin()) {
      alert("Access restricted. Please log in as Administrator.");
      window.location.href = "../login.html";
    }
  }
}

export const Auth = new AuthManager();
