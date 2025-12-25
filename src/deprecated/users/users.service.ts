/* import * as userRepository from './users.repository.js';
// si el usuario ya existe, validando por email, lanzar un error 
// si no, crear el usuario
export const register = async (email: string, password: string) => {
    console.log('[Service] Verificando si el usuario existe:', email);
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        console.log('[Service] Usuario ya existe:', email);
        throw new Error('El usuario ya existe');
    }
    console.log('[Service] Usuario no existe, creando usuario...');
    const user = await userRepository.createUser(email, password);
    console.log('[Service] Usuario creado:', user);
    return user;
}; */