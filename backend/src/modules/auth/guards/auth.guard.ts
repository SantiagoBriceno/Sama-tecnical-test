import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth/auth.service';

// Se crea el Guard para proteger las rutas que requieran autenticación JWT
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        'Token de autenticación no proporcionado.',
      );
    }
    try {
      const payload = await this.authService.verifyToken(token);
      request['user'] = await this.authService.getUserById(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
    return true;
  }

  // Función auxiliar para extraer el token del encabezado de autorización (en este caso BEARER)
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Tu lógica original para verificar el prefijo 'Bearer ' y que exista el token.
    if (type !== 'Bearer' || !token) {
      return undefined;
    }
    return token;
  }
}
