import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import WhatsAppFloat from '../components/ui/WhatsAppFloat'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Completa todos los campos.')
      return
    }
    const ok = await login(username, password)
    if (!ok) {
      setError('Credenciales inválidas.')
      return
    }
    navigate('/')
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Código de Distribuidor</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ingresa tu código"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Últimos 4 dígitos de tu código"
            />
          </div>
          <Button type="submit" className="w-full">Ingresar</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-dxn-red hover:underline">Regístrate</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-4 md:hidden">
          ¿No tienes código? Presiona el botón de WhatsApp flotante para obtener el tuyo
        </p>
      </Card>
      <WhatsAppFloat />
    </div>
  )
}
