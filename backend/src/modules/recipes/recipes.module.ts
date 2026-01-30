import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './services/recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeStep } from './entities/recipe_step.entity';
import { RecipeIngredient } from './entities/recipe_ingredient.entity';
import { RecipeCollaborator } from './entities/recipe_colaborator.entity';
import { AuthModule } from '../auth/auth.module';
import { RecipesGateway } from './gateway/recipes.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeStep,
      RecipeIngredient,
      RecipeCollaborator,
    ]),
    AuthModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesGateway],
})
export class RecipesModule {}
