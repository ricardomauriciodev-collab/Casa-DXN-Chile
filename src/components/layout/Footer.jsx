export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto bg-dxn-red-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <img src="/logo.png" alt="Casa DXN Chile" className="h-9 mb-3 brightness-0 invert" />
            <p className="text-sm text-white/80 max-w-xs leading-relaxed">
              Distribuidora oficial DXN en Chile. Productos naturales para tu bienestar.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/90">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a
                  href="https://wa.me/56975716555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                  </svg>
                  +56 9 7571 6555
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/90">Información</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>{year} Casa DXN Chile</li>
              <li className="text-xs text-white/55">Todos los derechos reservados.</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/15 text-center text-xs text-white/60">
          <p>Distribuidora independiente DXN. Productos naturales y suplementos.</p>
        </div>
      </div>
    </footer>
  )
}
