// DTO para la validación de datos de inicio de sesión de usuario. SE IMPLEMENTO VALIDACIONES BASICAS CON CLASS-VALIDATOR
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @MaxLength(100, { message: 'Demasiado largo' })
  @IsString({ message: 'Debe ser string' })
  @IsNotEmpty({ message: 'El Usuario es obligatorio' })
  readonly username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La contraseña es demasiado larga' })
  readonly password: string;
}
