# Casa DXN Chile — Agent Guide

## Stack
- Vite + React 19 + Tailwind v4 (`@tailwindcss/vite` plugin)
- `@supabase/supabase-js` (app client), `react-router-dom` v7
- Supabase MCP authentication stored in `~/.local/share/opencode/mcp-auth.json`
- All app logic uses mock in-memory services, not Supabase directly

## Commands
```bash
npm run dev      # dev server
npm run build    # production build (no typecheck/lint available)
npm run preview  # preview build
```

## Auth (Mock)
- `test` / `123456` → role `client`
- `admin` / `123456` → role `admin`
- Session stored in `localStorage.dxn_user`
- Register auto-generates: `username` = nombre lowercase, `password` = last 4 digits of RUT (before hyphen)
- Register redirects to `/login` (no auto-login)
- `loginMock()` now searches both fixed users AND registered users via `getAllMockUsers()` from userService

## Key Architecture
- **Services** (`src/services/`): Pure JS mock functions, no Supabase API calls from app code
- **Context** (`src/context/`): `AuthContext` + `CartContext` wrap the app in `main.jsx`
- **Views** (`src/views/`): Route pages, loaded by `App.jsx` via `react-router-dom`
- **Supabase DB**: Managed via MCP direct SQL queries, schema in `src/database/schema.sql`

## Cart PV System
- `totalPV` computed in `CartContext` from cart items, rounded to 2 decimals
- Header shows PV progress bar (0→100%) + badges at 30 and 100 PV
- Cart/catalog work without login; WhatsApp send requires login
- `CartSummary.handleWhatsApp()` calls `createOrder()` before opening WhatsApp, then clears cart

## Product Status
Products have `low_stock_threshold` (default 10) and `out_of_stock_threshold` (default 0). Status shown to clients: Disponible (green), Poco stock (yellow), Fuera de stock (red).

## Product Images
- Catalog uses `object-contain p-2` (not `object-cover`) to prevent cropping

## Admin
- Route `/admin`, only accessible with `role: admin`
- Tabs: Users (list/delete), Inventory (full CRUD + drag-drop image), Orders (approve/reject)

## DXN Theme Colors
Use Tailwind classes `bg-dxn-red`, `bg-dxn-red-dark`, `bg-dxn-red-light` defined in `src/index.css`.

## Supabase Env
```env
VITE_SUPABASE_URL=https://njrcosbvluozhxhxyupz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```
App runs in mock mode if env vars are missing.
