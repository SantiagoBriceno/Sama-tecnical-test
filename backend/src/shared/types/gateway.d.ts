import { Socket } from 'socket.io';
import { User } from 'src/modules/auth/entities/user.entity';

// Extensión de la interfaz Socket para incluir el usuario autenticado
export interface authenticatedClient extends Socket {
  user: {
    sub: string;
    username: string;
  }
}