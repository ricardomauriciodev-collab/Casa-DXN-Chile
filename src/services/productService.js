import { supabase } from '../config/supabaseClient'

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'DXN Spirudle', price: 6672, pv: 2.1, stock: 50, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p2', name: 'DXN Apple Juice Drink', price: 39145, pv: 14, stock: 30, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p3', name: 'DXN Spirulina Coffee', price: 19251, pv: 8.3, stock: 40, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p4', name: 'DXN Apple Jam', price: 13837, pv: 4.6, stock: 25, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p5', name: "DXN Spirulina Tablet 500's", price: 77567, pv: 18.7, stock: 20, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
  { id: 'p6', name: "DXN Spirulina Tablet 120's", price: 21448, pv: 5.2, stock: 60, low_stock_threshold: 10, out_of_stock_threshold: 0, image_url: null },
]

let nextId = 7

export async function getProducts() {
  if (!supabase) return [...MOCK_PRODUCTS]
  const { data, error } = await supabase.from('products').select('*')
  if (error) throw error
  return data
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

export async function createProduct(data) {
  if (!supabase) {
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
  const { data: product, error } = await supabase.from('products').insert([{
    name: data.name,
    price: parseInt(data.price, 10) || 0,
    pv: parseFloat(data.pv) || 0,
    stock: parseInt(data.stock, 10) || 0,
    low_stock_threshold: parseInt(data.low_stock_threshold, 10) || 10,
    out_of_stock_threshold: parseInt(data.out_of_stock_threshold, 10) || 0,
    image_url: data.image_url || null,
  }]).select().single()
  if (error) throw error
  return product
}

export async function updateProduct(id, data) {
  if (!supabase) {
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
  const updateData = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.price !== undefined) updateData.price = parseInt(data.price, 10) || 0
  if (data.pv !== undefined) updateData.pv = parseFloat(data.pv) || 0
  if (data.stock !== undefined) updateData.stock = parseInt(data.stock, 10) || 0
  if (data.low_stock_threshold !== undefined) updateData.low_stock_threshold = parseInt(data.low_stock_threshold, 10) || 10
  if (data.out_of_stock_threshold !== undefined) updateData.out_of_stock_threshold = parseInt(data.out_of_stock_threshold, 10) || 0
  if (data.image_url !== undefined) updateData.image_url = data.image_url
  const { data: product, error } = await supabase.from('products').update(updateData).eq('id', id).select().single()
  if (error) throw error
  return product
}

export async function deleteProduct(id) {
  if (!supabase) {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id)
    if (idx === -1) return false
    MOCK_PRODUCTS.splice(idx, 1)
    return true
  }
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  return true
}

export function updateProductStock(productId, newStock) {
  return updateProduct(productId, { stock: newStock })
}

export async function uploadImage(file) {
  if (!supabase) return null
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
  return publicUrl
}

export async function deductStock(productId, quantity) {
  if (!supabase) {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === productId)
    if (idx === -1) return false
    if (MOCK_PRODUCTS[idx].stock < quantity) return false
    MOCK_PRODUCTS[idx].stock -= quantity
    return true
  }
  const { data: product, error } = await supabase.from('products').select('stock').eq('id', productId).single()
  if (error || !product) return false
  if (product.stock < quantity) return false
  const { error: updateError } = await supabase.from('products').update({ stock: product.stock - quantity }).eq('id', productId)
  if (updateError) throw updateError
  return true
}
