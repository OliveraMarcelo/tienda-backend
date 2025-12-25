# ✅ Casos de Aceptación – Fase 1: Fundaciones del sistema

Este documento define las condiciones que deben cumplirse para considerar
completas las historias de usuario de la Fase 1.

---

## HU-01 – Registro de usuario

### CA-01.1
Dado un usuario no registrado  
Cuando envía un email válido y una contraseña  
Entonces el sistema debe crear el usuario correctamente.

### CA-01.2
Dado un email ya registrado  
Cuando el usuario intenta registrarse  
Entonces el sistema debe rechazar la operación.

### CA-01.3
Dado un registro exitoso  
Entonces la contraseña debe almacenarse en forma encriptada.

---

## HU-02 – Login de usuario

### CA-02.1
Dado un usuario registrado  
Cuando ingresa credenciales válidas  
Entonces el sistema debe permitir el inicio de sesión.

### CA-02.2
Dado un usuario con credenciales inválidas  
Cuando intenta iniciar sesión  
Entonces el sistema debe rechazar el acceso.

---

## HU-03 – Generación de token de acceso

### CA-03.1
Dado un login exitoso  
Entonces el sistema debe devolver un token de acceso.

### CA-03.2
Dado un token emitido  
Entonces el token debe permitir identificar al usuario autenticado.

---

## HU-04 – Protección de endpoints

### CA-04.1
Dado un endpoint protegido  
Cuando se accede sin token  
Entonces el sistema debe rechazar la solicitud.

### CA-04.2
Dado un endpoint protegido  
Cuando se accede con un token válido  
Entonces el sistema debe permitir el acceso.

---

## HU-05 – Creación de roles

### CA-05.1
Dado un administrador autenticado  
Cuando crea un nuevo rol  
Entonces el rol debe persistirse correctamente.

### CA-05.2
Dado un rol existente  
Cuando se intenta crear otro con el mismo nombre  
Entonces el sistema debe rechazar la operación.

---

## HU-06 – Asignación de roles a usuarios

### CA-06.1
Dado un usuario existente  
Cuando se le asigna un rol  
Entonces el usuario debe quedar asociado a ese rol.

### CA-06.2
Dado un usuario con múltiples roles  
Entonces el sistema debe conservar todas las asociaciones.

---

## HU-07 – Persistencia de usuarios

### CA-07.1
Dado un usuario creado  
Entonces sus datos deben persistirse en la base de datos.

### CA-07.2
Dado un error de persistencia  
Entonces el sistema no debe quedar en estado inconsistente.

---

## HU-08 – Migraciones de base de datos

### CA-08.1
Dado un entorno nuevo
