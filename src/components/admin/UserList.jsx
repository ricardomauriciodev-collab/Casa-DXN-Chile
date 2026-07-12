import { useState, useEffect } from 'react'
import { getUsers, deleteUser } from '../../services/userService'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null, userName: '' })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [refresh])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUser(deleteModal.userId)
      setRefresh((r) => r + 1)
      setDeleteModal({ open: false, userId: null, userName: '' })
    } catch (err) {
      alert('Error al eliminar: ' + (err.message || 'desconocido'))
    }
    setDeleting(false)
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">Cargando usuarios...</p>
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No hay usuarios registrados.</p>
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">
        Usuarios <span className="text-sm font-normal text-muted-foreground">({users.length})</span>
      </h2>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-muted text-left">
              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nombre</th>
              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">País</th>
              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Carnet</th>
              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Código Dist.</th>
              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Rol</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-surface-muted/50 transition-colors">
                <td className="p-3 font-medium text-foreground">{u.nombre_completo}</td>
                <td className="p-3 text-muted-foreground">{u.pais || '-'}</td>
                <td className="p-3 text-muted-foreground font-mono text-xs">{u.numero_carnet || u.rut || '-'}</td>
                <td className="p-3 text-muted-foreground font-mono">{u.codigo_distribuidor || '-'}</td>
                <td className="p-3">
                  <Badge variant={u.role === 'admin' ? 'accent' : 'neutral'}>{u.role || 'client'}</Badge>
                </td>
                <td className="p-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteModal({ open: true, userId: u.id, userName: u.nombre_completo })}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden flex flex-col gap-3">
        {users.map((u) => (
          <div key={u.id} className="bg-surface-muted rounded-lg border border-border p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="font-medium text-foreground text-sm">{u.nombre_completo}</span>
              <Badge variant={u.role === 'admin' ? 'accent' : 'neutral'}>{u.role || 'client'}</Badge>
            </div>
            <div className="text-xs text-muted-foreground flex flex-col gap-1">
              <span>País: {u.pais || '-'}</span>
              <span className="font-mono">{u.numero_carnet || u.rut || '-'}</span>
              <span className="font-mono">Código: {u.codigo_distribuidor || '-'}</span>
            </div>
            <div className="mt-1">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModal({ open: true, userId: u.id, userName: u.nombre_completo })}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, userId: null, userName: '' })}
        title="Eliminar usuario"
        size="sm"
      >
        <p className="text-sm text-muted-foreground mb-6">
          ¿Eliminar a <strong className="text-foreground">{deleteModal.userName}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, userId: null, userName: '' })}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Sí, eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
