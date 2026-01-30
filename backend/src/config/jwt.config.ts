// Archivo de configuración para el servicio JWT, criterios basicos
import { JwtModuleOptions } from '@nestjs/jwt';
import { type StringValue } from 'ms';

export default (): JwtModuleOptions => ({
  global: true,
  secret: process.env.JWT_SECRET || 'default',
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || '30d',
  },
});
