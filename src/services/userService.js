let MOCK_USERS = [
  { id: 'u1', nombre_completo: 'Juan Pérez', rut: '12.345.678-9', codigo_distribuidor: 'DXN-100', direccion: 'Av. Providencia 123', role: 'client' },
  { id: 'u2', nombre_completo: 'María González', rut: '23.456.789-0', codigo_distribuidor: 'DXN-200', direccion: 'Calle Central 456', role: 'client' },
]

export function getUsers() {
  return [...MOCK_USERS]
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
  MOCK_USERS.push(newUser)
  return newUser
}

export function deleteUser(userId) {
  MOCK_USERS = MOCK_USERS.filter(u => u.id !== userId)
}

export function getAllMockUsers() {
  return MOCK_USERS
}

export { generateCredentials }
