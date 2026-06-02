import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../repositories/user.repository.interface';
import { USER_REPOSITORY } from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`E-mail ${dto.email} já está cadastrado`);
    }

    const senhaHash = await bcrypt.hash(dto.senha, BCRYPT_ROUNDS);

    const entity = new UserEntity({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      tipo: dto.tipo,
    });

    return this.userRepository.create(entity);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    Object.assign(user, dto);
    return this.userRepository.update(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return this.userRepository.delete(id);
  }
}
