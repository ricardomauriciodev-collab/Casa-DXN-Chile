import { supabase } from '../config/supabaseClient'

const STORAGE_KEY = 'dxn_orders'

const SEED_ORDERS = [
  { id: 'o1', user_id: 'u1', nombre_cliente: 'Juan Pérez', items: [{ productId: 'p1', name: 'DXN Spirudle', quantity: 2, price: 6672, pv: 2.1 }], total: 13344, totalPV: 4.2, status: 'pendiente', created_at: new Date().toISOString() },
  { id: 'o2', user_id: 'u2', nombre_cliente: 'María González', items: [{ productId: 'p3', name: 'DXN Spirulina Coffee', quantity: 1, price: 19251, pv: 8.3 }], total: 19251, totalPV: 8.3, status: 'aprobado', created_at: new Date().toISOString() },
]

function loadMockOrders() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  const c = SEED_ORDERS.map(o => ({ ...o }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
  return c
}

function saveMockOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export async function getOrders() {
  if (!supabase) return [...loadMockOrders()]
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createOrder(userId, nombreCliente, items) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalPV = Math.round(items.reduce((s, i) => s + (i.pv || 0) * i.quantity, 0) * 100) / 100
  const orderData = {
    user_id: userId,
    nombre_cliente: nombreCliente,
    items,
    total,
    totalPV,
    status: 'pendiente',
    created_at: new Date().toISOString(),
  }
  if (!supabase) {
    const order = { id: 'o' + Date.now(), ...orderData }
    const orders = loadMockOrders()
    orders.unshift(order)
    saveMockOrders(orders)
    return order
  }
  const { data, error } = await supabase.from('orders').insert([orderData]).select().single()
  if (error) throw error
  return data
}

export async function approveOrder(orderId) {
  if (!supabase) {
    const orders = loadMockOrders()
    const o = orders.find(o => o.id === orderId)
    if (o) { o.status = 'aprobado'; saveMockOrders(orders) }
    return
  }
  const { error } = await supabase.from('orders').update({ status: 'aprobado' }).eq('id', orderId)
  if (error) throw error
}

export async function rejectOrder(orderId) {
  if (!supabase) {
    const orders = loadMockOrders().filter(o => o.id !== orderId)
    saveMockOrders(orders)
    return
  }
  const { error } = await supabase.from('orders').delete().eq('id', orderId)
  if (error) throw error
}
