import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from '../entities/recipe_ingredient.entity';
import { RecipeStep } from '../entities/recipe_step.entity';
import { RecipeCollaborator } from '../entities/recipe_colaborator.entity';
import { DataSource, Not } from 'typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import {
  recipeConsultOptions,
  recipeDetailsConsultOptions,
} from '../types/recipes';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(RecipeStep)
    private readonly recipeStepRepository: Repository<RecipeStep>,
    @InjectRepository(RecipeCollaborator)
    private readonly recipeCollaboratorRepository: Repository<RecipeCollaborator>,
    private readonly dataSource: DataSource,
  ) {}

  async createRecipe(newRecipeData: CreateRecipeDto, user: User) {
    const { title, description, ingredients, steps } = newRecipeData;

    // Al igual que en el caso de usuarios, en la creacion de la recetas debemos tener en cuenta que la informacion se reparte en varias tablas relacionadas, por lo que debemos manejar transacciones para evitar inconsistencias en los datos.

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Creamos la entidad principal de Receta
      const recipe = queryRunner.manager.create(Recipe, {
        title,
        description,
        author: user,
        lastEditor: user,
      });

      const savedRecipe = await queryRunner.manager.save(recipe);

      // Creamos las entidades de Ingredientes relacionadas con la receta
      for (const ingredientData of ingredients) {
        const ingredient = queryRunner.manager.create(RecipeIngredient, {
          ...ingredientData,
          addBy: user,
          recipe: savedRecipe,
        });
        await queryRunner.manager.save(ingredient);
      }

      // Creamos las entidades de Pasos relacionadas con la receta
      for (const stepData of steps) {
        const step = queryRunner.manager.create(RecipeStep, {
          ...stepData,
          author: user,
          recipe: savedRecipe,
        });
        await queryRunner.manager.save(step);
      }

      const collaborator = queryRunner.manager.create(RecipeCollaborator, {
        user: user,
        recipe: savedRecipe,
      });
      await queryRunner.manager.save(collaborator);
      await queryRunner.commitTransaction();

      console.log('Receta creada exitosamente:', savedRecipe);
      return savedRecipe;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllRecipes(idUser: string = ''): Promise<{ data: Recipe[] }> {
    const recipes = await this.recipeRepository.find({
      ...recipeConsultOptions,
      where: {
        author: {
          id: idUser !== '' ? Not(idUser) : undefined,
        },
      },
    });
    return {
      data: recipes,
    };
  }

  async getPaginatedRecipes(
    page: number = 1,
    limit: number = 10,
    idUser: string = '',
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.recipeRepository.findAndCount({
      ...recipeConsultOptions,
      // Si hay idUser, queremos solo las recetas donde el usuario no es el author
      where: {
        author: {
          id: idUser !== '' ? Not(idUser) : undefined,
        },
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // Metodo para obtener todas las recetas donde un usuario es author
  async getAllRecipesByIdUser(idUser: string): Promise<{ data: Recipe[] }> {
    const recipesAuthored = await this.recipeRepository.find({
      where: {
        author: { id: idUser },
      },
      ...recipeConsultOptions,
    });

    return {
      data: recipesAuthored,
    };
  }

  // Metodo para obtener las recetas de un usuario con paginacion
  async getPaginatedRecipesByIdUser(
    idUser: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.recipeRepository.findAndCount({
      where: {
        author: { id: idUser },
      },
      ...recipeConsultOptions,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // Metodo para obtener todas las recetas donde un usuario es colaborador
  async getAllCollaboratedRecipesByIdUser(
    idUser: string,
  ): Promise<{ data: Recipe[] }> {
    // Buscamos las recetas donde el usuario es colaborador
    const recipesCollaborated = await this.recipeRepository.find({
      where: {
        collaborators: {
          user: { id: idUser },
        },
      },
      ...recipeConsultOptions,
    });
    return {
      data: recipesCollaborated,
    };
  }

  async getPaginatedCollaboratedRecipesByIdUser(
    idUser: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.recipeRepository.findAndCount({
      where: {
        collaborators: {
          user: { id: idUser },
        },
      },
      ...recipeConsultOptions,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async getRecipeById(id: string): Promise<{ data: Recipe | null }> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      ...recipeDetailsConsultOptions,
    });

    return { data: recipe };
  }

  async addCollaboratorToRecipe(
    recipeId: string,
    userId: string,
  ): Promise<{ data: Recipe | null }> {
    // Verificamos que la receta exista
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    if (!recipe) {
      console.log('Receta no encontrada con ID:', recipeId);
      throw new Error('Receta no encontrada');
    }

    // Verificamos que el usuario no sea ya colaborador
    const existingCollaborator =
      await this.recipeCollaboratorRepository.findOne({
        where: {
          recipe: { id: recipeId },
          user: { id: userId },
        },
      });

    if (existingCollaborator) {
      console.log('El usuario ya es colaborador de la receta:', recipeId);
      return { data: null };
    }

    // Si no es colaborador, lo agregamos

    const collaborator = this.recipeCollaboratorRepository.create({
      recipe: recipe,
      user: { id: userId } as User,
    });
    await this.recipeCollaboratorRepository.save(collaborator);
    const recipeUpdated = await this.recipeRepository.findOne({
      where: { id: recipeId },
      ...recipeDetailsConsultOptions,
    });
    console.log('Usuario agregado como colaborador a la receta:', recipeId);
    return { data: recipeUpdated };
  }

  async updateRecipe(
    id: string,
    updatedData: Partial<CreateRecipeDto>,
    userId: string,
  ) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new Error('Receta no encontrada');
    }

    // Si updatedData tiene ingredientes o pasos, tenemos que anexarle addBy
    if (updatedData.ingredients) {
      // Eliminamos los ingredientes anteriores para evitar duplicados
      await this.recipeIngredientRepository.delete({
        recipe: { id: recipe.id },
      });
      // Luego asignamos el addBy a cada ingrediente nuevo
      for (const ingredient of updatedData.ingredients) {
        Object.assign(ingredient, { addBy: { id: userId } as User });
      }
    }

    if (updatedData.steps) {
      // Eliminamos los pasos anteriores para evitar duplicados
      await this.recipeStepRepository.delete({ recipe: { id: recipe.id } });
      // Luego asignamos el author a cada paso nuevo
      for (const step of updatedData.steps) {
        Object.assign(step, { author: { id: userId } as User });
      }
    }

    const newData = {
      ...updatedData,
      lastEditor: { id: userId } as User,
    };

    Object.assign(recipe, newData);
    const updatedRecipe = await this.recipeRepository.save(recipe);
    return { data: updatedRecipe };
  }
}
