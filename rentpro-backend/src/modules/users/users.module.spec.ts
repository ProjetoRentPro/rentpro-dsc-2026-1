import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

describe('UsersModule', () => {
  it('deve compilar o módulo sem erros', async () => {
    const repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    expect(module).toBeDefined();
  });

  it('deve expor UserService', async () => {
    const repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    const service = module.get(UserService);
    expect(service).toBeDefined();
  });

  it('deve expor UserController', async () => {
    const repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    const controller = module.get(UserController);
    expect(controller).toBeDefined();
  });

  it('deve registrar USER_REPOSITORY', async () => {
    const repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repoMock)
      .compile();

    const repo: unknown = module.get(USER_REPOSITORY);
    expect(repo).toBeDefined();
  });
});
