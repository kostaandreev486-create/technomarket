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

function getProductId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

function renderSpecs(specs) {
  if (!specs?.length) return "";
  return `
    <div class="product-specs">
      <h3 class="heading-2" style="font-size: 2rem">Характеристики</h3>
      <ul class="specs-list">
        ${specs
          .map((s) => `<li><strong>${escapeHtml(s.label)}:</strong> ${escapeHtml(s.value)}</li>`)
          .join("")}
      </ul>
    </div>
  `;
}

function renderHighlights(list) {
  if (!list?.length) return "";
  return `
    <div class="product-highlights" aria-label="Краткие преимущества модели">
      ${list.map((t) => `<div class="product-highlights__item">${escapeHtml(t)}</div>`).join("")}
    </div>
  `;
}

function renderGallery(p) {
  const imgs = p.images || [];
  const main = imgs[0];
  const thumbs = imgs
    .map(
      (img, idx) => `
        <button class="thumb ${idx === 0 ? "thumb--active" : ""}" type="button" data-thumb="${idx}">
          <img src="${img.src}" alt="${escapeHtml(img.alt)}" loading="lazy" />
        </button>
      `
    )
    .join("");

  return `
    <div class="gallery">
      <button class="gallery__main" type="button" data-zoom aria-label="Увеличить фото">
        <img src="${main?.src || ""}" alt="${escapeHtml(main?.alt || p.name)}" data-main-img />
      </button>
      <div class="gallery__thumbs" aria-label="Миниатюры фото">
        ${thumbs}
      </div>
    </div>
  `;
}

function renderProduct(p) {
  const stockText = p.inStock ? `В наличии: ${p.stockQty} шт.` : "Нет в наличии";
  const disabled = p.inStock ? "" : 'disabled aria-disabled="true"';
  const tags = (p.tags || []).map((t) => `<span>${escapeHtml(t)}</span>`).join('<span>•</span>');

  return `
    <div class="product-layout">
      <aside class="product-visual" aria-label="Фотографии товара">
        ${renderGallery(p)}
        ${tags ? `<div class="product-visual__tag">${tags}</div>` : ""}
      </aside>

      <article class="product-details">
        <div class="product-price">
          <div class="product-price__current">${formatRub(p.price)}</div>
          <div class="product-price__note">
            <strong>${escapeHtml(stockText)}</strong> • Артикул: <strong>${escapeHtml(p.sku)}</strong>
          </div>
        </div>

        <div>
          <h3 class="heading-2" style="margin-bottom: 0.8rem; font-size: 2rem">Описание</h3>
          <p class="text-muted">${escapeHtml(p.description)}</p>
        </div>

        ${renderHighlights(p.highlights)}
        ${renderSpecs(p.specs)}

        <div class="product-actions">
          <button type="button" class="btn" data-add ${disabled}>
            Добавить в корзину
            <span>＋</span>
          </button>
          <button type="button" class="btn btn-secondary" data-buy-one ${disabled}>
            Купить в 1 клик
          </button>
        </div>

        <div class="text-muted" style="font-size: 1.3rem">
          Оплата и доставка зависят от выбранного способа оформления заказа.
        </div>
      </article>
    </div>

    <dialog class="dialog" data-zoom-dialog aria-label="Просмотр фото">
      <div class="dialog__inner">
        <button class="dialog__close" type="button" data-close>✕</button>
        <img class="dialog__image" alt="" data-zoom-img />
      </div>
    </dialog>

    <dialog class="dialog" data-oneclick-dialog aria-label="Покупка в один клик">
      <form method="dialog" class="dialog__inner dialog__form" data-oneclick-form>
        <button class="dialog__close" type="button" data-close>✕</button>
        <h2 class="heading-2" style="margin-bottom: 0.4rem">Купить в 1 клик</h2>
        <p class="text-muted" style="margin-top: 0">Оставьте контакты — мы перезвоним для подтверждения заказа.</p>
        <label class="field">
          <span class="field__label">Имя</span>
          <input class="input" name="name" autocomplete="name" required />
        </label>
        <label class="field">
          <span class="field__label">Телефон</span>
          <input class="input" name="phone" inputmode="tel" autocomplete="tel" required />
        </label>
        <div class="dialog__actions">
          <button class="btn" type="submit">Отправить</button>
          <button class="btn btn-secondary" type="button" data-close>Отмена</button>
        </div>
        <div class="text-muted" style="font-size: 1.2rem">
          Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных (152‑ФЗ).
        </div>
      </form>
    </dialog>
  `;
}

