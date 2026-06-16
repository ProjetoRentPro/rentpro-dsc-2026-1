import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EquipmentService } from './services/equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { FindEquipmentByIdResponseDto } from './dto/find-equipment-by-id-response.dto';
import { EquipmentEntity } from './entities/equipment.entity';

@ApiTags('Equipamentos')
@ApiBearerAuth()
@Controller({ path: 'equipments', version: '1' })
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar novo equipamento' })
  @ApiResponse({ status: 201, description: 'Equipamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os equipamentos disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de equipamentos' })
  async findAll(): Promise<EquipmentEntity[]> {
    return this.equipmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar equipamento por ID' })
  @ApiResponse({ status: 200, description: 'Equipamento encontrado' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  async findById(@Param('id') id: string): Promise<FindEquipmentByIdResponseDto> {
    const equipment = await this.equipmentService.findById(id);
    return new FindEquipmentByIdResponseDto(equipment);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar equipamento' })
  @ApiResponse({ status: 200, description: 'Equipamento atualizado' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover equipamento' })
  @ApiResponse({ status: 204, description: 'Equipamento removido' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.equipmentService.delete(id);
  }
}
