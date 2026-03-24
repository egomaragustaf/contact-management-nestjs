import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { Request } from 'express';
import type { User } from '../../generated/prisma/client';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const user = await this.prismaService.user.findFirst({
      where: { token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = user;
    return true;
  }
}
