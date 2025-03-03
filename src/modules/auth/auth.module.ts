import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/constants';
import { JwtStrategy } from 'src/config/strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { RedisModule } from '../redis/redis.module';
import { AuthGuardJWT } from 'src/config/guards/auth.guard';
import { RepositoryModule } from '../common/repository/repository.module';

@Module({
  imports:
  [
    RepositoryModule,
    UsersModule,
    MailModule,
    PassportModule,
    RedisModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService, AuthGuardJWT],
  exports: [AuthService, AuthGuardJWT]
})
export class AuthModule {}
