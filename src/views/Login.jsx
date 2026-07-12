import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import WhatsAppFloat from '../components/ui/WhatsAppFloat'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      const ok = await login(username, password)
      if (!ok) {
        setError('Credenciales inválidas. Verifica tu código y contraseña.')
        return
      }
      navigate('/')
    } catch (err) {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80dvh] flex items-center justify-center py-10 animate-fade-in">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Iniciar Sesión</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa con tu código de distribuidor para hacer pedidos.
            </p>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-md bg-danger-soft border border-danger/20 text-sm text-danger flex items-start gap-2"
            >
              <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Código de Distribuidor"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: 12345"
              autoComplete="username"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Últimos 4 dígitos"
              autoComplete="current-password"
              required
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Ingresar
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Regístrate
            </Link>
          </p>
          <p className="text-center text-xs text-subtle-foreground mt-3 md:hidden">
            ¿No tienes código? Toca el botón de WhatsApp para obtener el tuyo.
          </p>
        </Card>
        <WhatsAppFloat />
      </div>
    </div>
  )
}
