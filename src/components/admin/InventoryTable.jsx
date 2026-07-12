import { useState, useEffect, useRef } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../services/productService'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

function emptyForm() {
  return { name: '', price: '', pv: '', stock: '', low_stock_threshold: '10', out_of_stock_threshold: '0', image_url: '' }
}

export default function InventoryTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [dragOver, setDragOver] = useState(false)
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef(null)
  const uploadFileRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [refresh])

  function openNewForm() {
    setEditId(null)
    setForm(emptyForm())
    setImageError('')
    uploadFileRef.current = null
    setShowForm(true)
  }

  function openEditForm(p) {
    setEditId(p.id)
    setForm({
      name: p.name,
      price: String(p.price),
      pv: String(p.pv),
      stock: String(p.stock),
      low_stock_threshold: String(p.low_stock_threshold),
      out_of_stock_threshold: String(p.out_of_stock_threshold),
      image_url: p.image_url || '',
    })
    setImageError('')
    uploadFileRef.current = null
    setShowForm(true)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
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
      setRefresh((r) => r + 1)
    } catch (err) {
      alert('Error al guardar: ' + (err.message || 'desconocido'))
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteProduct(deleteModal.id)
      setRefresh((r) => r + 1)
      setDeleteModal({ open: false, id: null, name: '' })
    } catch (err) {
      alert('Error al eliminar: ' + (err.message || 'desconocido'))
    }
    setDeleting(false)
  }

  function loadImage(file) {
    setImageError('')
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`Imagen demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo 2 MB.`)
      return
    }
    uploadFileRef.current = file
    setForm((prev) => ({ ...prev, image_url: URL.createObjectURL(file) }))
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
        <h2 className="text-lg font-bold text-foreground">
          Inventario{' '}
          <span className="text-sm font-normal text-muted-foreground">({products.length})</span>
        </h2>
        <Button onClick={openNewForm}>+ Nuevo Producto</Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" count={4} />
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No hay productos. Crea el primero.</p>
      ) : (
        /* Desktop: table */
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-muted text-left">
                <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Producto</th>
                <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Precio</th>
                <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">PV</th>
                <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Stock</th>
                <th className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Imagen</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-surface-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">{p.name}</td>
                  <td className="p-3 font-mono text-foreground">${p.price.toLocaleString('es-CL')}</td>
                  <td className="p-3 font-mono text-muted-foreground">{p.pv} PV</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        p.stock <= p.out_of_stock_threshold
                          ? 'danger'
                          : p.stock <= p.low_stock_threshold
                            ? 'warning'
                            : 'success'
                      }
                    >
                      {p.stock} uds.
                    </Badge>
                  </td>
                  <td className="p-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="size-10 object-cover rounded-md border border-border" />
                    ) : (
                      <span className="text-subtle-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEditForm(p)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteModal({ open: true, id: p.id, name: p.name })}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile: cards */}
      <div className="md:hidden flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-surface-muted rounded-lg border border-border p-4 flex gap-3">
            <div className="size-16 shrink-0 rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center">
              {p.image_url ? (
                <img src={p.image_url} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-accent/60 select-none">
                  {(p.name || '?').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <span className="font-medium text-sm text-foreground line-clamp-1">{p.name}</span>
              <span className="font-mono text-sm text-foreground">${p.price.toLocaleString('es-CL')}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{p.pv} PV</span>
                <Badge
                  variant={
                    p.stock <= p.out_of_stock_threshold
                      ? 'danger'
                      : p.stock <= p.low_stock_threshold
                        ? 'warning'
                        : 'success'
                  }
                  className="text-[10px]"
                >
                  {p.stock} uds.
                </Badge>
              </div>
              <div className="flex gap-2 mt-1">
                <Button variant="secondary" size="sm" onClick={() => openEditForm(p)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteModal({ open: true, id: p.id, name: p.name })}>Eliminar</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product form modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nombre del producto"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio CLP"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              label="PV (Puntos Volumen)"
              type="number"
              step="0.1"
              name="pv"
              value={form.pv}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Stock actual"
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
            <Input
              label="Alerta stock bajo"
              type="number"
              name="low_stock_threshold"
              value={form.low_stock_threshold}
              onChange={handleChange}
            />
            <Input
              label="Stock crítico"
              type="number"
              name="out_of_stock_threshold"
              value={form.out_of_stock_threshold}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Imagen</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !form.image_url && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition
                ${dragOver ? 'border-accent bg-accent-soft' : 'border-border-strong hover:border-accent bg-surface-muted'}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
              aria-label="Subir imagen del producto"
            >
              {form.image_url ? (
                <div className="relative">
                  <img src={form.image_url} alt="Vista previa" className="aspect-[4/3] object-contain mx-auto rounded-md max-h-48" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <svg className="size-8 text-subtle-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-muted-foreground">Arrastra una imagen aquí o haz click para seleccionar</p>
                  <p className="text-xs text-subtle-foreground">Máximo 2 MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            {form.image_url && (
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, image_url: '' })); setImageError(''); uploadFileRef.current = null }}
                  className="text-xs text-danger hover:text-danger/80 underline cursor-pointer"
                >
                  Quitar imagen
                </button>
              </div>
            )}
            {imageError && (
              <p role="alert" className="text-xs text-danger font-medium flex items-center gap-1">
                <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {imageError}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2 justify-end">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editId ? 'Guardar cambios' : 'Crear producto'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: '' })}
        title="Eliminar producto"
        size="sm"
      >
        <p className="text-sm text-muted-foreground mb-6">
          ¿Eliminar <strong className="text-foreground">{deleteModal.name}</strong> permanentemente?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null, name: '' })}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Sí, eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
