import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/userService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

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

  const paisActual = PAISES.find(p => p.value === form.pais)

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
    <div className="max-w-sm mx-auto mt-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Registro</h1>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
            <input type="text" name="nombre_completo" value={form.nombre_completo} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <select name="pais" value={form.pais} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required>
              <option value="">Selecciona tu país</option>
              {PAISES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Carnet de Identidad {paisActual ? `(${paisActual.carnetLabel})` : ''}
            </label>
            <input type="text" name="numero_carnet" value={form.numero_carnet} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required
              placeholder={paisActual ? `Ej: ${paisActual.ejemplo} (${paisActual.carnetLabel})` : 'Selecciona un país primero'} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código de Distribuidor</label>
            <input type="text" name="codigo_distribuidor" value={form.codigo_distribuidor} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required />
          </div>

          <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 space-y-1">
            <p>Tu código de usuario será: <span className="font-mono font-bold text-gray-800">{form.codigo_distribuidor || '—'}</span></p>
            <p>Tu contraseña será: <span className="font-mono font-bold text-gray-800">{passwordPreview || '—'}</span> (últimos 4 dígitos de tu código)</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-dxn-red hover:underline">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  )
}
