import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORY } from '../../users/repositories/user.repository.interface';
import { UserEntity } from '../../users/entities/user.entity';

const BCRYPT_ROUNDS = 12; // RN05: custo mínimo 12

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, BCRYPT_ROUNDS);
  }

  async validateUser(
    email: string,
    senha: string,
  ): Promise<Omit<UserEntity, 'senhaHash'> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const senhaValida = await bcrypt.compare(senha, user.senhaHash);
    if (!senhaValida) return null;

    // Remove senhaHash antes de retornar
    const { senhaHash: _, ...userSemSenha } = user;
    return userSemSenha as Omit<UserEntity, 'senhaHash'>;
  }

  async login(user: Omit<UserEntity, 'senhaHash'>): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email, tipo: user.tipo };
    return { access_token: this.jwtService.sign(payload) };
  }
}
