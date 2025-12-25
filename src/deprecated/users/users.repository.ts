/* export const createUser = async (email: string, password_hash: string) => {
    try {
        console.log('[Repository] Insertando usuario en la base de datos:', email);
        const { rows } = await pool.query(CREATE_USER, [email, password_hash]);
        console.log('[Repository] Resultado de inserción:', rows[0]);
        return rows[0];
    } catch (error: any) {
        console.error('[Repository] Error al crear usuario:', error);
        throw new Error(error.message);
     }
};
export const findByEmail = async (email: string) => {
    try {
        console.log('[Repository] Buscando usuario por email:', email);
        const { rows } = await pool.query(FIND_BY_EMAIL, [email]);
        console.log('[Repository] Resultado búsqueda:', rows[0]);
        return rows[0];
    } catch (error: any) {
        console.error('[Repository] Error al buscar usuario:', error);
        throw new Error(error.message);
    }
};  */