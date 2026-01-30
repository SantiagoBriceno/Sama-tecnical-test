import { User } from "src/modules/auth/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe.entity";
import type { UnitType } from "src/shared/types/types";

@Entity('recipe_ingredient')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100 , nullable: true})
  quantity: string;

  @Column({ type: 'enum', enum: ['gr', 'ml', 'taza', 'unidad', 'kg', ''] , nullable: true })
  unit: UnitType;
  // Relación con la receta a la que pertenece el ingrediente, muchas ingredientes pueden pertenecer a una receta
  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'id_recipe' })
  recipe: Recipe;

  // Relacion con los usuarios, el que creó o añadio el ingrediente de la receta
  @ManyToOne(() => User, (user) => user.authoredRecipes)
  @JoinColumn({ name: 'add_by' })
  addBy: User; 
}