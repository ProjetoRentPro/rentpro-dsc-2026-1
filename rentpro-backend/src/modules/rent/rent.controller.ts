import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RentService } from './services/rent.service';
import { ConfirmRentResponseDto } from './dto/confirm-rent-response.dto';
import { FindRentByIdResponseDto } from './dto/find-rent-by-id-response.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@ApiTags('Locações')
@ApiBearerAuth()
@Controller({ path: 'rents', version: '1' })
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar locação por ID' })
  @ApiResponse({ status: 200, description: 'Locação encontrada' })
  @ApiResponse({ status: 404, description: 'Locação não encontrada' })
  async findById(
    @Param('id') reservaId: string,
  ): Promise<FindRentByIdResponseDto> {
    return this.rentService.findById(reservaId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar locação' })
  @ApiResponse({ status: 200, description: 'Locação atualizada' })
  @ApiResponse({ status: 404, description: 'Locação não encontrada' })
  async update(@Param('id') reservaId: string, @Body() dto: UpdateRentDto) {
    return this.rentService.update(reservaId, dto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar locação' })
  @ApiResponse({ status: 201, description: 'Locação confirmada' })
  @ApiResponse({ status: 404, description: 'Locação não encontrada' })
  async confirmRent(
    @Param('id') reservaId: string,
  ): Promise<ConfirmRentResponseDto> {
    return this.rentService.ConfirmRent(reservaId);
  }
}
