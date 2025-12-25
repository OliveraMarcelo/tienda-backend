# 📘 Casos de Uso – Fase 1: Fundaciones del sistema

Este documento describe los casos de uso correspondientes a la Fase 1.
Se enfoca exclusivamente en usuarios, autenticación, roles y base del sistema.

No incluye lógica de negocio, productos, pedidos ni pagos.

---

## CU-01 – Registrar usuario

**Actor principal:** Usuario  
**Descripción:** Permite a una persona crear una cuenta en el sistema.

**Precondiciones:**
- El usuario no está registrado

**Flujo principal:**
1. El usuario solicita el registro
2. El sistema solicita email y contraseña
3. El usuario ingresa los datos
4. El sistema valida la información
5. El sistema crea el usuario

**Postcondiciones:**
- El usuario queda registrado en el sistema

**Flujos alternativos:**
- Email ya existente → el sistema rechaza el registro

---

## CU-02 – Autenticarse en el sistema

**Actor principal:** Usuario  
**Descripción:** Permite al usuario iniciar sesión.

**Precondiciones:**
- El usuario está registrado

**Flujo principal:**
1. El usuario solicita iniciar sesión
2. Ingresa email y contraseña
3. El sistema valida credenciales
4. El sistema autentica al usuario
5. El sistema genera un token de acceso

**Postcondiciones:**
- El usuario queda autenticado

**Flujos alternativos:**
- Credenciales inválidas → acceso denegado

---

## CU-03 – Validar acceso a recursos protegidos

**Actor principal:** Sistema  
**Descripción:** Controla el acceso a funcionalidades según autenticación.

**Precondiciones:**
- Existe un recurso protegido

**Flujo principal:**
1. El usuario solicita acceso a un recurso
2. El sistema valida el token
3. Si el token es válido, permite el acceso

**Postcondiciones:**
- El recurso es accesible solo para usuarios autenticados

---

## CU-04 – Crear rol

**Actor principal:** Administrador  
**Descripción:** Permite crear roles del sistema.

**Precondiciones:**
- El administrador está autenticado

**Flujo principal:**
1. El administrador solicita crear un rol
2. El sistema valida el nombre
3. El sistema guarda el rol

**Postcondiciones:**
- El rol queda disponible para asignación

---

## CU-05 – Asignar roles a usuario

**Actor principal:** Administrador  
**Descripción:** Permite asociar roles a un usuario.

**Precondiciones:**
- El usuario existe
- El rol existe

**Flujo principal:**
1. El administrador selecciona un usuario
2. Selecciona uno o más roles
3. El sistema registra la asociación

**Postcondiciones:**
- El usuario queda asociado a los roles asignados

---

## CU-06 – Persistir datos del sistema

**Actor principal:** Sistema  
**Descripción:** Garantiza la persistencia de datos base.

**Precondiciones:**
- La base de datos está disponible

**Flujo principal:**
1. El sistema ejecuta operaciones de persistencia
2. Maneja errores de forma controlada

**Postcondiciones:**
- Los datos quedan almacenados correctamente

