import { supabase } from '../config/supabaseClient'

const STORAGE_KEY = 'dxn_users'

const SEED_USERS = [
  { id: 'u1', nombre_completo: 'Juan Pérez', rut: '12.345.678-9', codigo_distribuidor: 'DXN-100', pais: 'Chile', numero_carnet: '12.345.678-9', direccion: 'Av. Providencia 123', role: 'client', username: 'DXN-100', password: '100' },
  { id: 'u2', nombre_completo: 'María González', rut: '23.456.789-0', codigo_distribuidor: 'DXN-200', pais: 'Chile', numero_carnet: '23.456.789-0', direccion: 'Calle Central 456', role: 'client', username: 'DXN-200', password: '200' },
]

function loadMockUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const copy = SEED_USERS.map(u => ({ ...u }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy))
  return copy
}

function saveMockUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export async function getUsers() {
  if (!supabase) return [...loadMockUsers()]
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data
}

function generateCredentials(codigoDistribuidor) {
  const digits = (codigoDistribuidor || '').replace(/\D/g, '')
  const password = digits.slice(-4)
  const username = codigoDistribuidor
  return { username, password }
}

async function isCodigoUnico(codigo) {
  if (codigo === 'admin' || codigo === 'test') return false
  if (supabase) {
    const { data } = await supabase.from('users').select('id').eq('codigo_distribuidor', codigo).maybeSingle()
    if (data) return false
  }
  const users = loadMockUsers()
  if (users.some(u => u.codigo_distribuidor === codigo)) return false
  return true
}

export async function registerUser(userData) {
  const { username, password } = generateCredentials(userData.codigo_distribuidor)
  const unico = await isCodigoUnico(userData.codigo_distribuidor)
  if (!unico) throw new Error('El código de distribuidor ya está registrado.')
  if (!supabase) {
    const newUser = { id: 'u' + Date.now(), ...userData, role: 'client', username, password }
    const users = loadMockUsers()
    users.push(newUser)
    saveMockUsers(users)
    return newUser
  }
  const { data: user, error } = await supabase.from('users').insert([{
    nombre_completo: userData.nombre_completo,
    rut: userData.numero_carnet,
    codigo_distribuidor: userData.codigo_distribuidor,
    pais: userData.pais,
    numero_carnet: userData.numero_carnet,
    direccion: userData.direccion,
    role: 'client',
    username,
    password,
  }]).select().single()
  if (error) throw error
  return user
}

export async function deleteUser(userId) {
  if (!supabase) {
    const users = loadMockUsers().filter(u => u.id !== userId)
    saveMockUsers(users)
    return
  }
  const { error } = await supabase.from('users').delete().eq('id', userId)
  if (error) throw error
}

export async function getAllMockUsers() {
  if (!supabase) return loadMockUsers()
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data
}

export { generateCredentials }
