import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_credential')
export class UserCredentials {
  // Primary key UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Generamos los campos que utilizaremos para la prueba técnica
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password_hash: string;

  // Podemos agregar más campos según las necesidades del proyecto, en este caso ejemplificaré el caso con timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Establecemos la relacion que tendremos naturalmente con User
  @OneToOne(() => User, (user) => user.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' }) // <--- ESTO CREA LA COLUMNA userId EN LA DB
  user: User;
}
