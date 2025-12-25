import 'reflect-metadata';

import { createApp } from './app.js';
import { connectDB } from './config/database.js';
import { AppDataSource } from './config/typeorm.js';
import { ENV } from './config/env.js';

async function bootstrap() {
  await connectDB();
  console.log('PostgreSQL conectado');

  await AppDataSource.initialize();
  console.log('TypeORM inicializado');

  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`Servidor corriendo ${ENV.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app', err);
  process.exit(1);
});
