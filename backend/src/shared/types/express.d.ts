import { Request } from 'express';
import { User } from 'src/modules/auth/entities/user.entity';

// Extensión de la interfaz Request para incluir el usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: User
}
