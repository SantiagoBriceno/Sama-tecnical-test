import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../../dto/login-user.dto';
import { UserService } from '../user/user.service';
import { User } from '../../entities/user.entity';
import { AuthPayload } from 'src/shared/types/types';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(
    loginUser: LoginUserDto,
  ): Promise<{ accessToken: string; username: string }> {
    const { username, password } = loginUser;
    const user = await this.userService.getUserByUsernameForLogin(username);

    // console.log('User fetched for login:', user);

    const passwordIsCorrect = !user
      ? false
      : await this.userService.comparePasswords(password, user.password_hash);

    if (!(user && passwordIsCorrect)) {
      throw new ForbiddenException('Credenciales inválidas');
    }

    const accessToken = await this.generateAuthToken(
      user.user.id,
      user.username,
    );
    await this.userService.updateLastLogin(user.user.id);

    return { accessToken, username: user.username };
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.registerUser(createUserDto);
    const accessToken = await this.generateAuthToken(
      newUser.id,
      newUser.username,
    );
    return { accessToken, username: newUser.username };
  }

  async generateAuthToken(id: string, username: string): Promise<string> {
    const payload: AuthPayload = {
      sub: id,
      username: username,
    };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<AuthPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async getUserById(id: string): Promise<User> {
    return this.userService.getUserById(id);
  }
}
