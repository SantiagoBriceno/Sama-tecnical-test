import { User } from 'src/modules/auth/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_collaborator')
export class RecipeCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con la receta
  @ManyToOne(() => Recipe, (recipe) => recipe.collaborators)
  @JoinColumn({ name: 'id_recipe' })
  recipe: Recipe;

  // Relación con el usuario colaborador
  @ManyToOne(() => User, (user) => user.collaboratedRecipes)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
