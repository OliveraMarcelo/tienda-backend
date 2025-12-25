# 🧭 Fases del Proyecto

Este documento describe las **fases evolutivas** del backend de la tienda online
mayorista y minorista.

Cada fase agrega funcionalidad sin romper la anterior.
Primero base sólida, después complejidad. No al revés.

---

## 🟢 Fase 1 – Fundaciones del sistema

Objetivo: construir una base técnica estable y segura.

Incluye:

- Configuración del servidor backend (Node.js + TypeScript)
- Conexión a base de datos PostgreSQL
- Gestión de usuarios
- Autenticación
- Autorización basada en roles
- Modelo inicial de datos
- Migraciones SQL
- Seed de datos básicos (roles)

Resultado esperado:
- API funcional
- Usuarios pueden registrarse y autenticarse
- Roles asignados correctamente
- Base lista para crecer

---

## 🟡 Fase 2 – Catálogo y modalidades de venta

Objetivo: introducir el dominio real del negocio.

Incluye:

- Gestión de productos
- Visualización de productos
- Soporte para:
  - Venta minorista
  - Venta mayorista
- Diferenciación de reglas según modalidad
- Preparación del modelo para variantes de producto (ej: talles)
- Stock por producto / variante

Resultado esperado:
- Productos disponibles para compra
- Reglas de negocio claras según tipo de cliente
- Base preparada para compras complejas

---

## 🟠 Fase 3 – Compras mayoristas avanzadas

Objetivo: resolver la complejidad específica del negocio mayorista.

Incluye:

- Compra mayorista por curva
- Compra mayorista por cantidad libre
- Validaciones de stock:
  - Por talle (curva)
  - Por cantidad total
- Módulo mayorista desacoplado
- Reglas exclusivas para clientes mayoristas

Resultado esperado:
- El mayorista puede comprar como en la vida real
- La lógica mayorista no contamina la minorista
- Código entendible dentro de 6 meses

---

## 🔵 Fase 4 – Pedidos y pagos

Objetivo: cerrar el ciclo de compra.

Incluye:

- Creación de pedidos
- Estados de pedido
- Integración con Mercado Pago
- Generación de órdenes de pago
- Recepción de notificaciones de pago
- Confirmación de pedidos pagos
- Persistencia de información de pago

Resultado esperado:
- Pedidos reales
- Pagos confirmados
- Sistema usable por usuarios finales

---

## 🟣 Fase 5 – Operación y escalabilidad

Objetivo: preparar el sistema para uso real y crecimiento.

Incluye (no exhaustivo):

- Manejo de errores robusto
- Logs
- Auditoría básica
- Mejoras de performance
- Preparación para nuevos medios de pago
- Preparación para envíos y facturación futura

Resultado esperado:
- Backend estable
- Fácil de mantener
- Fácil de extender

---

## 🧠 Notas importantes

- Las fases **no son sprints**
- Una fase puede tener múltiples iteraciones internas
- No se implementa una fase sin cerrar conceptualmente la anterior
- Documentación primero, código después

Porque improvisar es divertido hasta que hay bugs.
