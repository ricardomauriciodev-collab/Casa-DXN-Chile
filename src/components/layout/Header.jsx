import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function PVProgressBar({ totalPV }) {
  const pct = Math.min((totalPV / 100) * 100, 100)
  function textColor(pct) {
    if (pct >= 100) return 'text-green-400'
    if (pct >= 30) return 'text-green-500'
    if (pct > 0) return 'text-yellow-300'
    return 'text-white'
  }
  return (
    <div className="flex flex-col items-center gap-0.5 text-xs w-72">
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${pct >= 100 ? 'bg-green-400' : pct >= 30 ? 'bg-green-500' : 'bg-white/40'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-bold ${textColor(pct)} transition-colors duration-300`}>
        {totalPV} PV
      </span>
      {totalPV >= 100 && <span className="bg-green-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">100 PV</span>}
      {totalPV >= 30 && totalPV < 100 && <span className="bg-green-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">30 PV</span>}
    </div>
  )
}

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const { totalPV, itemCount } = useCart()
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <header className="bg-dxn-red text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Casa DXN Chile
          </Link>
        </div>
        {!isLoginPage && (
          <div className="justify-self-center">
            <PVProgressBar totalPV={totalPV} />
          </div>
        )}
        <div className="justify-self-end">
          {isLoginPage ? (
            <Link to="/" className="bg-white text-dxn-red px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100">
              Volver al Catálogo
            </Link>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="hover:underline">Catálogo</Link>
              <Link to="/cart" className="hover:underline relative">
                Carrito
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-white text-dxn-red text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {isAdmin && <Link to="/admin" className="hover:underline font-semibold">Admin</Link>}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-white/80 text-xs">{user.nombre_completo}</span>
                  <button onClick={logout} className="bg-white text-dxn-red px-3 py-1 rounded text-xs font-semibold cursor-pointer hover:bg-gray-100">
                    Salir
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-white text-dxn-red px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
