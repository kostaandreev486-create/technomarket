import { readStorage, writeStorage } from "../lib/storage.js";

const CART_KEY = "cart";

function defaultCart() {
  return { items: {} };
}

export function getCart() {
  return readStorage(CART_KEY, defaultCart());
}

export function clearCart() {
  writeStorage(CART_KEY, defaultCart());
}

export function getCartCount() {
  const cart = getCart();
  return Object.values(cart.items).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
}

export function getCartQty(productId) {
  const cart = getCart();
  return Number(cart.items?.[productId] || 0);
}

export function setCartQty(productId, qty) {
  const cart = getCart();
  const n = Number(qty) || 0;
  if (n <= 0) {
    delete cart.items[productId];
  } else {
    cart.items[productId] = Math.floor(n);
  }
  writeStorage(CART_KEY, cart);
  return cart;
}

export function addToCart(productId, delta = 1) {
  const current = getCartQty(productId);
  return setCartQty(productId, current + (Number(delta) || 1));
}

