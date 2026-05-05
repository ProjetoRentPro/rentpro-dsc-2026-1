import {NotFoundException} from "@nestjs/common";

export class RentNotFoundException extends NotFoundException {
  constructor(reserva_id: number) {
    super(`Rent with id ${reserva_id} not found`);
  }
}