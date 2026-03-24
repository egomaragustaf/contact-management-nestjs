import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import type {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../dto/auth.dto';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import type { User } from '../../../generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return {
      data: result,
    };
  }

  @Post('login')
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.login(request);
    return {
      data: result,
    };
  }

  @Get('current')
  @UseGuards(AuthGuard)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.get(user);
    return {
      data: result,
    };
  }

  @Patch('current')
  @UseGuards(AuthGuard)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('current')
  @UseGuards(AuthGuard)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.authService.logout(user);
    return {
      data: true,
    };
  }
}
