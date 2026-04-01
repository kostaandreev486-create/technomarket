import { readStorage, writeStorage } from "../lib/storage.js";

const ORDERS_KEY = "orders";

function defaultOrders() {
  return { orders: [] };
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getOrders() {
  return readStorage(ORDERS_KEY, defaultOrders());
}

export function listOrdersByUser(userId) {
  const { orders } = getOrders();
  if (!userId) return [];
  return orders.filter((o) => o.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createOrder({ userId, customer, delivery, comment, items, totals }) {
  const db = getOrders();
  const order = {
    id: generateId("ord"),
    userId: userId || null,
    status: "Принят",
    customer,
    delivery,
    comment: String(comment || "").trim(),
    items,
    totals,
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  writeStorage(ORDERS_KEY, db);
  return order;
}

