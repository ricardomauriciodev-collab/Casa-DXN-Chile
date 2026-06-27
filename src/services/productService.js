const MOCK_PRODUCTS = [
  { id: 'p1', name: 'DXN Spirudle', price: 6672, pv: 2.1, stock: 50, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p2', name: 'DXN Apple Juice Drink', price: 39145, pv: 14, stock: 30, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p3', name: 'DXN Spirulina Coffee', price: 19251, pv: 8.3, stock: 40, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p4', name: 'DXN Apple Jam', price: 13837, pv: 4.6, stock: 25, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p5', name: "DXN Spirulina Tablet 500's", price: 77567, pv: 18.7, stock: 20, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p6', name: "DXN Spirulina Tablet 120's", price: 21448, pv: 5.2, stock: 60, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
]

export function getProducts() {
  return [...MOCK_PRODUCTS]
}

export function getProductStatus(product) {
  if (product.stock <= product.out_of_stock_threshold) return 'fuera_stock'
  if (product.stock <= product.low_stock_threshold) return 'poco_stock'
  return 'disponible'
}

export function getProductStatusLabel(status) {
  const labels = {
    disponible: 'Disponible',
    poco_stock: 'Poco stock',
    fuera_stock: 'Fuera de stock',
  }
  return labels[status] || 'Desconocido'
}

let nextId = 7

export function createProduct(data) {
  const product = {
    id: 'p' + nextId++,
    name: data.name,
    price: parseInt(data.price, 10) || 0,
    pv: parseFloat(data.pv) || 0,
    stock: parseInt(data.stock, 10) || 0,
    low_stock_threshold: parseInt(data.low_stock_threshold, 10) || 10,
    out_of_stock_threshold: parseInt(data.out_of_stock_threshold, 10) || 0,
    image_url: data.image_url || null,
  }
  MOCK_PRODUCTS.push(product)
  return product
}

export function updateProduct(id, data) {
  const idx = MOCK_PRODUCTS.findIndex(p => p.id === id)
  if (idx === -1) return null
  const p = MOCK_PRODUCTS[idx]
  if (data.name !== undefined) p.name = data.name
  if (data.price !== undefined) p.price = parseInt(data.price, 10) || 0
  if (data.pv !== undefined) p.pv = parseFloat(data.pv) || 0
  if (data.stock !== undefined) p.stock = parseInt(data.stock, 10) || 0
  if (data.low_stock_threshold !== undefined) p.low_stock_threshold = parseInt(data.low_stock_threshold, 10) || 10
  if (data.out_of_stock_threshold !== undefined) p.out_of_stock_threshold = parseInt(data.out_of_stock_threshold, 10) || 0
  if (data.image_url !== undefined) p.image_url = data.image_url
  return p
}

export function deleteProduct(id) {
  const idx = MOCK_PRODUCTS.findIndex(p => p.id === id)
  if (idx === -1) return false
  MOCK_PRODUCTS.splice(idx, 1)
  return true
}

export function updateProductStock(productId, newStock) {
  return updateProduct(productId, { stock: newStock })
}

export function deductStock(productId, quantity) {
  const idx = MOCK_PRODUCTS.findIndex(p => p.id === productId)
  if (idx === -1) return false
  if (MOCK_PRODUCTS[idx].stock < quantity) return false
  MOCK_PRODUCTS[idx].stock -= quantity
  return true
}
