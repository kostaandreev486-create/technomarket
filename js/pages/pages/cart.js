import { products } from "../../data/products.js";
import { formatRub, clampNumber } from "../lib/format.js";
import { getCart, setCartQty, clearCart } from "../domain/cart.js";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

function calc(cart) {
  const lines = Object.entries(cart.items || {})
    .map(([productId, qty]) => {
      const product = getProductById(productId);
      const q = Math.max(0, Number(qty) || 0);
      if (!product || q <= 0) return null;
      return {
        productId,
        product,
        qty: q,
        sum: product.price * q
      };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((s, l) => s + l.sum, 0);
  const delivery = 0;
  const total = subtotal + delivery;
  return { lines, subtotal, delivery, total };
}

function renderLine(line) {
  const p = line.product;
  const img = p.images?.[0];
  return `
    <div class="cart-item" data-cart-item="${escapeHtml(line.productId)}">
      <a class="cart-item__media" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="Открыть товар: ${escapeHtml(p.name)}">
        <img src="${img?.src || ""}" alt="${escapeHtml(img?.alt || p.name)}" loading="lazy" />
      </a>
      <div class="cart-item__info">
        <div class="cart-item__title">${escapeHtml(p.name)}</div>
        <div class="cart-item__meta text-muted">${escapeHtml(p.category)} • ${escapeHtml(p.brand)} • ${escapeHtml(p.sku)}</div>
        <div class="cart-item__price">${formatRub(p.price)}</div>
      </div>
      <div class="cart-item__controls" aria-label="Количество">
        <button class="qty-btn" type="button" data-qty-dec aria-label="Уменьшить">−</button>
        <input class="qty-input" type="number" min="1" step="1" value="${line.qty}" data-qty-input />
        <button class="qty-btn" type="button" data-qty-inc aria-label="Увеличить">+</button>
      </div>
      <div class="cart-item__sum">
        <div><strong>${formatRub(line.sum)}</strong></div>
        <button class="link-danger" type="button" data-remove>Удалить</button>
      </div>
    </div>
  `;
}

function updateSummary({ subtotal, delivery, total }, hasItems) {
  const subtotalEl = $("[data-cart-subtotal]");
  const deliveryEl = $("[data-cart-delivery]");
  const totalEl = $("[data-cart-total]");
  if (subtotalEl) subtotalEl.textContent = formatRub(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatRub(delivery);
  if (totalEl) totalEl.textContent = formatRub(total);

  const checkoutBtn = $("[data-checkout-btn]");
  if (checkoutBtn) {
    checkoutBtn.setAttribute("aria-disabled", hasItems ? "false" : "true");
    checkoutBtn.classList.toggle("btn--disabled", !hasItems);
    checkoutBtn.tabIndex = hasItems ? 0 : -1;
  }
}

function render() {
  const list = $("[data-cart-list]");
  const empty = $("[data-cart-empty]");
  if (!list || !empty) return;

  const cart = getCart();
  const { lines, subtotal, delivery, total } = calc(cart);

  if (!lines.length) {
    list.innerHTML = "";
    empty.hidden = false;
    updateSummary({ subtotal: 0, delivery: 0, total: 0 }, false);
    return;
  }

  empty.hidden = true;
  list.innerHTML = lines.map(renderLine).join("");
  updateSummary({ subtotal, delivery, total }, true);
}

function init() {
  render();

  const list = $("[data-cart-list]");
  if (list) {
    list.addEventListener("click", (e) => {
      const row = e.target.closest("[data-cart-item]");
      if (!row) return;
      const productId = row.getAttribute("data-cart-item");

      if (e.target.closest("[data-remove]")) {
        setCartQty(productId, 0);
        render();
        return;
      }

      if (e.target.closest("[data-qty-dec]")) {
        const input = $("[data-qty-input]", row);
        const qty = clampNumber(input?.value, 1, 999, 1);
        setCartQty(productId, qty - 1);
        render();
        return;
      }

      if (e.target.closest("[data-qty-inc]")) {
        const input = $("[data-qty-input]", row);
        const qty = clampNumber(input?.value, 1, 999, 1);
        setCartQty(productId, qty + 1);
        render();
        return;
      }
    });

    list.addEventListener("change", (e) => {
      const row = e.target.closest("[data-cart-item]");
      if (!row) return;
      const input = e.target.closest("[data-qty-input]");
      if (!input) return;
      const productId = row.getAttribute("data-cart-item");
      const qty = clampNumber(input.value, 1, 999, 1);
      setCartQty(productId, qty);
      render();
    });
  }

  const clearBtn = $("[data-clear-cart]");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!confirm("Очистить корзину?")) return;
      clearCart();
      render();
    });
  }
}

init();

