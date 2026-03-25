import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/create-auth.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() request: RegisterDto) {
    return await this.authService.register(request);
  }

  // @Post('login')
  // async login(
  //   @Body() request: LoginUserRequest,
  // ): Promise<WebResponse<UserResponse>> {
  //   const result = await this.authService.login(request);
  //   return {
  //     data: result,
  //   };
  // }

  // @Get('current')
  // @UseGuards(AuthGuard)
  // async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
  //   const result = await this.authService.get(user);
  //   return {
  //     data: result,
  //   };
  // }

  // @Patch('current')
  // @UseGuards(AuthGuard)
  // async update(
  //   @Auth() user: User,
  //   @Body() request: UpdateUserRequest,
  // ): Promise<WebResponse<UserResponse>> {
  //   const result = await this.authService.update(user, request);
  //   return {
  //     data: result,
  //   };
  // }

  // @Delete('logout')
  // @UseGuards(AuthGuard)
  // async logout(): Promise<WebResponse<boolean>> {
  //   await this.authService.logout();
  //   return {
  //     data: true,
  //   };
  // }
}
