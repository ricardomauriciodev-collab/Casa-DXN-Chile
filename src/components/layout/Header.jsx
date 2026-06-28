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
    <div className="flex items-center gap-2 flex-1 max-w-60 text-xs">
      <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${pct >= 100 ? 'bg-green-400' : pct >= 30 ? 'bg-green-500' : 'bg-white/40'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-bold whitespace-nowrap ${textColor(pct)} transition-colors duration-300`}>
        {totalPV} PV
      </span>
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
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="Casa DXN Chile" className="h-10 md:h-12" />
          </Link>
          {!isLoginPage && (
            <div className="hidden md:flex flex-1 justify-center">
              <PVProgressBar totalPV={totalPV} />
            </div>
          )}
          <div className="flex items-center gap-1 md:gap-4 text-sm">
            {isLoginPage ? (
              <Link to="/" className="bg-white text-dxn-red px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 shrink-0">
                Volver al Catálogo
              </Link>
            ) : (
              <>
                <Link to="/" className="hover:underline md:inline hidden">Catálogo</Link>
                <Link to="/cart" className="hover:underline relative">
                  <span className="md:hidden text-lg">🛒</span>
                  <span className="hidden md:inline">Carrito</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-white text-dxn-red text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {isAdmin && <Link to="/admin" className="hover:underline font-semibold hidden md:inline">Admin</Link>}
                {user ? (
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-white/80 text-xs hidden md:inline max-w-24 truncate">{user.nombre_completo}</span>
                    <button onClick={logout} className="bg-white text-dxn-red px-2 md:px-3 py-1 rounded text-xs font-semibold cursor-pointer hover:bg-gray-100 shrink-0">
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="bg-white text-dxn-red px-2 md:px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 shrink-0">
                    <span className="md:hidden">🔑</span>
                    <span className="hidden md:inline">Iniciar Sesión</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
