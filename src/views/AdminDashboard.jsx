import { useState } from 'react'
import UserList from '../components/admin/UserList'
import InventoryTable from '../components/admin/InventoryTable'
import OrderList from '../components/admin/OrderList'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const TABS = [
  { key: 'users', label: 'Usuarios' },
  { key: 'inventory', label: 'Inventario' },
  { key: 'orders', label: 'Pedidos' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const { isAdmin } = useAuth()

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6">
        Panel de Administración
      </h1>

      <div role="tablist" aria-label="Secciones de administración" className="flex gap-1 mb-6 border-b border-border overflow-x-auto snap-x snap-mandatory scroll-pl-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap snap-start transition-colors cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shrink-0
              ${activeTab === tab.key
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute inset-x-2 bottom-0 h-0.5 bg-accent rounded-full" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <Card variant="elevated" className="p-4 md:p-6">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'inventory' && <InventoryTable />}
        {activeTab === 'orders' && <OrderList />}
      </Card>
    </div>
  )
}
