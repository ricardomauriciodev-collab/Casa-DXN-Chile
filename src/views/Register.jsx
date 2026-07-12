import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/userService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const PAISES = [
  { value: 'Argentina', label: 'Argentina', carnetLabel: 'DNI', ejemplo: '12345678' },
  { value: 'Bolivia', label: 'Bolivia', carnetLabel: 'CI', ejemplo: '1234567' },
  { value: 'Brasil', label: 'Brasil', carnetLabel: 'CPF', ejemplo: '123.456.789-00' },
  { value: 'Chile', label: 'Chile', carnetLabel: 'RUT', ejemplo: '12.345.678-5' },
  { value: 'Colombia', label: 'Colombia', carnetLabel: 'CC', ejemplo: '1.234.567.890' },
  { value: 'Costa Rica', label: 'Costa Rica', carnetLabel: 'Cédula', ejemplo: '1-2345-6789' },
  { value: 'Cuba', label: 'Cuba', carnetLabel: 'CI', ejemplo: '12345678901' },
  { value: 'Ecuador', label: 'Ecuador', carnetLabel: 'CI', ejemplo: '1234567890' },
  { value: 'El Salvador', label: 'El Salvador', carnetLabel: 'DUI', ejemplo: '12345678-9' },
  { value: 'Guatemala', label: 'Guatemala', carnetLabel: 'DPI', ejemplo: '1234 56789 0101' },
  { value: 'Haití', label: 'Haití', carnetLabel: 'NIF', ejemplo: '123-456-789' },
  { value: 'Honduras', label: 'Honduras', carnetLabel: 'DN', ejemplo: '0801-2000-123456' },
  { value: 'México', label: 'México', carnetLabel: 'CURP', ejemplo: 'ABCD123456HDFLNM01' },
  { value: 'Nicaragua', label: 'Nicaragua', carnetLabel: 'Cédula', ejemplo: '001-123-4567890A' },
  { value: 'Panamá', label: 'Panamá', carnetLabel: 'Cédula', ejemplo: '8-123-456' },
  { value: 'Paraguay', label: 'Paraguay', carnetLabel: 'CI', ejemplo: '1.234.567' },
  { value: 'Perú', label: 'Perú', carnetLabel: 'DNI', ejemplo: '12345678' },
  { value: 'República Dominicana', label: 'República Dominicana', carnetLabel: 'Cédula', ejemplo: '001-1234567-8' },
  { value: 'Uruguay', label: 'Uruguay', carnetLabel: 'CI', ejemplo: '1.234.567-8' },
  { value: 'Venezuela', label: 'Venezuela', carnetLabel: 'CI', ejemplo: 'V-12.345.678' },
]

export default function Register() {
  const [form, setForm] = useState({ nombre_completo: '', pais: '', numero_carnet: '', codigo_distribuidor: '', direccion: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const paisActual = PAISES.find((p) => p.value === form.pais)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function getPasswordPreview(codigo) {
    const digits = (codigo || '').replace(/\D/g, '')
    return digits.slice(-4)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.nombre_completo || !form.pais || !form.numero_carnet || !form.codigo_distribuidor || !form.direccion) {
      setError('Todos los campos son obligatorios.')
      return
    }
    setLoading(true)
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Error al registrar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const passwordPreview = getPasswordPreview(form.codigo_distribuidor)

  return (
    <div className="min-h-[80dvh] flex items-center justify-center py-10 animate-fade-in">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Crear Cuenta</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Regístrate como distribuidor DXN.
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
              label="Nombre Completo"
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pais" className="text-sm font-medium text-foreground">
                País<span className="text-accent ml-0.5" aria-hidden="true">*</span>
              </label>
              <select
                id="pais"
                name="pais"
                value={form.pais}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-md border border-border-strong bg-surface px-3.5 text-sm text-foreground
                  focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20 focus-visible:outline-none
                  transition-colors"
              >
                <option value="">Selecciona tu país</option>
                {PAISES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <Input
              label={`Número de Carnet ${paisActual ? `(${paisActual.carnetLabel})` : ''}`}
              type="text"
              name="numero_carnet"
              value={form.numero_carnet}
              onChange={handleChange}
              placeholder={paisActual ? `Ej: ${paisActual.ejemplo}` : 'Selecciona un país primero'}
              required
            />
            <Input
              label="Código de Distribuidor"
              type="text"
              name="codigo_distribuidor"
              value={form.codigo_distribuidor}
              onChange={handleChange}
              required
              helper="Tu usuario será este código y la contraseña los últimos 4 dígitos."
            />
            <Input
              label="Dirección"
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              autoComplete="street-address"
            />

            <div className="bg-accent-soft border border-accent/15 rounded-lg p-4 flex flex-col gap-1.5">
              <p className="text-sm text-foreground">
                Usuario: <span className="font-mono font-bold text-foreground">{form.codigo_distribuidor || '—'}</span>
              </p>
              <p className="text-sm text-foreground">
                Contraseña: <span className="font-mono font-bold text-foreground">{passwordPreview || '—'}</span>
                <span className="text-muted-foreground ml-1.5 text-xs">(últimos 4 dígitos)</span>
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
