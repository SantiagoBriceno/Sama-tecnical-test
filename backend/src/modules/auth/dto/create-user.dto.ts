import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'El nombre de usuario es obligatorio',
  })
  @IsString({
    message: 'El usuario ingresado no es válido',
  })
  @MaxLength(50, {
    message: 'El nombre de usuario no puede tener más de 50 caracteres',
  })
  @MinLength(2, {
    message: 'El nombre de usuario debe tener al menos 2 caracteres',
  })
  readonly username: string;

  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  @MinLength(6, {
    message: 'La contraseña es demasiado corta',
  })
  @MaxLength(100, {
    message: 'La contraseña es demasiado larga',
  })
  readonly password: string;

  // Podemos controlar confirmPassword en el service si es necesario, por ahora lo dejamos simple
}
