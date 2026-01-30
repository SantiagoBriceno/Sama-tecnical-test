import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserCredentials } from '../../entities/user_credentials.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserCredentials)
    private readonly userCredentialsRepository: Repository<UserCredentials>,
    private readonly dataSource: DataSource,
  ) {}

  async registerUser(newUser: CreateUserDto) {
    const { username, password } = newUser;

    // Este metodo registra un nuevo usuario en la aplicación, como en nuestra estructura de base de datos, user y user_credentials están separados (Participan 2 tables) debemos verificar ambas transacciones para evitar inconsistencias en los datos registrados. Nest nos permite manejar transacciones con TypeORM de manera sencilla con ayuda de DataSources.

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hasheamos la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Creamos la entidad Usuario
      const user = queryRunner.manager.create(User);

      const savedUser = await queryRunner.manager.save(user);

      // Creamos la entidad UserCredentials estableciendo la relación con el usuario creado previamente
      const newCredentials = queryRunner.manager.create(UserCredentials, {
        username,
        password_hash: hashedPassword,
        user: savedUser,
      });

      await queryRunner.manager.save(newCredentials);

      // Ejecutamos la transacción
      await queryRunner.commitTransaction();
      return { id: savedUser.id, username: newCredentials.username };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Establecemos un manejo de errores básico para la prueba, se puede mejorar según las necesidades del proyecto
      if (error.code === '23505') {
        throw new ConflictException('El nombre de usuario ya está en uso');
      } else {
        throw error;
      }
    } finally {
      // Limpiamos el queryRunner para evitar exceso de conexiones abiertas.
      await queryRunner.release();
    }
  }

  getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        credentials: { username },
      },
      relations: ['credentials'],
    });
  }

  getUserByUsernameForLogin(username: string): Promise<UserCredentials | null> {
    return this.userCredentialsRepository.findOne({
      where: { username },
      relations: ['user'],
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLogin: new Date(),
    });
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['credentials'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
