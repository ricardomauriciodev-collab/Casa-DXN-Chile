import { useState, useEffect } from 'react'
import { getUsers, deleteUser } from '../../services/userService'
import Button from '../ui/Button'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    getUsers().then(setUsers)
  }, [refresh])

  async function handleDelete(id) {
    await deleteUser(id)
    setRefresh(r => r + 1)
  }

  if (users.length === 0) return <p className="text-gray-500">No hay usuarios registrados.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">RUT</th>
            <th className="p-2">Código Distribuidor</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{u.nombre_completo}</td>
              <td className="p-2">{u.rut}</td>
              <td className="p-2">{u.codigo_distribuidor || '-'}</td>
              <td className="p-2">
                <Button variant="danger" onClick={() => handleDelete(u.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
