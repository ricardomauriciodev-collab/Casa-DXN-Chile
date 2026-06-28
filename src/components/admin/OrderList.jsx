import { useState, useEffect } from 'react'
import { getOrders, approveOrder, rejectOrder } from '../../services/orderService'
import { deductStock } from '../../services/productService'
import Button from '../ui/Button'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function OrderList() {
  const [orders, setOrders] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [filter, setFilter] = useState('pendiente')

  useEffect(() => {
    getOrders().then(setOrders)
  }, [refresh])

  async function handleApprove(orderId) {
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    for (const item of order.items) {
      const ok = await deductStock(item.product_id || item.id, item.quantity)
      if (!ok) {
        alert('Stock insuficiente para aprobar este pedido.')
        return
      }
    }
    await approveOrder(orderId)
    setRefresh(r => r + 1)
  }

  async function handleReject(orderId) {
    if (!confirm('¿Rechazar y eliminar este pedido permanentemente?')) return
    await rejectOrder(orderId)
    setRefresh(r => r + 1)
  }

  const filtered = orders.filter(o => filter === 'todos' || o.status === filter)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-lg font-bold">Pedidos</h2>
        <div className="flex gap-2 overflow-x-auto">
          {['pendiente', 'aprobado', 'todos'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1 rounded font-medium cursor-pointer transition shrink-0 ${
                filter === f ? 'bg-dxn-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="text-gray-500">No hay pedidos {filter !== 'todos' ? filter : ''}.</p>}

      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o.id} className={`bg-white border rounded-lg p-4 ${o.status === 'pendiente' ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-green-400'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base">{o.user_name}</p>
                <p className="text-xs text-gray-500">{formatDate(o.created_at)}</p>
                <p className="text-xs text-gray-400 mt-1">Pedido #{o.id.slice(0, 8)}</p>
                <ul className="mt-2 space-y-1">
                  {o.items.map((item, i) => (
                    <li key={i} className="text-xs md:text-sm flex justify-between gap-2">
                      <span className="truncate">{item.quantity}x {item.name}</span>
                      <span className="text-gray-500 shrink-0">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm font-semibold">
                  <span>Total: ${o.total_clp.toLocaleString('es-CL')}</span>
                  <span className="text-gray-500">{Math.round(o.total_pv * 100) / 100} PV</span>
                  <span className={`${o.status === 'pendiente' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {o.status === 'pendiente' ? 'Pendiente' : 'Aprobado'}
                  </span>
                </div>
              </div>
              {o.status === 'pendiente' && (
                <div className="flex gap-2 shrink-0 sm:ml-4">
                  <Button variant="primary" onClick={() => handleApprove(o.id)} className="text-xs px-3 py-1.5">APROBAR</Button>
                  <Button variant="danger" onClick={() => handleReject(o.id)} className="text-xs px-3 py-1.5">RECHAZAR</Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
