import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existUser) {
      throw new NotFoundException('User Already Exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...registerDto, password: hashedPassword }),
    );
    return this.buildResponse(user);
  }

  async login(loginDto: LoginDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: { id: true, email: true, fullName: true, password: true },
    });
    if (!existUser) {
      throw new NotFoundException('User Already Exists');
    }
    const isPassEqual = await bcrypt.compare(
      loginDto.password,
      existUser.password,
    );
    if (!isPassEqual) {
      throw new BadRequestException('invalid credentials');
    }
    return this.buildResponse(existUser);
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async buildResponse(user: User) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  }
}
