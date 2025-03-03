import { Injectable, ExecutionContext, Inject, UnauthorizedException, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import Redis from 'ioredis'

@Injectable()
export class AuthGuardJWT extends AuthGuard('jwt')
{
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const isBlacklisted = await this.redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  private extractToken(@Req() request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
