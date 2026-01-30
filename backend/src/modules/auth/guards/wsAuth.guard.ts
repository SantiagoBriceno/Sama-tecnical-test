import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(AuthService) private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      // Extraer el token del handshake (authorization: Bearer <token>)
      const authToken = client.handshake.headers.authorization?.split(' ')[1];

      if (!authToken) throw new WsException('No se encontró el token');

      const payload = await this.jwtService.verifyAsync(authToken);

     

      // Inyectamos el usuario en el socket para usarlo luego
      client.user = payload;

      return true;
    } catch (err) {
      throw new WsException('No autorizado');
    }
  }
}
