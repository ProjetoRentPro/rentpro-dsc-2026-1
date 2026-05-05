import {RentStatus} from "../../../commons/enums/rent-status.enum";
export class ConfirmRentResponseDto {
    constructor(
        public reserva_id: string,
        public RentStatus: RentStatus
    ) {}
}