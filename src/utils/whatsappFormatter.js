const OWNER_NUMBER = '56975716555'

function formatCLP(amount) {
  return '$' + amount.toLocaleString('es-CL')
}

export function generateWhatsAppLink(user, cart) {
  const lines = []
  lines.push(user.nombre_completo)
  lines.push(user.rut)
  lines.push(user.codigo_distribuidor || 'Sin código')
  lines.push(user.direccion)
  lines.push('-------------------')
  cart.forEach(item => {
    lines.push(`• ${item.quantity}x ${item.name}`)
  })
  lines.push('-------------------')
  const totalCLP = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalPV = cart.reduce((sum, item) => sum + item.pv * item.quantity, 0)
  lines.push(`Total: ${formatCLP(totalCLP)}`)
  lines.push(`Total PV: ${totalPV} PV`)

  const message = lines.join('\n')
  return `https://wa.me/${OWNER_NUMBER}?text=${encodeURIComponent(message)}`
}
