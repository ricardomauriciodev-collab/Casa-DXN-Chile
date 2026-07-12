import { useState, useEffect } from 'react'
import { getProducts, getProductStatus, getProductStatusLabel } from '../services/productService'
import { useCart } from '../context/CartContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

const STATUS_VARIANT = {
  disponible: 'success',
  poco_stock: 'warning',
  fuera_stock: 'danger',
}

function ProductPlaceholder({ name }) {
  const initial = (name || '?').charAt(0).toUpperCase()
  return (
    <div className="size-full flex items-center justify-center bg-white">
      <span className="text-5xl font-bold text-accent select-none" aria-hidden="true">
        {initial}
      </span>
    </div>
  )
}

function StatusBadge({ status }) {
  const variant = STATUS_VARIANT[status] || STATUS_VARIANT.fuera_stock
  return (
    <Badge variant={variant}>{getProductStatusLabel(status)}</Badge>
  )
}

function ProductCard({ p, qty, onAdd, onUpdateQty }) {
  const status = getProductStatus(p)

  return (
    <Card interactive className="group flex flex-col">
      <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-border">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className="size-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <ProductPlaceholder name={p.name} />
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 flex-1">
        <h2 className="font-semibold text-base leading-snug text-foreground line-clamp-2 min-h-10">
          {p.name}
        </h2>
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
              ${p.price.toLocaleString('es-CL')}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-surface-muted text-muted-foreground font-mono">
              {p.pv} PV
            </span>
          </div>
          <div className="h-11">
            {status === 'fuera_stock' ? (
              <span className="text-sm text-danger font-medium flex items-center justify-center h-full">
                No disponible
              </span>
            ) : qty === 0 ? (
              <button
                onClick={() => onAdd(p)}
                className="w-full h-10 bg-accent text-accent-foreground rounded-md font-semibold transition-all
                  hover:bg-dxn-red-dark active:scale-[0.97] focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset cursor-pointer"
              >
                Agregar
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => onUpdateQty(p.id, qty - 1)}
                  aria-label="Disminuir cantidad"
                  className="size-10 rounded-md bg-surface-muted border border-border flex items-center justify-center font-bold
                    hover:bg-border/60 active:scale-95 transition-all cursor-pointer text-base text-foreground
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M4 10h12v1H4z" />
                  </svg>
                </button>
                <span
                  className="min-w-10 text-center font-bold text-lg font-mono"
                  aria-label={`Cantidad ${qty}`}
                >
                  {qty}
                </span>
                <button
                  onClick={() => onAdd(p)}
                  aria-label="Incrementar cantidad"
                  className="size-10 rounded-md bg-surface-muted border border-border flex items-center justify-center font-bold
                    hover:bg-border/60 active:scale-95 transition-all cursor-pointer text-base text-foreground
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9 9V4h1v5h5v1h-5v5H9v-5H4V9z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton rounded="none" className="aspect-[4/3] w-full" />
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { items, addItem, updateQuantity } = useCart()

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  function getItemQuantity(productId) {
    const item = items.find((i) => i.id === productId)
    return item ? item.quantity : 0
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Catálogo de Productos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explora nuestra selección y arma tu pedido.
        </p>
      </div>

      {loading ? (
        <CatalogSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto size-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
            <svg className="size-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Sin productos</h2>
          <p className="text-sm text-muted-foreground">Vuelve pronto, estamos actualizando el catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              qty={getItemQuantity(p.id)}
              onAdd={addItem}
              onUpdateQty={updateQuantity}
            />
          ))}
        </div>
      )}
    </div>
  )
}
