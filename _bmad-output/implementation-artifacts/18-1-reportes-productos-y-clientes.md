# Story 18.1: Reportes — Productos Más Vendidos y Clientes con Más Pedidos — BFF

Status: ready-for-dev

## Story

Como administrador,
quiero consultar los productos más vendidos y los clientes con más pedidos,
para tomar decisiones de negocio basadas en datos reales de ventas.

## Acceptance Criteria

1. **Given** un admin autenticado hace `GET /api/v1/admin/reports`
   **When** el endpoint procesa la solicitud
   **Then** retorna `{ topProducts: [...], topCustomers: [...] }`
   **And** `topProducts` contiene hasta 10 productos ordenados por unidades vendidas (desc)
   **And** `topCustomers` contiene hasta 10 clientes ordenados por cantidad de pedidos (desc)
   **And** el endpoint requiere JWT con rol admin

2. **Given** el campo `topProducts`
   **When** se retorna en el response
   **Then** cada ítem incluye: `productId`, `name`, `totalUnits` (suma de quantities de order_items), `totalRevenue` (suma de quantity * unit_price)
   **And** solo se contabilizan pedidos con `status = 'paid'`

3. **Given** el campo `topCustomers`
   **When** se retorna en el response
   **Then** cada ítem incluye: `customerId`, `email`, `totalOrders` (total de pedidos), `totalRevenue` (suma de total_amount de pedidos pagados)
   **And** `totalOrders` cuenta todos los pedidos del cliente (cualquier estado)
   **And** `totalRevenue` solo acumula pedidos con `status = 'paid'`

4. **Given** el endpoint recibe `?limit=N` (query param opcional)
   **When** N es un entero entre 1 y 50
   **Then** retorna los top N productos y top N clientes
   **And** el valor por defecto es 10 si no se especifica

5. **Given** el mismo endpoint recibe múltiples requests en 5 minutos
   **When** hay caché disponible
   **Then** las respuestas siguientes vienen de Redis (TTL 300s)

## Tasks / Subtasks

- [ ] Crear `jedami-bff/src/modules/admin/queries/reports.ts` (AC: 1, 2, 3)
  - [ ] `TOP_PRODUCTS_QUERY`: JOIN order_items → products → orders WHERE paid, GROUP BY product, ORDER BY total_units DESC, LIMIT $1
  - [ ] `TOP_CUSTOMERS_QUERY`: JOIN orders → customers → users, GROUP BY customer, ORDER BY total_orders DESC, LIMIT $1
- [ ] Agregar handler `getAdminReports` en `jedami-bff/src/modules/admin/admin.controller.ts` (AC: 1, 4, 5)
  - [ ] Parsear `?limit` con default 10, clamp 1–50
  - [ ] Cache key: `admin:reports:${limit}`, TTL 300s
  - [ ] `Promise.all` para ejecutar ambas queries en paralelo
  - [ ] Mapear resultado a camelCase
- [ ] Agregar ruta `GET /admin/reports` en `jedami-bff/src/routes/admin.routes.ts` (AC: 1)
  - [ ] Agregar import de `getAdminReports`
  - [ ] JSDoc Swagger con response shape completo
- [ ] Registrar import en admin.routes.ts (AC: 1)

## Dev Notes

### Estructura de módulo admin (existente — NO modificar patrón)
```
jedami-bff/src/modules/admin/
  admin.controller.ts          ← agregar getAdminReports aquí
  queries/
    dashboard.ts               ← patrón a replicar
    payments.ts
    users.ts
    reports.ts                 ← archivo nuevo
```

### Queries SQL a implementar

**TOP_PRODUCTS_QUERY** — productos más vendidos (solo pedidos pagados):
```sql
SELECT
  p.id         AS product_id,
  p.name,
  SUM(oi.quantity)                      AS total_units,
  SUM(oi.quantity * oi.unit_price)      AS total_revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders   o ON o.id = oi.order_id
WHERE o.status = 'paid'
GROUP BY p.id, p.name
ORDER BY total_units DESC
LIMIT $1
```

