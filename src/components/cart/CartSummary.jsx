import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { generateWhatsAppLink } from '../../utils/whatsappFormatter'
import { createOrder } from '../../services/orderService'
import Button from '../ui/Button'

export default function CartSummary() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleWhatsApp() {
    if (!user) return
    setError('')
    setSending(true)
    try {
      const link = generateWhatsAppLink(user, items)
      const win = window.open(link, '_blank')
      if (!win) {
        setError('Tu navegador bloqueó el popup. Habilita popups para enviar el pedido.')
        setSending(false)
        return
      }
      await createOrder(user.id, user.nombre_completo, items)
      clearCart()
      navigate('/')
    } catch (err) {
      setError('No se pudo registrar el pedido. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="mt-4 flex flex-col gap-3">
      {error && (
        <div role="alert" className="px-4 py-3 rounded-md bg-danger-soft border border-danger/20 text-sm text-danger flex items-start gap-2">
          <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {error}
        </div>
      )}
      <Button variant="whatsapp" onClick={handleWhatsApp} size="lg" className="w-full" loading={sending}>
        {!sending && (
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
          </svg>
        )}
        Enviar pedido por WhatsApp
      </Button>
    </div>
  )
}
