import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function PVProgressBar({ totalPV }) {
  const pct = Math.min((totalPV / 100) * 100, 100)
  const barColor =
    pct >= 100 ? 'bg-success' : pct >= 30 ? 'bg-warning' : 'bg-accent'
  const label =
    pct >= 100 ? '¡Meta alcanzada!' : pct >= 30 ? 'Vas bien' : 'Empieza tu pedido'

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex-1 min-w-0 h-2 bg-white/20 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        <div className="absolute top-0 left-[30%] w-px h-full bg-white/40" aria-hidden="true" />
        <div className="absolute top-0 left-[100%] w-px h-full bg-white/40" aria-hidden="true" />
      </div>
      <span className="text-xs font-semibold whitespace-nowrap text-white">
        {totalPV} PV
      </span>
      <span className="hidden md:inline text-xs text-white/80 whitespace-nowrap">
        · {label}
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
    <header className="sticky top-0 z-40 bg-dxn-red text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Fila 1: logo + acciones (mobile colapsa fila 2 abajo) */}
        <div className="flex items-center justify-between gap-3 h-16">
          <Link to="/" className="shrink-0 flex items-center" aria-label="Casa DXN Chile, inicio">
            <img src="/logo.png" alt="Casa DXN Chile" className="h-9 md:h-11" />
          </Link>

          {!isLoginPage && (
            <nav aria-label="Principal" className="hidden md:flex flex-1 items-center justify-center min-w-0">
              <PVProgressBar totalPV={totalPV} />
            </nav>
          )}

          <div className="flex items-center gap-1.5 md:gap-3 text-sm">
            {isLoginPage ? (
              <Link
                to="/"
                className="bg-white text-accent px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-white/90 transition-colors shrink-0"
              >
                Volver al Catálogo
              </Link>
            ) : (
              <>
                <Link
                  to="/"
                  className="hidden md:inline px-2 py-1.5 rounded-md text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  Catálogo
                </Link>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-md hover:bg-white/15 transition-colors"
                  aria-label={`Carrito${itemCount > 0 ? `, ${itemCount} items` : ''}`}
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2H7m0 0l1.2 6.4a2 2 0 001.96 1.6h7.68a2 2 0 001.96-1.6L21 8H7m0 0L5.5 3M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-white text-accent text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:inline px-2 py-1.5 rounded-md text-sm font-medium hover:bg-white/15 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline text-xs text-white/85 max-w-32 truncate" title={user.nombre_completo}>
                      {user.nombre_completo}
                    </span>
                    <button
                      onClick={logout}
                      className="bg-white text-accent px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-white/90 transition-colors shrink-0"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-white text-accent px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-white/90 transition-colors shrink-0"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Fila 2: PV bar (solo mobile) */}
        {!isLoginPage && (
          <div className="md:hidden pb-3 pt-1 border-t border-white/10">
            <PVProgressBar totalPV={totalPV} />
          </div>
        )}

        {/* Fila 3: nav mobile (Catálogo + Admin) */}
        {!isLoginPage && (
          <nav aria-label="Navegación móvil" className="md:hidden flex items-center gap-1 pb-3">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              Catálogo
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/admin' ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
