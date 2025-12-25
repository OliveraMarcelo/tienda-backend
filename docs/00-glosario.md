Bien. Glosario primero. Orden semántico antes que carpetas con nombres creativos. Esto ya es comportamiento de alguien que no quiere rehacer el proyecto tres veces.

Voy por partes, sin marearte.

---

## 📄 Documento de Glosario

Creá este archivo:

```
docs/00-glosario.md
```

Y poné **exactamente algo así**. Esto no es relleno, es contrato de lenguaje.

---

# Glosario del Sistema

**Proyecto:** Tienda Online Mayorista y Minorista

Este documento define los conceptos clave utilizados en el sistema.
Su objetivo es evitar ambigüedades entre negocio, backend y futuras decisiones técnicas.

---

## Usuario

Persona que utiliza el sistema para interactuar con la tienda online.

Puede ser:

* Usuario minorista
* Usuario mayorista
* Administrador

---

## Usuario Minorista

Usuario que compra productos por unidad.

Características:

* Compra por cantidad individual
* No accede a compras por curva
* Visualiza precios minoristas

---

## Usuario Mayorista

Usuario que compra productos bajo modalidad mayorista.

Características:

* Puede comprar productos por curva
* Accede a precios mayoristas
* Está sujeto a reglas de compra específicas

---

## Administrador (Admin)

Usuario con permisos para administrar el sistema.

Responsabilidades:

* Gestionar usuarios
* Asignar roles
* Crear y modificar productos
* Gestionar stock

---

## Rol

Conjunto de permisos asignados a un usuario.

Ejemplos:

* ADMIN
* USER

Un usuario puede tener uno o varios roles.

---

## Producto

Artículo disponible para la venta en la tienda.

Características:

* Tiene nombre, descripción y precio
* Puede tener múltiples talles
* Puede ser vendido en modalidad minorista y/o mayorista

---

## Talle

Variación de un producto que representa un tamaño específico.

Ejemplos:

* 1, 2, 3, 4, 5, 6
* S, M, L, XL (a futuro)

Cada talle tiene stock independiente.

---

## Stock

Cantidad disponible de un producto para un talle determinado.

El stock se gestiona por:

* Producto
* Talle

---

## Curva

Conjunto de prendas de un mismo producto que incluye **una unidad por cada talle disponible**.

Ejemplo:
Si un producto tiene talles 1, 2, 3, 4, 5 y 6:

* 1 curva = 1 unidad de cada talle
* 2 curvas = 2 unidades de cada talle

La compra por curva:

* Solo aplica a ventas mayoristas
* Representa una regla de negocio del dominio de indumentaria

---

## Pedido

Registro de una compra realizada por un usuario.

Un pedido puede incluir:

* Productos por unidad (minorista)
* Productos por curva (mayorista)

---

## Modalidad de Venta

Forma en la que se realiza una compra.

Tipos:

* Minorista
* Mayorista

La modalidad define reglas de precios, cantidades y validaciones.

---
## Compra mayorista por cantidad

Modalidad de compra mayorista en la que el usuario adquiere un número total de unidades de un producto sin utilizar el concepto de curva.

## API

Interfaz de comunicación del backend que expone funcionalidades del sistema mediante HTTP y JSON.

---

## Módulo Mayorista

Conjunto de funcionalidades exclusivas para la venta mayorista.

Incluye:

* Compra por curva
* Reglas de validación específicas
* Precios diferenciados

