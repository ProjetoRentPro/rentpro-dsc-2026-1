import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EquipmentService } from './services/equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { FindEquipmentByIdResponseDto } from './dto/find-equipment-by-id-response.dto';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<FindEquipmentByIdResponseDto> {
    return this.equipmentService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.delete(id);
  }

  
}
