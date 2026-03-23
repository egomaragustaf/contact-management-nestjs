import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../dto/auth.dto';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/decorator/auth.decorator';
import type { User } from '../../../generated/prisma/client';

@Controller('/api/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.login(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.get(user);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/current')
  @HttpCode(200)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.authService.logout(user);
    return {
      data: true,
    };
  }
}
