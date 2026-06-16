import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

export class UpdateEquipmentDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  localizacao?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precoDiaria?: number;

  @IsEnum(StatusEquipamento)
  @IsOptional()
  status?: StatusEquipamento;
}
