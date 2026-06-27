import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-dxn-red mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
      <Link to="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}
