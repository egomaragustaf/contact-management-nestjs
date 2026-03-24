import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: unknown;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new HttpException('Unauthorized', 401);
    }

    const token = authorization.replace('Bearer ', '');

    const user = await this.prismaService.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    request.user = user;
    return true;
  }
}
