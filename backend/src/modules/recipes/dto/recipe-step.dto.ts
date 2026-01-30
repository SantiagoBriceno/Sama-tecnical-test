import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StepDto {
  @IsString({
    message: 'La instrucción del paso debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La instrucción del paso es obligatoria',
  })
  instruction: string;

  @IsNumber({}, {
    message: 'El número del paso debe ser un número',
  })
  @IsNotEmpty({
    message: 'El número del paso es obligatorio',
  })
  stepNumber: number;
}