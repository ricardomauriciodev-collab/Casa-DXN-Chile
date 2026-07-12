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
      <div className="min-h-[60dvh] flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-sm">
          <div className="mx-auto size-20 rounded-full bg-surface-muted flex items-center justify-center mb-5">
            <svg className="size-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13l-1.4-7m0 0a2 2 0 00-1.96-1.6H3.5M7 13l1.4 7m0 0H8m2-13l1.4 7m1.4-7l1.4 7m0 0H9m8.5-5.5l1.4 7m-.4-2a2 2 0 011.96 1.6L21 20H8" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Tu carrito está vacío</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Agrega productos desde el catálogo y luego envíanos tu pedido.
          </p>
          <Link to="/">
            <Button size="lg">Ir al Catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Tu Carrito</h1>
        <Button variant="danger" size="sm" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <Card className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="px-4 md:px-6">
                <CartItem item={item} />
              </div>
            ))}
          </Card>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="md:sticky md:top-28 flex flex-col gap-4">
            <Card variant="elevated" className="p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Resumen</h2>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Total CLP</span>
                <span className="font-bold text-lg font-mono text-foreground">
                  ${totalCLP.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Total PV</span>
                <span className="font-semibold text-base font-mono text-foreground">
                  {totalPV} PV
                </span>
              </div>
              {user && <CartSummary />}
              {!user && (
                <div className="mt-4 px-4 py-3 rounded-md bg-warning-soft border border-warning/20 text-center">
                  <p className="text-sm text-warning font-medium">
                    Inicia sesión para enviar tu pedido.
                  </p>
                  <Link to="/login" className="mt-2 inline-block">
                    <Button variant="outline" size="sm">
                      Iniciar Sesión
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
