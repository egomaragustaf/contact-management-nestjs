import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import { RegisterDto } from '../dto/create-auth.dto';

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

  // async login(request: LoginUserRequest): Promise<UserResponse> {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       username: loginRequest.username,
  //     },
  //   });

  //   if (!user) {
  //     throw new HttpException('Username or password is invalid', 401);
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     loginRequest.password,
  //     user.password,
  //   );

  //   if (!isPasswordValid) {
  //     throw new HttpException('Username or password is invalid', 401);
  //   }

  //   const payload = { sub: user.username, username: user.username };
  //   const token = await this.jwtService.signAsync(payload);

  //   return {
  //     username: user.username,
  //     name: user.name,
  //     token,
  //   };
  // }

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
