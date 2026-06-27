import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addItem(product, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function removeItem(productId) {
    setItems(prev => prev.filter(i => i.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) return removeItem(productId)
    setItems(prev => prev.map(i =>
      i.id === productId ? { ...i, quantity } : i
    ))
  }

  function clearCart() {
    setItems([])
  }

  const totalCLP = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])
  const rawTotalPV = useMemo(() => items.reduce((s, i) => s + i.pv * i.quantity, 0), [items])
  const totalPV = useMemo(() => Math.round(rawTotalPV * 100) / 100, [rawTotalPV])
  const itemCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const reached30PV = totalPV >= 30
  const reached100PV = totalPV >= 100

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCLP, totalPV, itemCount, reached30PV, reached100PV }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
