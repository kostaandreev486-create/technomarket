import { readStorage, writeStorage, removeStorage } from "../lib/storage.js";
import { normalizeText } from "../lib/format.js";

const USERS_KEY = "users";
const SESSION_KEY = "session";

function defaultUsers() {
  return { users: [] };
}

function defaultSession() {
  return { userId: null };
}

export function getUsers() {
  return readStorage(USERS_KEY, defaultUsers());
}

export function getSession() {
  return readStorage(SESSION_KEY, defaultSession());
}

export function getCurrentUser() {
  const { userId } = getSession();
  if (!userId) return null;
  const { users } = getUsers();
  return users.find((u) => u.id === userId) || null;
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function registerUser({ name, emailOrPhone, password }) {
  const identity = normalizeText(emailOrPhone);
  if (!identity) throw new Error("Введите email или телефон.");
  if (!password || password.length < 4) throw new Error("Пароль должен быть не короче 4 символов.");

  const db = getUsers();
  const exists = db.users.some((u) => normalizeText(u.emailOrPhone) === identity);
  if (exists) throw new Error("Пользователь с таким email/телефоном уже зарегистрирован.");

  const user = {
    id: generateId("u"),
    name: String(name || "").trim() || "Покупатель",
    emailOrPhone: String(emailOrPhone).trim(),
    passwordHash: String(password),
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  writeStorage(USERS_KEY, db);
  writeStorage(SESSION_KEY, { userId: user.id });
  return user;
}

export function login({ emailOrPhone, password }) {
  const identity = normalizeText(emailOrPhone);
  const { users } = getUsers();
  const user = users.find((u) => normalizeText(u.emailOrPhone) === identity);
  if (!user) throw new Error("Пользователь не найден.");
  if (String(password) !== String(user.passwordHash)) throw new Error("Неверный пароль.");
  writeStorage(SESSION_KEY, { userId: user.id });
  return user;
}

export function logout() {
  removeStorage(SESSION_KEY);
  writeStorage(SESSION_KEY, defaultSession());
}

export function requestPasswordReset(emailOrPhone) {
  const identity = normalizeText(emailOrPhone);
  const { users } = getUsers();
  const user = users.find((u) => normalizeText(u.emailOrPhone) === identity);
  if (!user) throw new Error("Пользователь не найден.");
  const token = `reset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  writeStorage(`passwordReset:${user.id}`, { token, createdAt: new Date().toISOString() });
  return { token };
}

export function confirmPasswordReset({ emailOrPhone, token, newPassword }) {
  const identity = normalizeText(emailOrPhone);
  if (!newPassword || newPassword.length < 4) throw new Error("Новый пароль должен быть не короче 4 символов.");

  const db = getUsers();
  const user = db.users.find((u) => normalizeText(u.emailOrPhone) === identity);
  if (!user) throw new Error("Пользователь не найден.");
  const saved = readStorage(`passwordReset:${user.id}`, null);
  if (!saved || saved.token !== token) throw new Error("Неверный или просроченный токен.");

  user.passwordHash = String(newPassword);
  writeStorage(USERS_KEY, db);
  removeStorage(`passwordReset:${user.id}`);
  return true;
}

