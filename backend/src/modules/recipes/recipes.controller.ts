import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RecipesService } from './services/recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import type { AuthenticatedRequest } from 'src/shared/types/express';

@UseGuards(AuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('create')
  // @UsePipes(new ValidationPipe())
  async createRecipe(
    @Req() req: AuthenticatedRequest,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    console.log('Creating recipe with data:', createRecipeDto);
    console
    console.log('Authenticated user:', req.user);
    // return this.recipesService.createRecipe(createRecipeDto, req.user!);
  }

  @Get('all')
  async getAllRecipes(@Req() req: AuthenticatedRequest) {
    return this.recipesService.getAllRecipes(req.user!.id);
  }

  @Get('paginated/all')
  async getPaginatedRecipes(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.recipesService.getPaginatedRecipes(page, limit, req.user!.id);
  }

  @Get('my-recipes')
  async getMyRecipes(@Req() req: AuthenticatedRequest) {
    return this.recipesService.getAllRecipesByIdUser(req.user!.id);
  }

  @Get('paginated/my-recipes')
  async getPaginatedMyRecipes(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {

    const {data: myRecipes, meta: myRecipesMeta} = await this.recipesService.getPaginatedRecipesByIdUser(
      req.user!.id,
      page,
      limit,
    );

    const {data: collaboratedRecipes, meta: collaboratedRecipesMeta} = await this.recipesService.getPaginatedCollaboratedRecipesByIdUser(
      req.user!.id,
      page,
      limit,
    );


    return {
      data: {
        myRecipes,
        collaboratedRecipes,
      },
      meta: {
        myRecipesMeta,
        collaboratedRecipesMeta,
      },
    }
  }

  @Get('by/:recipeId')
  async getMyRecipeById(@Param('recipeId') recipeId: string) {
    return this.recipesService.getRecipeById(recipeId);
  }

  // Endpoint para volver un usuario autenticado a colaborador de una receta
  @Post('collaborate/:recipeId')
  async collaborateOnRecipe(
    @Req() req: AuthenticatedRequest,
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipesService.addCollaboratorToRecipe(recipeId, req.user!.id);
  }
}
