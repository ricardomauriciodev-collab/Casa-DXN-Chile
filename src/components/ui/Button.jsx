export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]'
  const variants = {
    primary: 'bg-dxn-red text-white hover:bg-dxn-red-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-dxn-red text-dxn-red hover:bg-dxn-red hover:text-white',
    whatsapp: 'bg-green-600 text-white hover:bg-green-700',
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
