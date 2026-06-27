import { useState } from 'react'
import UserList from '../components/admin/UserList'
import InventoryTable from '../components/admin/InventoryTable'
import OrderList from '../components/admin/OrderList'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const TABS = [
  { key: 'users', label: 'Usuarios' },
  { key: 'inventory', label: 'Inventario' },
  { key: 'orders', label: 'Pedidos Pendientes' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const { isAdmin } = useAuth()

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>
      <div className="flex gap-2 mb-6 border-b">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm cursor-pointer border-b-2 transition ${
              activeTab === tab.key
                ? 'border-dxn-red text-dxn-red'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'inventory' && <InventoryTable />}
        {activeTab === 'orders' && <OrderList />}
      </div>
    </div>
  )
}
