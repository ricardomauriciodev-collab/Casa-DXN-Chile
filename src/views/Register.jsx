import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/userService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function formatRUT(value) {
  const digits = value.replace(/[^\dKk]/g, '').slice(0, 9)
  if (digits.length <= 1) return digits
  const dv = digits.slice(-1)
  const nums = digits.slice(0, -1)
  const parts = []
  for (let i = nums.length; i > 0; i -= 3) {
    parts.unshift(nums.slice(Math.max(0, i - 3), i))
  }
  return parts.join('.') + '-' + dv
}

export default function Register() {
  const [form, setForm] = useState({ nombre_completo: '', rut: '', codigo_distribuidor: '', direccion: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'rut') {
      setForm({ ...form, rut: formatRUT(value) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  function getGeneratedPassword(rut) {
    const numbers = rut.split('-')[0]?.replace(/\D/g, '') || ''
    return numbers.slice(-4)
  }

  function getGeneratedUsername(nombre) {
    return nombre.toLowerCase().replace(/\s+/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.nombre_completo || !form.rut || !form.codigo_distribuidor || !form.direccion) {
      setError('Todos los campos son obligatorios.')
      return
    }
    await registerUser(form)
    navigate('/login')
  }

  const passwordPreview = getGeneratedPassword(form.rut)
  const usernamePreview = getGeneratedUsername(form.nombre_completo)

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
            <label className="block text-sm font-medium mb-1">RUT</label>
            <input type="text" name="rut" value={form.rut} onChange={handleChange}
              className="w-full border rounded px-3 py-2" required placeholder="12.345.678-9" />
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
            <p>Tu usuario será: <span className="font-mono font-bold text-gray-800">{usernamePreview || '—'}</span></p>
            <p>Tu contraseña será: <span className="font-mono font-bold text-gray-800">{passwordPreview || '—'}</span></p>
          </div>

          <Button type="submit" className="w-full">Registrarse</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-dxn-red hover:underline">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  )
}
