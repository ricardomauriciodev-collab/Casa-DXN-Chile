import { useState, useEffect, useMemo } from 'react'
import { getUsers } from '../../services/userService'
import { getMonthlyApprovedPV, setUserStars, resetAllStars } from '../../services/starService'
import { clampStars } from '../../utils/stars'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import StarRating from '../ui/StarRating'

const STEP = 0.5
const MAX_STARS = 5

export default function StarsManager() {
  const [users, setUsers] = useState([])
  const [monthPV, setMonthPV] = useState({})
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState({})
  const [savingId, setSavingId] = useState(null)
  const [resetModal, setResetModal] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getUsers()
      .then(async (all) => {
        if (cancelled) return
        const entries = await Promise.all(
          all.map(async (u) => [u.id, await getMonthlyApprovedPV(u.id)])
        )
        if (cancelled) return
        setUsers(all)
        setMonthPV(Object.fromEntries(entries))
      })
      .catch((err) => alert('Error al cargar usuarios: ' + (err.message || 'desconocido')))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [refresh])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        (u.nombre_completo || '').toLowerCase().includes(q) ||
        (u.codigo_distribuidor || '').toLowerCase().includes(q)
    )
  }, [users, search])

  function draftValue(u) {
    return drafts[u.id] !== undefined ? drafts[u.id] : Number(u.stars) || 0
  }

  function setDraft(id, value) {
    setDrafts((d) => ({ ...d, [id]: clampStars(value) }))
  }

  async function handleSave(user) {
    setSavingId(user.id)
    try {
      await setUserStars(user.id, draftValue(user))
      setDrafts((d) => {
        const next = { ...d }
        delete next[user.id]
        return next
      })
      setRefresh((r) => r + 1)
    } catch (err) {
      alert('Error al guardar estrellas: ' + (err.message || 'desconocido'))
    }
    setSavingId(null)
  }

  async function handleReset() {
    setResetting(true)
    try {
      await resetAllStars()
      setDrafts({})
      setResetModal(false)
      setRefresh((r) => r + 1)
    } catch (err) {
      alert('Error al resetear estrellas: ' + (err.message || 'desconocido'))
    }
    setResetting(false)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-foreground">Estrellas</h2>
        <Button variant="danger" size="sm" onClick={() => setResetModal(true)}>
          Resetear todas las estrellas
        </Button>
      </div>

      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-subtle-foreground" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o código DXN..."
          className="w-full h-11 rounded-md border border-border-strong bg-surface pl-9 pr-3.5 text-sm text-foreground placeholder:text-subtle-foreground
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 focus-visible:border-accent transition-colors"
          aria-label="Buscar usuarios"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-4">Cargando estrellas...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {users.length === 0 ? 'No hay usuarios registrados.' : 'Sin resultados para la búsqueda.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((u) => {
            const value = draftValue(u)
            const isDraft = drafts[u.id] !== undefined
            return (
              <div
                key={u.id}
                className="bg-surface rounded-lg border border-border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm md:text-base text-foreground truncate">{u.nombre_completo}</p>
                    <Badge variant="neutral">{u.codigo_distribuidor || 'Sin código'}</Badge>
                    {u.role === 'admin' && <Badge variant="accent">admin</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    PV aprobados este mes: <span className="font-mono">{Number(monthPV[u.id]) || 0} PV</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft(u.id, value - STEP)}
                      className="size-8 rounded-md border border-border text-foreground font-bold hover:bg-surface-muted cursor-pointer disabled:opacity-40"
                      disabled={value <= 0 || savingId === u.id}
                      aria-label="Quitar media estrella"
                    >
                      −
                    </button>
                    <div className="flex flex-col items-center gap-0.5 min-w-28">
                      <StarRating value={value} size="size-4" />
                      <span className="text-xs font-semibold text-muted-foreground">{value} / {MAX_STARS}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft(u.id, value + STEP)}
                      className="size-8 rounded-md border border-border text-foreground font-bold hover:bg-surface-muted cursor-pointer disabled:opacity-40"
                      disabled={value >= MAX_STARS || savingId === u.id}
                      aria-label="Agregar media estrella"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSave(u)}
                    loading={savingId === u.id}
                    disabled={savingId === u.id || !isDraft}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={resetModal}
        onClose={() => setResetModal(false)}
        title="Resetear estrellas"
        size="sm"
      >
        <p className="text-sm text-muted-foreground mb-6">
          ¿Resetear las estrellas de <strong className="text-foreground">todos los usuarios</strong> a 0? Útil al cerrar el mes para el canje de premios. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setResetModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleReset} loading={resetting}>
            Sí, resetear todo
          </Button>
        </div>
      </Modal>
    </div>
  )
}