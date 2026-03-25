import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterDto) {
    const { username, password, name } = request;

    const registeredUser = await this.prismaService.user.findUnique({
      where: { username: username },
    });

    if (registeredUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
      },
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: Omit<LoginDto, 'password'>) {
    const payload = { sub: request.id, username: request.username };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;

    return result;
  }

  // async get(user: User): Promise<UserResponse> {
  //   return {
  //     username: user.username,
  //     name: user.name,
  //   };
  // }

  // async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
  //   if (updateRequest.name) {
  //     user.name = updateRequest.name;
  //   }

  //   if (updateRequest.password) {
  //     user.password = await bcrypt.hash(updateRequest.password, 10);
  //   }

  //   const result = await this.prismaService.user.update({
  //     where: {
  //       username: user.username,
  //     },
  //     data: user,
  //   });

  //   return {
  //     name: result.name,
  //     username: result.username,
  //   };
  // }
}
