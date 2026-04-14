import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /*descricao(): string {
    return 'Projeto de estudo utilizando NestJS, TypeScript, Prisma e PostgreSQL';
  }*/
}

