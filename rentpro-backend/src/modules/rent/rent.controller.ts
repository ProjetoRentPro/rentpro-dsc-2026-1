import {Controller, Post,Param,} from "@nestjs/common";
import { RentService } from "./services/rent.service";
import { ConfirmRentResponseDto } from "./dto/confirm-rent-response.dto";

@Controller('rents')
export class RentController {
    constructor(private readonly rentService: RentService) {}

    @Post(':id/confirm')
    async confirmRent(@Param('id') reservaId: string,): Promise<ConfirmRentResponseDto> {
        return this.rentService.ConfirmRent(reservaId );
    }
}