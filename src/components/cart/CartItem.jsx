import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-3 gap-2">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base truncate">{item.name}</h3>
        <p className="text-xs md:text-sm text-gray-500">${item.price.toLocaleString('es-CL')} c/u</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 md:w-8 md:h-8 rounded bg-gray-200 flex items-center justify-center font-bold cursor-pointer hover:bg-gray-300 text-sm"
          >
            -
          </button>
          <span className="w-7 md:w-8 text-center font-semibold text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 md:w-8 md:h-8 rounded bg-gray-200 flex items-center justify-center font-bold cursor-pointer hover:bg-gray-300 text-sm"
          >
            +
          </button>
        </div>
        <span className="w-20 md:w-24 text-right font-semibold text-sm md:text-base">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 text-xs md:text-sm cursor-pointer shrink-0"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
