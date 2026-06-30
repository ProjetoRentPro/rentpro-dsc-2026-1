import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/auth/login', () => {
    it('deve retornar 401 com credenciais inválidas', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/v1/auth/login')
        .send({ email: 'naoexiste@test.com', senha: 'senhaerrada' })
        .expect(401);

      const body = response.body as ApiErrorBody;
      expect(body).toMatchObject({
        success: false,
        statusCode: 401,
        message: 'Credenciais inválidas',
      });
      expect(body.timestamp).toBeDefined();
      expect(body.path).toBe('/v1/auth/login');
    });

    it('deve retornar 400 com dados inválidos', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/v1/auth/login')
        .send({ email: 'nao-e-um-email' })
        .expect(400);

      const body = response.body as ApiErrorBody;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(400);
    });
  });

  describe('POST /v1/users', () => {
    it('deve retornar 400 com payload vazio', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/v1/users')
        .send({})
        .expect(400);

      const body = response.body as ApiErrorBody;
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(400);
    });
  });
});
