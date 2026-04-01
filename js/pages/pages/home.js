import { products } from "../../data/products.js";
import { formatRub } from "../lib/format.js";
import { addToCart } from "../domain/cart.js";

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

function card(p) {
  const img = p.images?.[0];
  const href = `product.html?id=${encodeURIComponent(p.id)}`;
  const disabled = p.inStock ? "" : 'disabled aria-disabled="true"';
  return `
    <article class="product-card">
      <a href="${href}" class="product-card__media" aria-label="Открыть товар: ${escapeHtml(p.name)}">
        <img src="${img?.src || ""}" alt="${escapeHtml(img?.alt || p.name)}" loading="lazy" />
      </a>
      <div class="product-card__category">${escapeHtml(p.category)} • ${escapeHtml(p.brand)}</div>
      <h3 class="product-card__name">${escapeHtml(p.name)}</h3>
      <p class="product-card__description">${escapeHtml(p.shortDescription)}</p>
      <div class="product-card__footer">
        <div>
          <div class="product-card__price">${formatRub(p.price)}</div>
          <div class="product-card__hint">${p.inStock ? "В наличии" : "Нет в наличии"}</div>
        </div>
        <button class="btn product-card__link" type="button" data-add="${escapeHtml(p.id)}" ${disabled}>
          В корзину
          <span>＋</span>
        </button>
      </div>
    </article>
  `;
}

function init() {
  const grid = $("[data-popular-grid]");
  if (!grid) return;

  const popular = products.slice(0, 6);
  grid.innerHTML = popular.map(card).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.getAttribute("data-add");
    addToCart(id, 1);
    btn.textContent = "Добавлено";
    btn.disabled = true;
    window.setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'В корзину <span>＋</span>';
    }, 700);
  });
}

init();

