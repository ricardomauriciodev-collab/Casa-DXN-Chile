export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
