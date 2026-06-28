const STORAGE_KEY = 'dxn_users'

const SEED_USERS = [
  { id: 'u1', nombre_completo: 'Juan Pérez', rut: '12.345.678-9', codigo_distribuidor: 'DXN-100', direccion: 'Av. Providencia 123', role: 'client' },
  { id: 'u2', nombre_completo: 'María González', rut: '23.456.789-0', codigo_distribuidor: 'DXN-200', direccion: 'Calle Central 456', role: 'client' },
]

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const copy = SEED_USERS.map(u => ({ ...u }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy))
  return copy
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function getUsers() {
  return [...loadUsers()]
}

function generateCredentials(rut, nombreCompleto) {
  const numbers = rut.split('-')[0].replace(/\D/g, '')
  const password = numbers.slice(-4)
  const username = nombreCompleto.toLowerCase().replace(/\s+/g, '')
  return { username, password }
}

export function registerUser(userData) {
  const { username, password } = generateCredentials(userData.rut, userData.nombre_completo)
  const newUser = { id: 'u' + Date.now(), ...userData, role: 'client', username, password }
  const users = loadUsers()
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function deleteUser(userId) {
  const users = loadUsers().filter(u => u.id !== userId)
  saveUsers(users)
}

export function getAllMockUsers() {
  return loadUsers()
}

export { generateCredentials }
