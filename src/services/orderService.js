const STORAGE_KEY = 'dxn_orders'

const SEED_ORDERS = [
  { id: 'o1', user_id: 'u1', user_name: 'Juan Pérez', items: [{ product_id: 'p1', name: 'DXN Spirudle', quantity: 2, price: 6672, pv: 2.1 }], total_clp: 13344, total_pv: 4.2, status: 'pendiente', created_at: '2026-06-25T14:30:00Z' },
  { id: 'o2', user_id: 'u2', user_name: 'María González', items: [{ product_id: 'p3', name: 'DXN Spirulina Coffee', quantity: 1, price: 19251, pv: 8.3 }], total_clp: 19251, total_pv: 8.3, status: 'pendiente', created_at: '2026-06-26T10:15:00Z' },
]

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const copy = SEED_ORDERS.map(o => ({ ...o }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy))
  return copy
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function getOrders() {
  return [...loadOrders()]
}

export function createOrder(userId, userName, items) {
  const orders = loadOrders()
  const totalCLP = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalPV = Math.round(items.reduce((s, i) => s + i.pv * i.quantity, 0) * 100) / 100
  const order = {
    id: 'o' + Date.now(),
    user_id: userId,
    user_name: userName,
    items,
    total_clp: totalCLP,
    total_pv: totalPV,
    status: 'pendiente',
    created_at: new Date().toISOString(),
  }
  orders.push(order)
  saveOrders(orders)
  return order
}

export function approveOrder(orderId) {
  const orders = loadOrders()
  const order = orders.find(o => o.id === orderId)
  if (!order) return false
  order.status = 'aprobado'
  saveOrders(orders)
  return true
}

export function rejectOrder(orderId) {
  const orders = loadOrders().filter(o => o.id !== orderId)
  saveOrders(orders)
}
