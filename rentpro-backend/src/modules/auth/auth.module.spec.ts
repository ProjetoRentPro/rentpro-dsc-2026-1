import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../users/entities/user.entity';

describe('AuthModule', () => {
  const repoMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  it('deve compilar o módulo sem erros', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    expect(module).toBeDefined();
  });

  it('deve expor AuthService', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    const service = module.get(AuthService);
    expect(service).toBeDefined();
  });

  it('deve expor AuthController', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    const controller = module.get(AuthController);
    expect(controller).toBeDefined();
  });
});
