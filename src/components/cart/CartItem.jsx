import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center justify-between border-b py-3">
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">${item.price.toLocaleString('es-CL')} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold cursor-pointer hover:bg-gray-300"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold cursor-pointer hover:bg-gray-300"
        >
          +
        </button>
        <span className="w-24 text-right font-semibold">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
        <button
          onClick={() => removeItem(item.id)}
          className="ml-2 text-red-500 hover:text-red-700 text-sm cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
