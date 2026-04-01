import {
  getCurrentUser,
  login,
  logout,
  registerUser,
  requestPasswordReset,
  confirmPasswordReset
} from "../domain/auth.js";
import { listOrdersByUser } from "../domain/orders.js";
import { formatRub } from "../lib/format.js";

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

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function viewGuest() {
  return `
    <div class="account-card">
      <div class="tabs" role="tablist" aria-label="Вход и регистрация">
        <button class="tab tab--active" type="button" data-tab="login" role="tab">Вход</button>
        <button class="tab" type="button" data-tab="register" role="tab">Регистрация</button>
        <button class="tab" type="button" data-tab="reset" role="tab">Восстановление</button>
      </div>

      <div class="tab-panel" data-panel="login">
        <form class="stack" data-login-form>
          <label class="field">
            <span class="field__label">Email или телефон</span>
            <input class="input" name="emailOrPhone" autocomplete="username" required />
          </label>
          <label class="field">
            <span class="field__label">Пароль</span>
            <input class="input" name="password" type="password" autocomplete="current-password" required />
          </label>
          <button class="btn" type="submit">Войти</button>
          <div class="notice notice--info">
            <strong>Подсказка:</strong> регистрация/вход в MVP работают локально (в браузере), без сервера.
          </div>
        </form>
      </div>

      <div class="tab-panel" data-panel="register" hidden>
        <form class="stack" data-register-form>
          <label class="field">
            <span class="field__label">Имя</span>
            <input class="input" name="name" autocomplete="name" />
          </label>
          <label class="field">
            <span class="field__label">Email или телефон</span>
            <input class="input" name="emailOrPhone" autocomplete="email" required />
          </label>
          <label class="field">
            <span class="field__label">Пароль</span>
            <input class="input" name="password" type="password" autocomplete="new-password" required />
          </label>
          <button class="btn" type="submit">Создать аккаунт</button>
        </form>
      </div>

      <div class="tab-panel" data-panel="reset" hidden>
        <form class="stack" data-reset-request-form>
          <label class="field">
            <span class="field__label">Email или телефон</span>
            <input class="input" name="emailOrPhone" required />
          </label>
          <button class="btn btn-secondary" type="submit">Запросить код</button>
          <div class="notice notice--warn" data-reset-token-box hidden>
            <strong>Токен для сброса (демо):</strong>
            <span class="text-muted" data-reset-token></span>
          </div>
        </form>

        <form class="stack" style="margin-top: 1.6rem" data-reset-confirm-form>
          <label class="field">
            <span class="field__label">Email или телефон</span>
            <input class="input" name="emailOrPhone" required />
          </label>
          <label class="field">
            <span class="field__label">Токен</span>
            <input class="input" name="token" required />
          </label>
          <label class="field">
            <span class="field__label">Новый пароль</span>
            <input class="input" name="newPassword" type="password" required />
          </label>
          <button class="btn" type="submit">Сменить пароль</button>
        </form>
      </div>
    </div>
  `;
}

function viewUser(user) {
  const orders = listOrdersByUser(user.id);
  const rows = orders.length
    ? orders
        .map((o) => {
          const total = formatRub(o.totals?.total || 0);
          return `
            <div class="order-row">
              <div>
                <div class="order-row__title">Заказ ${escapeHtml(o.id)}</div>
                <div class="order-row__meta text-muted">${escapeHtml(formatDate(o.createdAt))}</div>
              </div>
              <div class="order-row__right">
                <div class="order-row__status">${escapeHtml(o.status)}</div>
                <div class="order-row__total">${escapeHtml(total)}</div>
              </div>
            </div>
          `;
        })
        .join("")
    : `<div class="text-muted">Заказов пока нет. Оформите заказ в корзине.</div>`;

  return `
    <div class="account-grid">
      <section class="account-card" aria-label="Профиль">
        <h2 class="heading-2" style="font-size: 2rem">Профиль</h2>
        <div class="profile-line">
          <span class="text-muted">Имя</span>
          <strong>${escapeHtml(user.name)}</strong>
        </div>
        <div class="profile-line">
          <span class="text-muted">Email/телефон</span>
          <strong>${escapeHtml(user.emailOrPhone)}</strong>
        </div>
        <button class="btn btn-secondary" type="button" data-logout>Выйти</button>
      </section>

      <section class="account-card" aria-label="История заказов">
        <h2 class="heading-2" style="font-size: 2rem">История заказов</h2>
        <div class="orders-list">
          ${rows}
        </div>
      </section>
    </div>
  `;
}

function setActiveTab(root, tabKey) {
  root.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.classList.toggle("tab--active", btn.getAttribute("data-tab") === tabKey);
  });
  root.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.hidden = panel.getAttribute("data-panel") !== tabKey;
  });
}

function mount() {
  const root = $("[data-account-root]");
  if (!root) return;

  const user = getCurrentUser();
  root.innerHTML = user ? viewUser(user) : viewGuest();

  if (!user) {
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (btn) setActiveTab(root, btn.getAttribute("data-tab"));
    });

    const loginForm = $("[data-login-form]", root);
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(loginForm);
        try {
          login({
            emailOrPhone: fd.get("emailOrPhone"),
            password: fd.get("password")
          });
          mount();
        } catch (err) {
          alert(err.message || "Ошибка входа.");
        }
      });
    }

    const regForm = $("[data-register-form]", root);
    if (regForm) {
      regForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(regForm);
        try {
          registerUser({
            name: fd.get("name"),
            emailOrPhone: fd.get("emailOrPhone"),
            password: fd.get("password")
          });
          mount();
        } catch (err) {
          alert(err.message || "Ошибка регистрации.");
        }
      });
    }

    const reqForm = $("[data-reset-request-form]", root);
    if (reqForm) {
      reqForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(reqForm);
        try {
          const { token } = requestPasswordReset(fd.get("emailOrPhone"));
          const box = $("[data-reset-token-box]", root);
          const out = $("[data-reset-token]", root);
          if (box && out) {
            out.textContent = token;
            box.hidden = false;
          }
        } catch (err) {
          alert(err.message || "Ошибка восстановления.");
        }
      });
    }

    const confirmForm = $("[data-reset-confirm-form]", root);
    if (confirmForm) {
      confirmForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(confirmForm);
        try {
          confirmPasswordReset({
            emailOrPhone: fd.get("emailOrPhone"),
            token: fd.get("token"),
            newPassword: fd.get("newPassword")
          });
          alert("Пароль обновлён. Теперь можно войти.");
          setActiveTab(root, "login");
        } catch (err) {
          alert(err.message || "Ошибка подтверждения.");
        }
      });
    }
  } else {
    const logoutBtn = $("[data-logout]", root);
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logout();
        mount();
      });
    }
  }
}

mount();

