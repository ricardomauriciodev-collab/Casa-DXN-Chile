import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Catalog from './views/Catalog'
import Login from './views/Login'
import Register from './views/Register'
import Cart from './views/Cart'
import AdminDashboard from './views/AdminDashboard'
import NotFound from './views/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
