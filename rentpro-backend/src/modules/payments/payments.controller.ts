import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FindPaymentByIdResponseDto } from './dto/find-payment-by-id-response.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<FindPaymentByIdResponseDto> {
    return this.paymentsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, dto);
  }
}
