# Story W18.1: Reportes Admin — Vista de Productos y Clientes — Web

Status: review

## Story

Como administrador,
quiero ver desde el panel web los productos más vendidos y los clientes con más pedidos,
para analizar el rendimiento del negocio sin necesidad de consultar la base de datos.

## Acceptance Criteria

1. **Given** el admin navega a `/admin/reportes`
   **When** la página carga
   **Then** ve una tabla "Productos más vendidos" con columnas: Producto, Unidades vendidas, Revenue total
   **And** ve una tabla "Clientes con más pedidos" con columnas: Email, Total pedidos, Revenue total
   **And** ambas tablas muestran los top 10 por defecto

2. **Given** la página `/admin/reportes` está cargando datos
   **When** la respuesta del API no ha llegado
   **Then** muestra skeletons de carga (`animate-pulse`) en lugar de las tablas

3. **Given** el admin está en `/admin/reportes`
   **When** hay un error al cargar los reportes
   **Then** muestra un mensaje de error con botón "Reintentar"

4. **Given** el admin está en el panel principal `/admin`
   **When** lo visualiza
   **Then** hay una tarjeta "Reportes" que navega a `/admin/reportes`

5. **Given** los valores de revenue en las tablas
   **When** se muestran
   **Then** están formateados en pesos argentinos sin decimales (ej: `$ 75.000`) — consistente con el resto de la app

## Tasks / Subtasks

- [x] Crear `jedami-web/src/api/admin.reports.api.ts` (AC: 1)
  - [x] Tipado: `TopProduct { productId, name, totalUnits, totalRevenue }`, `TopCustomer { customerId, email, totalOrders, totalRevenue }`, `ReportsData { topProducts, topCustomers }`
  - [x] `fetchAdminReports(limit?: number): Promise<ReportsData>` → `GET /api/v1/admin/reports?limit=${limit ?? 10}`
- [x] Crear `jedami-web/src/views/admin/AdminReportsView.vue` (AC: 1, 2, 3, 5)
  - [x] `onMounted` → llamar `fetchAdminReports()`
  - [x] Sección "Productos más vendidos": tabla con Producto, Unidades, Revenue
  - [x] Sección "Clientes con más pedidos": tabla con Email, Total pedidos, Revenue
  - [x] Skeleton de carga con `animate-pulse` (patrón igual a AdminDashboardView)
  - [x] Manejo de error con mensaje + botón "Reintentar"
  - [x] Breadcrumb: `← Admin` con `router.push('/admin')`
  - [x] Revenue formateado con `toLocaleString('es-AR', { maximumFractionDigits: 0 })`
- [x] Agregar tarjeta "Reportes" en `jedami-web/src/views/admin/AdminView.vue` (AC: 4)
  - [x] Misma estructura de tarjeta que las existentes (Dashboard, Pagos, Productos, Usuarios)
  - [x] Navegar a `/admin/reportes`
- [x] Registrar ruta en `jedami-web/src/router/index.ts` (AC: 1)
  - [x] `/admin/reportes` → `AdminReportsView`, meta `{ requiresRole: ROLES.ADMIN }`
  - [x] Lazy import: `() => import('@/views/admin/AdminReportsView.vue')`

## Dev Notes

### ⚠️ DEPENDENCIA: story 18-1 debe estar DONE antes de implementar esta story
El endpoint `GET /api/v1/admin/reports` debe estar disponible. No usar mocks.

### Stack y patrón del proyecto
- Vue 3 + Composition API (`<script setup lang="ts">`) + TypeScript
- Tailwind CSS + shadcn-vue — NO introducir nuevas librerías de UI
- Axios via `apiClient` (default import desde `@/api/client`)
- Color de marca: `#E91E8C` (rosa Jedami)

### Patrón de api client (crítico — siempre default import)
```typescript
import apiClient from './client'
// NO: import { apiClient } from './client'  ← rompe

export async function fetchAdminReports(limit = 10): Promise<ReportsData> {
  const res = await apiClient.get<{ data: ReportsData }>(`/admin/reports?limit=${limit}`)
  return res.data.data
}
```

### Patrón de vista admin (replicar de AdminDashboardView.vue)
```typescript
const loading = ref(true)
const error   = ref('')
const reports = ref<ReportsData | null>(null)

onMounted(async () => {
  try {
    reports.value = await fetchAdminReports()
  } catch {
    error.value = 'Error al cargar los reportes'
  } finally {
    loading.value = false
  }
})
```

### Skeleton de carga (patrón del proyecto)
```html
<div v-if="loading" class="space-y-3">
  <div v-for="i in 5" :key="i" class="animate-pulse bg-white rounded-2xl border h-12"></div>
</div>
```

### Formato de precios — patrón del proyecto (sin decimales)
```typescript
const formatPrice = (n: number) =>
  n.toLocaleString('es-AR', { maximumFractionDigits: 0 })
// Resultado: "75.000" → mostrar como "$ 75.000"
```

### Tarjeta en AdminView.vue — patrón existente a replicar
Ver `AdminView.vue` para la estructura de tarjetas navegables (hay 4 actualmente: Dashboard, Pagos, Productos, Usuarios). Agregar "Reportes" con la misma estructura.

### Ruta nueva en router (patrón existente)
```typescript
{
  path: '/admin/reportes',
  name: 'adminReports',
  component: () => import('@/views/admin/AdminReportsView.vue'),
  meta: { requiresRole: ROLES.ADMIN },
}
```

### Response shape del BFF (story 18-1)
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

### Rutas admin existentes (referencias)
- `jedami-web/src/views/admin/AdminView.vue` — panel principal con tarjetas
- `jedami-web/src/views/admin/AdminDashboardView.vue` — patrón de skeleton y carga
- `jedami-web/src/api/admin.dashboard.api.ts` — patrón de API client admin

### Project Structure Notes
- Vistas admin: `jedami-web/src/views/admin/`
- APIs admin: `jedami-web/src/api/admin.*.api.ts` (patrón de nombres)
- Router: `jedami-web/src/router/index.ts`

### Referencias
- [Source: jedami-web/src/views/admin/AdminDashboardView.vue] — patrón skeleton y carga
- [Source: jedami-web/src/views/admin/AdminView.vue] — patrón tarjetas navegables
- [Source: jedami-web/src/api/admin.dashboard.api.ts] — patrón api client
- [Source: jedami-web/src/router/index.ts] — patrón de rutas admin
- [Source: _bmad-output/implementation-artifacts/18-1-reportes-productos-y-clientes.md] — story BFF (response shape)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Vista con dos tablas independientes: productos más vendidos y clientes con más pedidos.
- Skeleton de carga `animate-pulse` mientras llega la respuesta del API.
- Botón "Reintentar" reutiliza la función `load()` sin recargar la página.
- Revenue formateado con `$ N.NNN` sin decimales, consistente con el resto de la app.
- Tarjeta agregada al panel `/admin` con ícono 📈.
- Ruta `/admin/reportes` con lazy import y guard `requiresRole: ROLES.ADMIN`.

### File List

- `jedami-web/src/api/admin.reports.api.ts` (nuevo)
- `jedami-web/src/views/admin/AdminReportsView.vue` (nuevo)
- `jedami-web/src/views/admin/AdminView.vue` (modificado)
- `jedami-web/src/router/index.ts` (modificado)
