import { products } from "../../data/products.js";
import { formatRub, normalizeText, clampNumber } from "../lib/format.js";
import { addToCart } from "../domain/cart.js";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $$ (sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function uniqSorted(list) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b, "ru"));
}

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function setSearchParams(params) {
  const url = new URL(window.location.href);
  url.search = params.toString();
  window.history.replaceState({}, "", url.toString());
}

function buildFiltersFromForm(form) {
  const fd = new FormData(form);
  const brands = fd.getAll("brand").map(String);
  return {
    category: String(fd.get("category") || ""),
    priceMin: fd.get("priceMin") ? Number(fd.get("priceMin")) : null,
    priceMax: fd.get("priceMax") ? Number(fd.get("priceMax")) : null,
    brands,
    freshZone: fd.get("freshZone") === "1",
    leakProtection: fd.get("leakProtection") === "1",
    wireless: fd.get("wireless") === "1"
  };
}

function applyFilters(list, { q, filters }) {
  const query = normalizeText(q);
  const min = filters.priceMin != null ? Math.max(0, filters.priceMin) : null;
  const max = filters.priceMax != null ? Math.max(0, filters.priceMax) : null;

  return list.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;

    if (min != null && p.price < min) return false;
    if (max != null && p.price > max) return false;

    if (filters.freshZone && !p.attributes?.freshZone) return false;
    if (filters.leakProtection && !p.attributes?.leakProtection) return false;
    if (filters.wireless && !p.attributes?.wireless) return false;

    if (query) {
      const hay = normalizeText(
        `${p.name} ${p.category} ${p.brand} ${p.sku} ${p.shortDescription}`
      );
      if (!hay.includes(query)) return false;
    }

    return true;
  });
}

function sortProducts(list, sortKey) {
  const copy = [...list];
  switch (sortKey) {
    case "priceAsc":
      copy.sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      copy.sort((a, b) => b.price - a.price);
      break;
    case "nameAsc":
      copy.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      break;
    case "popular":
    default:
      copy.sort((a, b) => (a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1));
      break;
  }
  return copy;
}

function productCard(p) {
  const href = `product.html?id=${encodeURIComponent(p.id)}`;
  const img = p.images?.[0];
  const stockText = p.inStock ? `В наличии: ${p.stockQty} шт.` : "Нет в наличии";
  const disabled = p.inStock ? "" : 'disabled aria-disabled="true"';

  return `
    <article class="product-card">
      <a href="${href}" class="product-card__media" aria-label="Открыть товар: ${p.name}">
        <img src="${img?.src || ""}" alt="${img?.alt || p.name}" loading="lazy" />
      </a>
      <div class="product-card__category">${p.category} • ${p.brand}</div>
      <h2 class="product-card__name heading-3">${p.name}</h2>
      <p class="product-card__description">${p.shortDescription}</p>
      <div class="product-card__footer" style="align-items:flex-end">
        <div>
          <div class="product-card__price">${formatRub(p.price)}</div>
          <div class="product-card__hint">${stockText}</div>
        </div>
        <div class="product-card__actions">
          <a href="${href}" class="btn btn-secondary btn-sm">Подробнее</a>
          <button class="btn btn-sm" type="button" data-add-to-cart="${p.id}" ${disabled}>
            В корзину
            <span>＋</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(grid, list) {
  grid.innerHTML = list.map(productCard).join("");
}

function init() {
  const grid = $("[data-products-grid]");
  const form = $("[data-filters-form]");
  const brandsBox = $("[data-brands]");
  const caption = $("[data-results-caption]");
  const sortSel = $("[data-sort]");
  if (!grid || !form || !brandsBox || !caption || !sortSel) return;

  const categories = uniqSorted(products.map((p) => p.category));
  const brands = uniqSorted(products.map((p) => p.brand));

  const categorySel = form.elements.namedItem("category");
  if (categorySel && categorySel.tagName === "SELECT") {
    categorySel.insertAdjacentHTML(
      "beforeend",
      categories.map((c) => `<option value="${c}">${c}</option>`).join("")
    );
  }

  brandsBox.innerHTML = brands
    .map(
      (b) => `
        <label class="checkbox">
          <input type="checkbox" name="brand" value="${b}" />
          <span>${b}</span>
        </label>
      `
    )
    .join("");

  const params = getSearchParams();
  const q = params.get("q") || "";
  if (q) {
    const headerInput = $("[data-search-input]");
    if (headerInput) headerInput.value = q;
  }

  function syncFormFromParams() {
    const p = getSearchParams();
    const category = p.get("category") || "";
    const priceMin = p.get("priceMin") || "";
    const priceMax = p.get("priceMax") || "";
    const brands = p.getAll("brand");
    const freshZone = p.get("freshZone") === "1";
    const leakProtection = p.get("leakProtection") === "1";
    const wireless = p.get("wireless") === "1";
    const sort = p.get("sort") || "popular";

    if (categorySel) categorySel.value = category;
    if (form.elements.namedItem("priceMin")) form.elements.namedItem("priceMin").value = priceMin;
    if (form.elements.namedItem("priceMax")) form.elements.namedItem("priceMax").value = priceMax;
    $$('input[name="brand"]', form).forEach((el) => {
      el.checked = brands.includes(el.value);
    });
    form.elements.namedItem("freshZone").checked = freshZone;
    form.elements.namedItem("leakProtection").checked = leakProtection;
    form.elements.namedItem("wireless").checked = wireless;
    sortSel.value = sort;
  }

  function syncParamsFromForm() {
    const current = getSearchParams();
    const q = current.get("q") || "";
    const filters = buildFiltersFromForm(form);
    const sort = sortSel.value || "popular";

    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (filters.category) next.set("category", filters.category);
    if (filters.priceMin != null) next.set("priceMin", String(clampNumber(filters.priceMin, 0, 9999999, 0)));
    if (filters.priceMax != null) next.set("priceMax", String(clampNumber(filters.priceMax, 0, 9999999, 0)));
    filters.brands.forEach((b) => next.append("brand", b));
    if (filters.freshZone) next.set("freshZone", "1");
    if (filters.leakProtection) next.set("leakProtection", "1");
    if (filters.wireless) next.set("wireless", "1");
    if (sort && sort !== "popular") next.set("sort", sort);

    setSearchParams(next);
    return { q, filters, sort };
  }

  function render() {
    const current = getSearchParams();
    const q = current.get("q") || "";
    const filters = buildFiltersFromForm(form);
    const sort = current.get("sort") || sortSel.value || "popular";

    const filtered = applyFilters(products, { q, filters });
    const sorted = sortProducts(filtered, sort);

    caption.textContent = `Найдено товаров: ${sorted.length}`;
    renderProducts(grid, sorted);
  }

  syncFormFromParams();
  render();

  let t = null;
  form.addEventListener("input", () => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => {
      syncParamsFromForm();
      render();
    }, 120);
  });
  sortSel.addEventListener("change", () => {
    syncParamsFromForm();
    render();
  });

  const resetBtn = $("[data-filters-reset]");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      const p = getSearchParams();
      const q = p.get("q");
      const next = new URLSearchParams();
      if (q) next.set("q", q);
      setSearchParams(next);
      syncFormFromParams();
      render();
    });
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;
    const id = btn.getAttribute("data-add-to-cart");
    addToCart(id, 1);
    btn.textContent = "Добавлено";
    btn.setAttribute("aria-disabled", "true");
    btn.disabled = true;
    window.setTimeout(() => {
      btn.disabled = false;
      btn.removeAttribute("aria-disabled");
      btn.innerHTML = 'В корзину <span>＋</span>';
    }, 700);
  });
}

init();

