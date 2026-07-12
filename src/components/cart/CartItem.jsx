import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border py-4 last:border-b-0 animate-fade-in">
      {/* Miniatura */}
      <div className="size-16 shrink-0 rounded-md bg-white border border-border overflow-hidden flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url} alt="" className="size-full object-contain p-1" loading="lazy" />
        ) : (
          <span className="text-xl font-bold text-accent/60 select-none" aria-hidden="true">
            {(item.name || '?').charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Nombre + precio unitario */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2">{item.name}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 font-mono">
          ${item.price.toLocaleString('es-CL')} c/u · {item.pv} PV
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label={`Disminuir ${item.name}`}
            className="size-9 rounded-md bg-surface-muted border border-border flex items-center justify-center
              text-foreground hover:bg-border/60 active:scale-95 transition-all cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M4 10h12v1H4z" />
            </svg>
          </button>
          <span className="min-w-9 text-center font-bold text-base font-mono" aria-label={`Cantidad ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={`Aumentar ${item.name}`}
            className="size-9 rounded-md bg-surface-muted border border-border flex items-center justify-center
              text-foreground hover:bg-border/60 active:scale-95 transition-all cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9 9V4h1v5h5v1h-5v5H9v-5H4V9z" />
            </svg>
          </button>
        </div>
        <span className="w-20 md:w-24 text-right font-semibold text-sm md:text-base font-mono text-foreground">
          ${(item.price * item.quantity).toLocaleString('es-CL')}
        </span>
        <button
          onClick={() => removeItem(item.id)}
          aria-label={`Eliminar ${item.name}`}
          className="size-9 flex items-center justify-center text-muted-foreground
            hover:text-danger hover:bg-danger-soft rounded-md transition-all cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
