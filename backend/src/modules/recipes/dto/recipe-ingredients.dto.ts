import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UnitType } from 'src/shared/types/types';

export class RecipeIngredientDto {
  @IsString({
    message: 'El nombre del ingrediente debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre del ingrediente es obligatorio',
  })
  name: string;

  @IsString({
    message: 'La cantidad del ingrediente debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La cantidad del ingrediente es obligatoria',
  })
  quantity: string;

  @IsEnum(UnitType, {
    message: 'El tipo de unidad no es válido',
  })
  unit: UnitType;
}
