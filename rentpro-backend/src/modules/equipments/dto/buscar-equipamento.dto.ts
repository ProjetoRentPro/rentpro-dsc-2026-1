import { IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class BuscarEquipamentoDto {
  constructor(data?: Partial<BuscarEquipamentoDto>) {
    Object.assign(this, data);
  }

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  localizacao?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  precoMaximo?: number;
}
