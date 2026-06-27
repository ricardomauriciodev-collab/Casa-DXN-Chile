let MOCK_ORDERS = [
  { id: 'o1', user_id: 'u1', user_name: 'Juan Pérez', items: [{ product_id: 'p1', name: 'DXN Spirudle', quantity: 2, price: 6672, pv: 2.1 }], total_clp: 13344, total_pv: 4.2, status: 'pendiente', created_at: '2026-06-25T14:30:00Z' },
  { id: 'o2', user_id: 'u2', user_name: 'María González', items: [{ product_id: 'p3', name: 'DXN Spirulina Coffee', quantity: 1, price: 19251, pv: 8.3 }], total_clp: 19251, total_pv: 8.3, status: 'pendiente', created_at: '2026-06-26T10:15:00Z' },
]

export function getOrders() {
  return [...MOCK_ORDERS]
}

export function createOrder(userId, userName, items) {
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
  MOCK_ORDERS.push(order)
  return order
}

export function approveOrder(orderId) {
  const order = MOCK_ORDERS.find(o => o.id === orderId)
  if (!order) return false
  order.status = 'aprobado'
  return true
}

export function rejectOrder(orderId) {
  MOCK_ORDERS = MOCK_ORDERS.filter(o => o.id !== orderId)
}
