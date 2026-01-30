import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import { RecipeStep } from './recipe_step.entity';
import { RecipeCollaborator } from './recipe_colaborator.entity';

@Entity('recipe')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Relación con los usuarios puede ser de 2 tipos: el que creó la receta y el que la editó por última vez
  @ManyToOne(() => User, (user) => user.authoredRecipes)
  @JoinColumn({ name: 'create_by' })
  author: User;

  @ManyToOne(() => User, (user) => user.lastEditedRecipes)
  @JoinColumn({ name: 'last_editor' })
  lastEditor: User;

  // Relación con los ingredientes de la receta, una receta puede tener muchos ingredientes
  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe, {
    cascade: true,
  })
  ingredients: RecipeIngredient[];

  // Relación con los pasos de la receta, una receta puede tener muchos pasos
  @OneToMany(() => RecipeStep, (step) => step.recipe, {
    cascade: true,
  })
  steps: RecipeStep[];

  // Una receta tiene muchos colaboradores
  @OneToMany(() => RecipeCollaborator, (collaborator) => collaborator.recipe)
  collaborators: RecipeCollaborator[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
