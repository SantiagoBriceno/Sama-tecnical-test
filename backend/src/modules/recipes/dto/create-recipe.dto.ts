// DTO para crear una receta, esta debe tener los siguientes atributos:
//-title: string (título de la receta) obligatorio
// description: string (descripción de la receta) obligatorio
// ingredients: Object[] (lista de ingredientes) al menos un ingrediente obligatorio en la forma { name: string, quantity: string }
// steps: string[] (lista de pasos para preparar la receta) al menos un paso obligatorio en la forma {instruction: string, stepNumber: number}

import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { UnitType } from 'src/shared/types/types';
import { RecipeIngredientDto } from './recipe-ingredients.dto';
import { StepDto } from './recipe-step.dto';
import { Type } from 'class-transformer';

export class CreateRecipeDto {
  @IsNotEmpty({
    message: 'El título de la receta es obligatorio',
  })
  @IsString({
    message: 'El título de la receta debe ser una cadena de texto',
  })
  @MaxLength(100, {
    message: 'El título de la receta no puede tener más de 100 caracteres',
  })
  @MinLength(2, {
    message: 'El título de la receta debe tener al menos 2 caracteres',
  })
  readonly title: string;


  @IsNotEmpty({
    message: 'La descripción de la receta es obligatoria',
  })
  @IsString({
    message: 'La descripción de la receta debe ser una cadena de texto',
  })
  @MaxLength(1000, {
    message:
      'La descripción de la receta no puede tener más de 1000 caracteres',
  })
  @MinLength(5, {
    message: 'La descripción de la receta debe tener al menos 5 caracteres',
  })
  readonly description: string;

  @IsArray({
    message: 'Los ingredientes deben ser un arreglo',
  })
  @ArrayMinSize(1, {
    message: 'Debe haber al menos un ingrediente',
  })
  @ValidateNested({each: true})
  @Type(() => RecipeIngredientDto)
  readonly ingredients: RecipeIngredientDto[];

  @IsArray({
    message: 'Los pasos deben ser un arreglo',
  })
  @ArrayMinSize(1, {
    message: 'Debe haber al menos un paso',
  })
  @ValidateNested({each: true})
  @Type(() => StepDto)
  readonly steps: StepDto[];
  
}
