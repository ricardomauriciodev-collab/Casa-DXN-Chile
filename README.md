# Casa DXN Chile

Tienda web para distribución DXN Chile — catálogo de productos, carrito de compras, y panel de administración.

## Stack

- **Vite** + **React 19** + **Tailwind CSS v4**
- **react-router-dom** v7
- **Supabase** (opcional — corre en modo mock sin env vars)

## Inicio rápido

```bash
npm install
npm run dev
```

### Credenciales mock

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `test` | `123456` | Cliente |
| `admin` | `123456` | Administrador |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción |
| `npm run preview` | Preview del build |

## Características

- Catálogo de productos DXN con precios CLP y PV
- Carrito de compras con barra de progreso PV (metas 30 y 100 PV)
- Envío de pedidos por WhatsApp
- Panel admin: gestión de usuarios, inventario (CRUD + imágenes drag-drop), pedidos (aprobar/rechazar)
- Autenticación mock con registro automático de credenciales
- Sin dependencia de Supabase para funcionalidad local

## Despliegue

```bash
npm run build
```

El build está en `dist/`. Desplegar en Vercel, Netlify, o cualquier host estático.

## Licencia

Uso interno — Casa DXN Chile
