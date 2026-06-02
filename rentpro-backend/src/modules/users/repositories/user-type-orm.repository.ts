import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(entity: UserEntity): Promise<UserEntity> {
    return this.repo.save(entity);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}
