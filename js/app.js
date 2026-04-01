import { subscribeStorage } from "./lib/storage.js";
import { getCartCount } from "./domain/cart.js";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function setCartBadge(count) {
  const el = $("[data-cart-count]");
  if (!el) return;
  el.textContent = String(count);
  el.hidden = count <= 0;
}

function syncCartBadge() {
  setCartBadge(getCartCount());
}

function initNavToggle() {
  const toggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("nav--open");
  });
}

function initHeaderSearch() {
  const form = $("[data-search-form]");
  const input = $("[data-search-input]");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = String(input.value || "").trim();
    const url = new URL("catalog.html", window.location.href);
    if (q) url.searchParams.set("q", q);
    window.location.href = url.toString();
  });
}

function init() {
  initNavToggle();
  initHeaderSearch();
  syncCartBadge();
  subscribeStorage((key) => {
    if (key === "cart") syncCartBadge();
  });
}

init();

