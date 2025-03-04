import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './db/data-source';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './config/strategies/jwt.strategy';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './modules/mail/mail.module';
import { MailService } from './modules/mail/mail.service';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/common/repository/repository.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports:
  [
    TypeOrmModule.forRoot(databaseOptions),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    MailModule,
    RedisModule,
    RepositoryModule,
    HealthModule
  ],
  controllers: [],
  providers:
  [
    JwtStrategy,
    AuthService,
    MailService,
    JwtService,
  ]
})
export class AppModule {}
