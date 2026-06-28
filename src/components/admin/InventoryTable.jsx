import { useState, useEffect, useRef } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../services/productService'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

export default function InventoryTable() {
  const [products, setProducts] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', pv: '', stock: '', low_stock_threshold: '10', out_of_stock_threshold: '0', image_url: '' })
  const [dragOver, setDragOver] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)
  const uploadFileRef = useRef(null)

  useEffect(() => { getProducts().then(setProducts) }, [refresh])

  function openNewForm() {
    setEditId(null)
    setForm({ name: '', price: '', pv: '', stock: '', low_stock_threshold: '10', out_of_stock_threshold: '0', image_url: '' })
    setImageError('')
    uploadFileRef.current = null
    setShowForm(true)
  }

  function openEditForm(p) {
    setEditId(p.id)
    setForm({ name: p.name, price: String(p.price), pv: String(p.pv), stock: String(p.stock), low_stock_threshold: String(p.low_stock_threshold), out_of_stock_threshold: String(p.out_of_stock_threshold), image_url: p.image_url || '' })
    setImageError('')
    uploadFileRef.current = null
    setShowForm(true)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let imageUrl = form.image_url
    if (uploadFileRef.current) {
      imageUrl = await uploadImage(uploadFileRef.current)
    }
    const productData = { ...form, image_url: imageUrl }
    if (editId) {
      await updateProduct(editId, productData)
    } else {
      await createProduct(productData)
    }
    uploadFileRef.current = null
    setShowForm(false)
    setRefresh(r => r + 1)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    setRefresh(r => r + 1)
  }

  function loadImage(file) {
    setImageError('')
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`Imagen demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo 2 MB.`)
      return
    }
    uploadFileRef.current = file
    setForm(prev => ({ ...prev, image_url: URL.createObjectURL(file) }))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) loadImage(file)
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) loadImage(file)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Inventario</h2>
        <Button onClick={openNewForm}>+ Nuevo Producto</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Producto</th>
              <th className="p-2">Precio</th>
              <th className="p-2">PV</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Stock Bajo</th>
              <th className="p-2">Stock Crítico</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2">${p.price.toLocaleString('es-CL')}</td>
                <td className="p-2">{p.pv} PV</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.low_stock_threshold}</td>
                <td className="p-2">{p.out_of_stock_threshold}</td>
                <td className="p-2">
                  {p.image_url
                    ? <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                    : <span className="text-xs text-gray-400">—</span>
                  }
                </td>
                <td className="p-2 flex gap-1">
                  <Button variant="secondary" onClick={() => openEditForm(p)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editId ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Precio CLP</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PV</label>
              <input type="number" step="0.1" name="pv" value={form.pv} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alertar bajo</label>
              <input type="number" name="low_stock_threshold" value={form.low_stock_threshold} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock crítico</label>
              <input type="number" name="out_of_stock_threshold" value={form.out_of_stock_threshold} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !form.image_url && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${dragOver ? 'border-dxn-red bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
              {form.image_url
                ? <img src={form.image_url} alt="preview" className="aspect-[4/3] object-contain mx-auto rounded" />
                : <p className="text-sm text-gray-500">Arrastra una imagen aquí o haz click para seleccionar</p>
              }
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            {form.image_url && (
              <button type="button" onClick={() => { setForm(prev => ({ ...prev, image_url: '' })); setImageError(''); uploadFileRef.current = null }} className="text-xs text-red-500 hover:text-red-700 mt-1 underline">
                Quitar imagen
              </button>
            )}
            {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{editId ? 'Guardar' : 'Crear'}</Button>
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
