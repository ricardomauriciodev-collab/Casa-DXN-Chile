# Casa DXN Chile — Agent Guide

## Overview
E-commerce para distribuidora DXN Chile. Catálogo, carrito multiusuario, panel admin, envío de pedidos por WhatsApp, datos compartidos entre dispositivos via Supabase.

## Stack
- **Vite + React 19 + Tailwind v4** (`@tailwindcss/vite` plugin)
- **`@supabase/supabase-js`** (app client), **`react-router-dom` v7**
- **Vercel** deploy desde GitHub (auto-deploy en push a master)
- **Supabase Storage** para imágenes de productos

## Commands
```bash
npm run dev      # dev server
npm run build    # production build (no typecheck/lint)
npm run preview  # preview build
```

## Architecture

### Service Pattern (`src/services/`)
All services are **async** with Supabase-first + mock fallback:
```js
if (!supabase) { /* mock in-memory or localStorage */ return data }
const { data, error } = await supabase.from('table').select('*')
if (error) throw error
return data
```
- `supabaseClient.js`: reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. Exports `null` if env vars missing → mock mode.
- **Mock mode**: in-memory arrays (`productService`) or `localStorage` (`userService`, `orderService`). Refresh resets in-memory data but preserves localStorage.
- **Supabase mode**: all ops go to Supabase. Both modes produce compatible data shapes.

### Context (`src/context/`)
- **`AuthContext`**: `{ user, login, logout, isAdmin }`. Wraps app in `main.jsx`.
- **`CartContext`**: `{ items, addItem, removeItem, updateQuantity, clearCart, totalCLP, totalPV }`. Cart in-memory (no persistence).

### Views / Routing (`src/views/`, `src/App.jsx`)
Routes loaded by `App.jsx`:
- `/` — Catalog
- `/login` — Login
- `/register` — Register
- `/cart` — Cart
- `/admin` — Admin dashboard (protected: `isAdmin` check)
- `*` — NotFound

## Auth
- **Session**: `sessionStorage.dxn_user` (se borra al cerrar navegador)
- **Fixed users** (hardcoded in `authService.js`, also seeded in Supabase):
  - `test` / `123456` → role `client`, pais: Chile
  - `admin` / `123456` → role `admin`, pais: Chile
- **In Supabase mode**: fixed users get their real UUID from DB (not hardcoded `'1'`/`'2'`)
- **Register** (`/register`):
  - Campos: nombre_completo, pais (select latinoamerica), numero_carnet, codigo_distribuidor, direccion
  - `username` = codigo_distribuidor (string exacto)
  - `password` = últimos 4 dígitos del codigo_distribuidor (solo dígitos, `.replace(/\D/g,'')`)
  - Placeholder del carnet cambia según país seleccionado (ej: "RUT: 12.345.678-5" para Chile)
  - Sin formato forzado — usuario escribe libremente
  - `codigo_distribuidor` único: validación en `isCodigoUnico()` contra fixed users + mock users + Supabase
  - Redirects to `/login` (no auto-login)
  - `handleSubmit` tiene try/catch — muestra error si falla
- **Login** (`/login`):
  - Campo: "Código de Distribuidor" + "Contraseña" (últimos 4 dígitos)
  - Busca por `codigo_distribuidor` (o `username` como fallback) en FIXED_USERS, Supabase, mock users
  - Login es async — usa `await login()`

## Cart & WhatsApp
- `totalPV` calculado en `CartContext`, redondeado a 2 decimales
- Header muestra barra de progreso PV (0→100%) + badges en 30 y 100 PV
- Cart y catálogo funcionan sin login; botón WhatsApp requiere login
- **Flujo WhatsApp** (`CartSummary.handleWhatsApp`):
  1. Sincrónico: `generateWhatsAppLink()` → `window.open(link, '_blank')` (antes del `await` para evitar bloqueo de popup)
  2. Asíncrono: `createOrder()` → `clearCart()` + `navigate('/')` (redirect a catálogo)
- Mensaje incluye: nombre, RUT, código distribuidor, dirección, items, total CLP, total PV
- Número WhatsApp: `+56975716555`

