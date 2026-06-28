import { useState, useEffect } from 'react'
import { getProducts, getProductStatus, getProductStatusLabel } from '../services/productService'
import { useCart } from '../context/CartContext'
import Card from '../components/ui/Card'

function StatusBadge({ status }) {
  const colors = {
    disponible: 'bg-green-100 text-green-700 border-green-300',
    poco_stock: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    fuera_stock: 'bg-red-100 text-red-700 border-red-300',
  }
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors[status] || colors.fuera_stock}`}>
      {getProductStatusLabel(status)}
    </span>
  )
}

export default function Catalog() {
  const [products, setProducts] = useState([])
  const { items, addItem, updateQuantity, removeItem } = useCart()

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  function getItemQuantity(productId) {
    const item = items.find(i => i.id === productId)
    return item ? item.quantity : 0
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => {
          const qty = getItemQuantity(p.id)
          const status = getProductStatus(p)
          return (
            <Card key={p.id}>
              <div className="aspect-[4/3] bg-white flex items-center justify-center text-gray-300">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-2" loading="lazy" />
                  : (
                    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                }
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-bold text-lg leading-tight">{p.name}</h2>
                <div className="flex justify-between items-center">
                  <span className="text-dxn-red font-bold text-2xl">${p.price.toLocaleString('es-CL')}</span>
                  <span className="text-sm text-gray-400">{p.pv} PV</span>
                </div>
                <StatusBadge status={status} />
                <div className="flex items-center justify-center gap-2 pt-1">
                  {status === 'fuera_stock' ? (
                    <span className="text-sm text-red-500 font-medium">No disponible</span>
                  ) : qty === 0 ? (
                    <button
                      onClick={() => addItem(p)}
                      className="bg-dxn-red text-white px-6 py-2 rounded font-semibold hover:bg-dxn-red-dark active:scale-[0.97] transition-all cursor-pointer"
                    >
                      Agregar
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(p.id, qty - 1)}
                        className="w-9 h-9 rounded bg-gray-200 flex items-center justify-center font-bold hover:bg-gray-300 active:scale-[0.92] transition-all cursor-pointer text-lg"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-lg">{qty}</span>
                      <button
                        onClick={() => addItem(p)}
                        className="w-9 h-9 rounded bg-gray-200 flex items-center justify-center font-bold hover:bg-gray-300 active:scale-[0.92] transition-all cursor-pointer text-lg"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
