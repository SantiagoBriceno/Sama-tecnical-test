import { User } from "src/modules/auth/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe.entity";

@Entity('recipe_step')
export class RecipeStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  stepNumber: number;

  @Column({ type: 'text' })
  instruction: string;

  // Relación con la receta a la que pertenece el paso, una receta puede tener muchos pasos
  @ManyToOne(() => Recipe, (recipe) => recipe.steps, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'id_recipe' })
  recipe: Recipe;

  // Relacion con los usuarios, el que creó o añadió el paso de la receta
  @ManyToOne(() => User)
  @JoinColumn({ name: 'add_by' })
  author: User;
}