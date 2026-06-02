import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../commons/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha!: string;

  @IsEnum(UserRole)
  tipo!: UserRole;
}
