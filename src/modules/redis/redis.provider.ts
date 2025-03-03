import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    return new Redis({
      host: 'redis',
      port: 6379,
    });
  }
}