**TOP_CUSTOMERS_QUERY** — clientes con más pedidos:
```sql
SELECT
  c.id            AS customer_id,
  u.email,
  COUNT(o.id)     AS total_orders,
  COALESCE(SUM(o.total_amount) FILTER (WHERE o.status = 'paid'), 0) AS total_revenue
FROM customers c
JOIN users  u ON u.id = c.user_id
JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, u.email
ORDER BY total_orders DESC
LIMIT $1
```

### Tablas relevantes (migraciones ya aplicadas)
- `products(id, name)` — `004_products.sql`
- `order_items(order_id, product_id, quantity, unit_price)` — `006_customers_orders.sql`
  - ⚠️ `product_id` puede ser NULL en algunos ítems de pedidos curva/cantidad — usar `JOIN` no `LEFT JOIN` para excluirlos
- `orders(id, customer_id, status, total_amount)` — `006_customers_orders.sql`
- `customers(id, user_id)` — `006_customers_orders.sql`
- `users(id, email)` — migration `001_users.sql` o equivalente

### Patrón caché Redis (replicar de getDashboard)
```typescript
const REPORTS_CACHE_KEY = (limit: number) => `admin:reports:${limit}`
const REPORTS_TTL = 300 // 5 minutos

const cached = await cacheGet(REPORTS_CACHE_KEY(limit))
if (cached) return res.status(200).json({ data: JSON.parse(cached) })

const [productsResult, customersResult] = await Promise.all([
  pool.query(TOP_PRODUCTS_QUERY, [limit]),
  pool.query(TOP_CUSTOMERS_QUERY, [limit]),
])

// mapear y guardar caché
await cacheSet(REPORTS_CACHE_KEY(limit), JSON.stringify(data), REPORTS_TTL)
return res.status(200).json({ data })
```

### Imports de Redis y pool (ya disponibles en admin.controller.ts)
```typescript
import { pool }              from '../../config/database.js'
import { cacheGet, cacheSet } from '../../config/redis.js'
import { TOP_PRODUCTS_QUERY, TOP_CUSTOMERS_QUERY } from './queries/reports.js'
```

### Response shape esperado
```json
{
  "data": {
    "topProducts": [
      { "productId": 3, "name": "Remera Basica", "totalUnits": 150, "totalRevenue": 75000 }
    ],
    "topCustomers": [
      { "customerId": 7, "email": "comprador@ejemplo.com", "totalOrders": 12, "totalRevenue": 60000 }
    ]
  }
}
```

### Mapeo de columnas snake_case → camelCase (patrón del controller)
```typescript
topProducts: productsResult.rows.map(r => ({
  productId:    r.product_id,
  name:         r.name,
  totalUnits:   Number(r.total_units),
  totalRevenue: Number(r.total_revenue),
})),
topCustomers: customersResult.rows.map(r => ({
  customerId:   r.customer_id,
  email:        r.email,
  totalOrders:  Number(r.total_orders),
  totalRevenue: Number(r.total_revenue),
})),
```

### Guard de ruta — ya existe, no cambiar
```typescript
// routes/index.ts — ya registrado
router.use('/admin', authMiddleware, requireRole([ROLES.ADMIN]), adminRoutes)
```

### Referencias
- [Source: jedami-bff/src/modules/admin/admin.controller.ts] — patrón getDashboard + imports
- [Source: jedami-bff/src/modules/admin/queries/dashboard.ts] — patrón de queries
- [Source: jedami-bff/src/routes/admin.routes.ts] — patrón de rutas y JSDoc Swagger
- [Source: jedami-bff/src/config/redis.ts] — cacheGet / cacheSet
- [Source: jedami-bff/src/database/migrations/006_customers_orders.sql] — esquema de orders, order_items, customers

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
