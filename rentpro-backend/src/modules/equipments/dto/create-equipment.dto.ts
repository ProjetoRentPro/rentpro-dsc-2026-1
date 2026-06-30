import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @Min(1)
  proprietarioId!: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsString()
  @IsNotEmpty()
  localizacao!: string;

  @IsNumber()
  @IsPositive()
  precoDiaria!: number;

  @IsEnum(StatusEquipamento)
  @IsOptional()
  status?: StatusEquipamento;
}