## Database (Supabase)
Schema completo en `src/database/schema.sql`. 3 tablas:

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, gen_random_uuid() |
| name | TEXT | NOT NULL |
| price | INT | CLP |
| pv | NUMERIC | Puntos volumen |
| stock | INT | Default 0 |
| low_stock_threshold | INT | Default 10 |
| out_of_stock_threshold | INT | Default 0 |
| image_url | TEXT | Nullable → URL pública de Supabase Storage |
| created_at | TIMESTAMPTZ | Default now() |

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| nombre_completo | TEXT | |
| rut | TEXT | Nullable (reemplazado por numero_carnet) |
| codigo_distribuidor | TEXT | Nullable, único por usuario |
| pais | TEXT | Nullable, país latinoamericano |
| numero_carnet | TEXT | Nullable, documento identidad país |
| direccion | TEXT | |
| role | TEXT | Default 'client' |
| username | TEXT | = codigo_distribuidor |
| password | TEXT | Últimos 4 dígitos de codigo_distribuidor |
| created_at | TIMESTAMPTZ | |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users(id) ON DELETE CASCADE |
| user_name | TEXT | |
| items | JSONB | Array de objetos { id, name, quantity, price, pv } |
| total_clp | INT | |
| total_pv | NUMERIC | |
| status | TEXT | Default 'pendiente' |
| approved_at | TIMESTAMPTZ | Nullable, se llena al aprobar |
| created_at | TIMESTAMPTZ | |

### Storage Bucket
- `product-images` — bucket público para imágenes de productos
- RLS policies: SELECT y INSERT para anon key

### RLS Policies
All tables have RLS enabled with permissive policies (anon key = full access):
- `users`: SELECT, INSERT, DELETE
- `products`: SELECT, INSERT, UPDATE, DELETE
- `orders`: SELECT, INSERT, UPDATE, DELETE
- `storage.objects`: SELECT, INSERT for `product-images` bucket

## Admin (`/admin`)
Ruta protegida — solo accesible con `role: admin`. 3 pestañas:

### Users
Lista usuarios registrados + botón Eliminar. Muestra nombre, país, RUT/carnet, código distribuidor. Llama `getUsers()` / `deleteUser()`.

### Inventory (Inventario)
CRUD completo con drag-drop de imágenes:
- Formulario en modal animado (fade-in + slide-up, max-h-[90dvh] overflow-y-auto)
- **Imágenes**: subida a Supabase Storage via `uploadImage()` en `productService.js`
  - Preview local con `URL.createObjectURL(file)`
  - Al submit, se sube el archivo al bucket `product-images` y se guarda URL pública
  - Imágenes visibles desde cualquier dispositivo
  - Validación: < 2MB
  - Drag-drop + file input con clase `cursor-pointer`

### Orders (Pedidos)
Lista órdenes con filtros: Pendientes / Aprobados / Todos.
- **APROBAR**: descuenta stock (llama `deductStock` por cada item) → cambia status a `'aprobado'` → guarda `approved_at`
- **RECHAZAR**: elimina la orden permanentemente (confirmación previa)
- Botones se deshabilitan mientras procesan (estado `loading`), con feedback de error via `alert()`
- Órdenes aprobadas muestran fecha de aprobación

## Product Status
Basado en `stock` vs thresholds configurables:
- `stock > low_stock_threshold` → **Disponible** (verde)
- `stock <= low_stock_threshold` y `> out_of_stock_threshold` → **Poco stock** (amarillo)
- `stock <= out_of_stock_threshold` → **Fuera de stock** (rojo)

Thresholds por producto (default: low=10, out=0).

## Product Images
- Catálogo: `object-contain p-2` (no crop), `aspect-[4/3]`, `loading="lazy"`, placeholder SVG
- Admin preview: `aspect-[4/3] object-contain`, botón "Quitar imagen"
- Upload: validación tamaño < 2MB, nombre = `Date.now() + extension`

## Theme
Colores DXN definidos en `@theme` via `src/index.css`:
```css
--color-dxn-red: #CC0000;
--color-dxn-red-dark: #990000;
--color-dxn-red-light: #FF1A1A;
```
Animaciones: `fade-in` (0.2s), `slide-up` (0.25s). Usadas por modal y transiciones.

## Deploy
- **Plataforma**: Vercel (Hobby tier, gratis)
- **Auto-deploy**: cada push a `master` gatilla build y deploy
- **URL**: `https://casa-dxn-chile.vercel.app`
- **SPA routing**: `vercel.json` con rewrite `/(.*)` → `/index.html` (evita 404 en recarga)
- **Env vars** (settings en Vercel Dashboard → Environment Variables):
  ```
  VITE_SUPABASE_URL=https://njrcosbvluozhxhxyupz.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_...
  ```
  Sin estas vars, la app funciona en modo mock (local).

## Important Conventions
- **Column names** en Supabase (no traducir a español): `user_name`, `total_clp`, `total_pv`, `approved_at`
- **FIXED_USERS** en `authService.js` tiene `id: '1'` y `id: '2'` para mock; en Supabase mode se reemplazan con UUIDs reales. Sus `codigo_distribuidor` = 'test' y 'admin' respectivamente (también son sus credenciales de login).
- **Servicios async**: siempre usar `await` o `.then()` — nunca llamar funciones async sin `await`
- **Error handling en componentes**: try/catch con feedback al usuario (no `.catch(() => {})` silencioso)
- **Popup blockers**: `window.open()` debe ejecutarse sincrónicamente (antes de cualquier `await`)
