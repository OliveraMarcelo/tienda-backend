## Modelo Entidad–Relación: Usuarios y Roles

El sistema utiliza una relación muchos a muchos entre usuarios y roles,
implementada mediante la tabla intermediaria `user_roles`.

Esta decisión permite:
- Asignar múltiples roles a un usuario
- Reutilizar roles entre usuarios
- Mantener integridad referencial

Ver diagrama: docs/der/usuarios-roles.png
