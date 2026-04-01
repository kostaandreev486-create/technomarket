import { products } from "../../data/products.js";
import { formatRub } from "../lib/format.js";
import { getCart, clearCart } from "../domain/cart.js";
import { getCurrentUser } from "../domain/auth.js";
import { createOrder } from "../domain/orders.js";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function calcFromCart(cart) {
  const lines = Object.entries(cart.items || {})
    .map(([productId, qty]) => {
      const p = products.find((x) => x.id === productId);
      const q = Math.max(0, Number(qty) || 0);
      if (!p || q <= 0) return null;
      return {
        productId,
        sku: p.sku,
        name: p.name,
        price: p.price,
        qty: q,
        sum: p.price * q
      };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((s, l) => s + l.sum, 0);
  const delivery = 0;
  const total = subtotal + delivery;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, subtotal, delivery, total, count };
}

function init() {
  const cart = getCart();
  const { lines, subtotal, delivery, total, count } = calcFromCart(cart);

  const empty = $("[data-empty-cart]");
  const success = $("[data-success]");
  const form = $("[data-checkout-form]");
  if (!form || !empty || !success) return;

  if (!lines.length) {
    empty.hidden = false;
    form.hidden = true;
    return;
  }

  const itemsCountEl = $("[data-items-count]");
  const subtotalEl = $("[data-subtotal]");
  const deliveryEl = $("[data-delivery]");
  const totalEl = $("[data-total]");
  if (itemsCountEl) itemsCountEl.textContent = String(count);
  if (subtotalEl) subtotalEl.textContent = formatRub(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatRub(delivery);
  if (totalEl) totalEl.textContent = formatRub(total);

  const user = getCurrentUser();
  if (user) {
    const fullName = form.elements.namedItem("fullName");
    const email = form.elements.namedItem("email");
    if (fullName && !fullName.value) fullName.value = user.name || "";
    if (email && !email.value && user.emailOrPhone?.includes("@")) email.value = user.emailOrPhone;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const fullName = String(fd.get("fullName") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const deliveryMethod = String(fd.get("delivery") || "").trim();
    const comment = String(fd.get("comment") || "").trim();

    if (!fullName || !phone || !email || !deliveryMethod) {
      alert("Заполните обязательные поля.");
      return;
    }

    const snapshotCart = getCart();
    const calc = calcFromCart(snapshotCart);
    if (!calc.lines.length) {
      alert("Корзина пуста.");
      window.location.href = "cart.html";
      return;
    }

    const current = getCurrentUser();
    const order = createOrder({
      userId: current?.id || null,
      customer: { fullName, phone, email },
      delivery: { method: deliveryMethod },
      comment,
      items: calc.lines,
      totals: { subtotal: calc.subtotal, delivery: calc.delivery, total: calc.total }
    });

    clearCart();
    form.hidden = true;
    success.hidden = false;
    const text = $("[data-success-text]");
    if (text) {
      text.textContent = `Номер заказа: ${order.id}. Статус: ${order.status}.`;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

init();