function init() {
  const id = getProductId();
  const product = products.find((p) => p.id === id) || products[0];
  const section = $("section.section[aria-labelledby='product-title']");
  const headerTitle = $("[data-product-title]") || $("#product-title");
  const headerSubtitle = $("[data-product-subtitle]") || section?.querySelector(".section__description");
  if (!section || !headerTitle || !headerSubtitle) return;

  headerTitle.textContent = product.name;
  headerSubtitle.textContent = `${product.category} • ${product.brand}`;
  document.title = `${product.name} — ТехноМаркет`;

  const crumbs = $("nav[aria-label='Хлебные крошки'] span.text-muted");
  if (crumbs) crumbs.textContent = product.name;

  const contentNodes = Array.from(section.childNodes);
  const headerEl = section.querySelector(".section__header");
  contentNodes.forEach((n) => {
    if (headerEl && (n === headerEl || n.contains?.(headerEl))) return;
    if (headerEl && n.compareDocumentPosition && (n.compareDocumentPosition(headerEl) & Node.DOCUMENT_POSITION_FOLLOWING) === 0) return;
  });

  while (headerEl && headerEl.nextSibling) {
    headerEl.nextSibling.remove();
  }

  const wrapper = document.createElement("div");
  wrapper.className = "product-page";
  wrapper.innerHTML = renderProduct(product);
  section.appendChild(wrapper);

  wrapper.addEventListener("click", (e) => {
    const t = e.target;
    const addBtn = t.closest?.("[data-add]");
    if (addBtn) {
      addToCart(product.id, 1);
      addBtn.textContent = "Добавлено";
      addBtn.disabled = true;
      window.setTimeout(() => {
        addBtn.disabled = false;
        addBtn.innerHTML = 'Добавить в корзину <span>＋</span>';
      }, 800);
      return;
    }

    const buyOne = t.closest?.("[data-buy-one]");
    if (buyOne) {
      const dlg = $("[data-oneclick-dialog]", wrapper);
      dlg?.showModal?.();
      return;
    }

    const zoom = t.closest?.("[data-zoom]");
    if (zoom) {
      const dlg = $("[data-zoom-dialog]", wrapper);
      const mainImg = $("[data-main-img]", wrapper);
      const zoomImg = $("[data-zoom-img]", wrapper);
      if (dlg && mainImg && zoomImg) {
        zoomImg.src = mainImg.src;
        zoomImg.alt = mainImg.alt;
        dlg.showModal?.();
      }
      return;
    }

    const close = t.closest?.("[data-close]");
    if (close) {
      const dlg = t.closest("dialog");
      dlg?.close?.();
      return;
    }

    const thumbBtn = t.closest?.("[data-thumb]");
    if (thumbBtn) {
      const idx = Number(thumbBtn.getAttribute("data-thumb"));
      const img = product.images?.[idx];
      const mainImg = $("[data-main-img]", wrapper);
      if (img && mainImg) {
        mainImg.src = img.src;
        mainImg.alt = img.alt;
        wrapper.querySelectorAll(".thumb").forEach((el) => el.classList.remove("thumb--active"));
        thumbBtn.classList.add("thumb--active");
      }
    }
  });

  const oneClickForm = $("[data-oneclick-form]", wrapper);
  if (oneClickForm) {
    oneClickForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(oneClickForm);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      if (!name || !phone) return;
      const dlg = $("[data-oneclick-dialog]", wrapper);
      dlg?.close?.();
      alert(`Заявка отправлена.\n\nТовар: ${product.name}\nИмя: ${name}\nТелефон: ${phone}`);
    });
  }

  wrapper.querySelectorAll("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  });
}

init();

