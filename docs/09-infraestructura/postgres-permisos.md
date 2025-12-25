
# 📄 Documentación: Permisos en PostgreSQL y errores comunes

**Archivo recomendado:** `docs/postgres-permisos.md`

````md
# Permisos en PostgreSQL – Errores comunes y solución

## Contexto

Durante la Fase 1.5 del proyecto se intentó ejecutar una migración SQL
para crear tablas (`users`, `roles`, `user_roles`) y PostgreSQL devolvió
el siguiente error:

ERROR: permission denied for schema public

Este documento explica por qué ocurre y cómo solucionarlo correctamente.

---

## Error observado

Al ejecutar una migración:

psql -h localhost -U tienda_user -d tienda_db -f 001_init.sql

PostgreSQL devuelve:

ERROR: permission denied for schema public
current transaction is aborted, commands ignored until end of transaction block

---

## Causa real del problema

En PostgreSQL existen tres niveles distintos que suelen confundirse:

1. Usuario
2. Base de datos
3. Schema (por defecto: `public`)

Crear una base de datos y asignar un usuario **NO implica**
que ese usuario tenga permisos para crear tablas dentro del schema `public`.

Aunque se ejecute:

GRANT ALL PRIVILEGES ON DATABASE tienda_db TO tienda_user;

el usuario **no puede crear tablas** si no tiene permisos explícitos
sobre el schema.

PostgreSQL no asume permisos. Nunca.

---

## Qué es el schema `public`

- Un schema es como una carpeta dentro de la base de datos
- Todas las tablas, por defecto, se crean en `public`
- Si el usuario no tiene permiso sobre el schema, cualquier `CREATE TABLE` falla

---

## Solución correcta

### 1. Entrar como usuario administrador

```bash
sudo -u postgres psql
````

### 2. Conectarse a la base de datos

```sql
\c tienda_db
```

### 3. Otorgar permisos sobre el schema `public`

```sql
GRANT USAGE, CREATE ON SCHEMA public TO tienda_user;
```

Recomendado para evitar problemas futuros:

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO tienda_user;
```

Salir:

```sql
\q
```

---

## Reintentar la migración

```bash
psql -h localhost -U tienda_user -d tienda_db -f 001_init.sql
```

Resultado esperado:

BEGIN
CREATE TABLE
CREATE TABLE
CREATE TABLE
COMMIT

---

## Verificación

```sql
\dt
```

Tablas esperadas:

* users
* roles
* user_roles

---

## Lecciones aprendidas

* Base de datos ≠ schema
* Permisos de DB ≠ permisos de schema
* PostgreSQL es estricto por diseño
* Este comportamiento es igual en producción

---

## Regla de oro

Siempre que se cree un usuario nuevo en PostgreSQL y se espere que cree tablas,
hay que otorgar permisos explícitos sobre el schema correspondiente.

````

---

