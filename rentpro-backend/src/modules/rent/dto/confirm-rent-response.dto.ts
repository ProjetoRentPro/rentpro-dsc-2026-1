import {RentStatusEnum} from "../../../commons/enums/rent-status.enum";
export class ConfirmRentResponseDto {
    constructor(
        public reserva_id: number,
        public RentStatus: RentStatusEnum
    ) {}
}