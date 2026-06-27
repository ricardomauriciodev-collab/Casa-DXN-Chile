# PLAN DE IMPLEMENTACIÓN — Casa DXN Chile

## Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS (colores DXN rojo/blanco)
- **Backend/Database**: Supabase (PostgreSQL)
- **Auth**: Simulada local (test / admin)
- **Deploy**: GitHub → Vercel

---

## 1. Scaffolding del Proyecto

```
casadxnchile/
├── docs/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   ├── admin/
│   │   │   ├── UserList.jsx
│   │   │   ├── InventoryTable.jsx
│   │   │   └── OrderList.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Modal.jsx
│   ├── config/
│   │   └── supabaseClient.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── views/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Catalog.jsx
│   │   ├── Cart.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── userService.js
│   ├── database/
│   │   └── schema.sql
│   ├── utils/
│   │   └── whatsappFormatter.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

### Pasos

```bash
npm create vite@latest casadxnchile -- --template react
cd casadxnchile
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @supabase/supabase-js react-router-dom
```

---

## 2. Base de Datos — `src/database/schema.sql`

### Tablas

- **products**: id (uuid PK), name, price (int CLP), pv (numeric), stock (int), image_url (text, nullable)
- **users**: id (uuid PK), nombre_completo, rut, codigo_distribuidor (text), direccion, role (text default 'client')
- **orders**: id (uuid PK), user_id (FK users), items (jsonb), total_clp (int), total_pv (numeric), status (text default 'pendiente')

### Seed: 6 productos DXN

| Producto | Precio CLP | PV |
|----------|-----------|-----|
| Café Orgánico DXN | 15,000 | 25 |
| Ganoderma Lucidum | 35,000 | 50 |
| Espirulina | 22,000 | 35 |
| DXN Morinzhi | 28,000 | 40 |
| DXN Andong | 12,000 | 20 |
| DXN Reishi | 45,000 | 60 |

`image_url` → NULL (editable después).

---

## 3. Configuración Supabase — `src/config/supabaseClient.js`

- Inicializar `createClient` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- El cliente apunta a la URL/DTO del proyecto Supabase del usuario

---

## 4. Autenticación — `src/context/AuthContext.jsx`

### Usuarios de prueba (mock)

- Cliente: `test` / `123456` → role `client`
- Admin: `admin` / `123456` → role `admin`
- Al hacer login se guarda en `localStorage` el objeto usuario simulado

### Registro `src/views/Register.jsx`

- Campos obligatorios: Nombre Completo, RUT, Código Distribuidor, Dirección
- Insert en tabla `users` via `supabase.from('users').insert()`

---

## 5. Carrito — `src/context/CartContext.jsx`

- Estado global con React Context
- Funciones: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotal`
- Persistencia opcional en localStorage

---

## 6. Catálogo — `src/views/Catalog.jsx`

- Fetch `SELECT * FROM products`
- Grid responsive con cards (imagen, nombre, precio, PV, stock, botón agregar)
- Colores DXN: rojo `#CC0000`, blanco `#FFFFFF`

---

## 7. WhatsApp Formatter — `src/utils/whatsappFormatter.js`

```js
export function generateWhatsAppLink(user, cart, ownerNumber) {
  // Formato:
  // [Nombre Completo]
  // [RUT]
  // [Código Distribuidor]
  // [Dirección]
  // -------------------
  // • [Cantidad]x [Producto]
  // -------------------
  // Total: $[CLP formateado]
  // Total PV: [PV] PV

  const message = `...`;
  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
}
```

---

## 8. Admin Dashboard — `src/views/AdminDashboard.jsx`

Ruta protegida `/admin`. Sólo accesible con role `admin`.

### Secciones

| Sección | Acciones |
|---------|----------|
| **Usuarios** | Listar todos (nombre, RUT, código distribuidor), botón eliminar |
| **Inventario** | Listar productos, editar stock in-place |
| **Pedidos** | Listar ordenes pendientes. APROBAR → descuenta stock, cambia status a 'aprobado'. RECHAZAR → borra orden |

---

## 9. Rutas — `src/App.jsx`

```
/           → Catalog.jsx
/login      → Login.jsx
/register   → Register.jsx
/cart       → Cart.jsx
/admin      → AdminDashboard.jsx (protegida)
*           → NotFound.jsx
```

Usar `react-router-dom` con `BrowserRouter`, `Routes`, `Route`.

---

## 10. Deploy

1. Push a GitHub
2. Importar en Vercel
3. Setear env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Configurar Supabase project y ejecutar `schema.sql` en SQL Editor

---

## Orden de Implementación

| # | Tarea | Dependencia |
|---|-------|------------|
| 1 | Scaffold Vite + Tailwind | — |
| 2 | `schema.sql` + seed | — |
| 3 | Configurar Supabase client | schema.sql |
| 4 | AuthContext + Login mock | supabaseClient |
| 5 | Register view | Auth |
| 6 | CartContext | — |
| 7 | Catalog view | products table + Cart |
| 8 | WhatsApp utility | — |
| 9 | Admin Dashboard | all tables + Auth |
| 10 | Routing + protección rutas | all views |
| 11 | Deploy Vercel | GitHub repo |
