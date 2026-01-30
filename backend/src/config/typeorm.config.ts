import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'technical-test',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'sama-technical-test',

    // Esta configuración buscará cualquier archivo que termine en .entity.ts o .entity.js
    entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],

    // synchronize: true only desarrollo.
    synchronize: process.env.NODE_ENV !== 'production',

    // Opcional: si quieres ver las consultas SQL en la consola
    // logging: process.env.NODE_ENV !== 'production',
  }),
);
