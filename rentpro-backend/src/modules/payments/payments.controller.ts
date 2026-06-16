import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './services/payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FindPaymentByIdResponseDto } from './dto/find-payment-by-id-response.dto';

@ApiTags('Pagamentos')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async findById(@Param('id') id: string): Promise<FindPaymentByIdResponseDto> {
    return this.paymentsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento atualizado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, dto);
  }
}
