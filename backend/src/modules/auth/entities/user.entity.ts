import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserCredentials } from './user_credentials.entity';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // Podemos agregar más campos según las necesidades del proyecto, en este caso ejemplificaré el caso con timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  lastLogin: Date;

  // Establecemos la relacion que tendremos naturalmente con User_credentials

  @OneToOne(() => UserCredentials, (credentials) => credentials.user, {
    cascade: true,
  })
  credentials: UserCredentials;

  // Establecemos las relaciones con las recetas, ellas seran solamente de lectura y tendremos los datos solamente cuando se consulte el usuario y se quiera obtener las recetas asociadas

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  authoredRecipes: Recipe[];

  @OneToMany(() => Recipe, (recipe) => recipe.lastEditor)
  lastEditedRecipes: Recipe[];

  // Relacion con las recetas en las que el usuario es colaborador
  @OneToMany(() => Recipe, (recipe) => recipe.author)
  collaboratedRecipes: Recipe[];
}
