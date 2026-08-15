import { supabase } from '../config/supabaseClient'
import { calculateStars, clampStars } from '../utils/stars'

const USERS_KEY = 'dxn_users'
const ORDERS_KEY = 'dxn_orders'

function loadMockUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveMockUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadMockOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function monthBounds() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
  return { start, end }
}

export async function getMonthlyApprovedPV(userId) {
  const { start, end } = monthBounds()
  if (!supabase) {
    const orders = loadMockOrders().filter(
      (o) => o.user_id === userId && o.status === 'aprobado'
    )
    const total = orders.reduce((s, o) => {
      const t = new Date(o.approved_at || o.created_at).getTime()
      if (t >= new Date(start).getTime() && t < new Date(end).getTime()) {
        return s + (o.total_pv || 0)
      }
      return s
    }, 0)
    return Math.round(total * 100) / 100
  }
  const { data, error } = await supabase
    .from('orders')
    .select('total_pv')
    .eq('user_id', userId)
    .eq('status', 'aprobado')
    .gte('approved_at', start)
    .lt('approved_at', end)
  if (error) throw error
  const total = (data || []).reduce((s, o) => s + (o.total_pv || 0), 0)
  return Math.round(total * 100) / 100
}

export async function getCurrentStars(userId) {
  if (!supabase) {
    const users = loadMockUsers()
    const u = users.find((x) => x.id === userId)
    return u ? Number(u.stars) || 0 : 0
  }
  const { data, error } = await supabase
    .from('users')
    .select('stars')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data ? Number(data.stars) || 0 : 0
}

export async function grantStarsForUser(userId) {
  const [monthPV, current] = await Promise.all([
    getMonthlyApprovedPV(userId),
    getCurrentStars(userId),
  ])
  const computed = calculateStars(monthPV)
  const next = Math.max(current, computed)
  await setUserStars(userId, next)
  return next
}

export async function setUserStars(userId, stars) {
  const clamped = clampStars(stars)
  if (!supabase) {
    const users = loadMockUsers()
    const u = users.find((x) => x.id === userId)
    if (u) {
      u.stars = clamped
      saveMockUsers(users)
    }
    return clamped
  }
  const { error } = await supabase.from('users').update({ stars: clamped }).eq('id', userId)
  if (error) throw error
  return clamped
}

export async function resetAllStars() {
  if (!supabase) {
    const users = loadMockUsers()
    users.forEach((u) => { u.stars = 0 })
    saveMockUsers(users)
    return
  }
  const { error } = await supabase.from('users').update({ stars: 0 }).neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}