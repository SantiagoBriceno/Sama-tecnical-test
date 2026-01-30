import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './services/auth/auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  // Endpoint para el registro de usuarios
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // Endpoint para el login de usuarios
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }
}
