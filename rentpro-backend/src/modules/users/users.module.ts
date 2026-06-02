import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserTypeOrmRepository } from './repositories/user-type-orm.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UsersModule {}
