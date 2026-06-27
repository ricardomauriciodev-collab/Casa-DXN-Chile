import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, totalCLP, totalPV, clearCart } = useCart()
  const { user } = useAuth()

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Carrito Vacío</h1>
        <p className="text-gray-500 mb-6">Agrega productos desde el catálogo.</p>
        <Link to="/">
          <Button>Ir al Catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tu Carrito</h1>
        <Button variant="danger" onClick={clearCart}>Vaciar carrito</Button>
      </div>
      <Card className="p-4">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </Card>
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-lg">${totalCLP.toLocaleString('es-CL')}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Total PV:</span>
          <span>{totalPV} PV</span>
        </div>
      </div>
      {user && <CartSummary />}
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-center">
          <p className="text-yellow-800">Inicia sesión para enviar tu pedido.</p>
          <Link to="/login">
            <Button variant="outline" className="mt-2">Iniciar Sesión</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
