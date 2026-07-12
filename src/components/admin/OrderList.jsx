import { useState, useEffect } from 'react'
import { getOrders, approveOrder, rejectOrder } from '../../services/orderService'
import { deductStock } from '../../services/productService'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import Skeleton from '../ui/Skeleton'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const FILTERS = [
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'aprobado', label: 'Aprobados' },
  { key: 'todos', label: 'Todos' },
]

const STATUS_VARIANT = { pendiente: 'warning', aprobado: 'success' }
const STATUS_LABEL = { pendiente: 'Pendiente', aprobado: 'Aprobado' }

export default function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [filter, setFilter] = useState('pendiente')
  const [actionLoading, setActionLoading] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', orderId: null })

  useEffect(() => {
    setLoading(true)
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [refresh])

  async function handleApprove(orderId) {
    setActionLoading(orderId)
    const order = orders.find((o) => o.id === orderId)
    if (!order) { setActionLoading(null); return }

    for (const item of order.items) {
      const ok = await deductStock(item.product_id || item.id, item.quantity)
      if (!ok) {
        alert('Stock insuficiente para aprobar este pedido.')
        setActionLoading(null)
        return
      }
    }

    try {
      await approveOrder(orderId)
      setRefresh((r) => r + 1)
    } catch (err) {
      alert('Error al aprobar: ' + (err.message || 'desconocido'))
    }
    setActionLoading(null)
    setConfirmModal({ open: false, type: '', orderId: null })
  }

  async function handleReject(orderId) {
    setActionLoading(orderId)
    try {
      await rejectOrder(orderId)
      setRefresh((r) => r + 1)
    } catch (err) {
      alert('Error al rechazar: ' + (err.message || 'desconocido'))
    }
    setActionLoading(null)
    setConfirmModal({ open: false, type: '', orderId: null })
  }

  function openConfirm(type, orderId) {
    setConfirmModal({ open: true, type, orderId })
  }

  const filtered = orders.filter((o) => filter === 'todos' || o.status === filter)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-foreground">Pedidos</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x snap-mandatory" role="tablist" aria-label="Filtrar pedidos">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer snap-start shrink-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                ${filter === f.key
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-surface-muted text-muted-foreground hover:bg-border/60'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-border p-4">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60 mb-3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No hay pedidos {filter !== 'todos' ? filter : ''}.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((o) => (
            <div
              key={o.id}
              className={`bg-surface rounded-lg border p-4 transition-all ${
                o.status === 'pendiente' ? 'border-l-4 border-l-warning' : 'border-l-4 border-l-success'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm md:text-base text-foreground">{o.user_name}</p>
                    <Badge variant={STATUS_VARIANT[o.status]}>
                      {STATUS_LABEL[o.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(o.created_at)}</p>
                  <p className="text-xs text-subtle-foreground mt-1 font-mono">#{o.id.slice(0, 8)}</p>

                  {/* Desktop: items inline */}
                  <ul className="hidden md:block mt-2 space-y-1">
                    {o.items.map((item, i) => (
                      <li key={i} className="text-sm flex justify-between gap-2">
                        <span className="line-clamp-1 text-foreground">{item.quantity}x {item.name}</span>
                        <span className="text-muted-foreground shrink-0 font-mono">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 pt-2 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                    <span className="text-foreground font-mono">${o.total_clp.toLocaleString('es-CL')}</span>
                    <span className="text-muted-foreground font-mono">{Math.round(o.total_pv * 100) / 100} PV</span>
                  </div>

                  {o.status === 'aprobado' && o.approved_at && (
                    <p className="text-xs text-success font-medium mt-2">Aprobado el {formatDate(o.approved_at)}</p>
                  )}
                </div>

                {o.status === 'pendiente' && (
                  <div className="flex gap-2 shrink-0 sm:ml-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openConfirm('approve', o.id)}
                      disabled={actionLoading === o.id}
                      loading={actionLoading === o.id}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openConfirm('reject', o.id)}
                      disabled={actionLoading === o.id}
                      loading={actionLoading === o.id}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: '', orderId: null })}
        title={confirmModal.type === 'approve' ? 'Aprobar pedido' : 'Rechazar pedido'}
        size="sm"
      >
        <p className="text-sm text-muted-foreground mb-6">
          {confirmModal.type === 'approve'
            ? '¿Aprobar este pedido? Se descontará el stock de cada producto.'
            : '¿Rechazar y eliminar este pedido permanentemente? Esta acción no se puede deshacer.'}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setConfirmModal({ open: false, type: '', orderId: null })}>
            Cancelar
          </Button>
          <Button
            variant={confirmModal.type === 'approve' ? 'primary' : 'danger'}
            onClick={() =>
              confirmModal.type === 'approve'
                ? handleApprove(confirmModal.orderId)
                : handleReject(confirmModal.orderId)
            }
            loading={actionLoading === confirmModal.orderId}
          >
            {confirmModal.type === 'approve' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
