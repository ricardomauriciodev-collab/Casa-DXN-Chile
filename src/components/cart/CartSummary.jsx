import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { generateWhatsAppLink } from '../../utils/whatsappFormatter'
import { createOrder } from '../../services/orderService'
import Button from '../ui/Button'

export default function CartSummary() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()

  function handleWhatsApp() {
    if (!user) return
    createOrder(user.id, user.nombre_completo, items)
    const link = generateWhatsAppLink(user, items)
    window.open(link, '_blank')
    clearCart()
  }

  if (items.length === 0) return null

  return (
    <div className="mt-4">
      <Button variant="whatsapp" onClick={handleWhatsApp} className="w-full">
        Enviar pedido por WhatsApp
      </Button>
    </div>
  )
}
