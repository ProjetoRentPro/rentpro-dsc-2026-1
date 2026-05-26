import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RentService } from "./services/rent.service";
import { ConfirmRentResponseDto } from "./dto/confirm-rent-response.dto";
import { FindRentByIdResponseDto } from "./dto/find-rent-by-id-response.dto";
import { UpdateRentDto } from "./dto/update-rent.dto";

@Controller('rents')
export class RentController {
    constructor(private readonly rentService: RentService) {}

    @Get(':id')
    async findById(@Param('id') reservaId: string): Promise<FindRentByIdResponseDto> {
        return this.rentService.findById(reservaId);
    }

    @Patch(':id')
    async update(
        @Param('id') reservaId: string,
        @Body() dto: UpdateRentDto,
    ) {
        return this.rentService.update(reservaId, dto);
    }

    @Post(':id/confirm')
    async confirmRent(@Param('id') reservaId: string): Promise<ConfirmRentResponseDto> {
        return this.rentService.ConfirmRent(reservaId);
    }
}