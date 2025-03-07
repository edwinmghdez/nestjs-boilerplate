import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { comparePasswords } from 'src/utils/password-hashing';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { jwtConstants } from 'src/config/constants';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetTokens } from './entities/password-reset-tokens.entity';
import { Repository } from 'typeorm';
import { generateUniqueToken } from 'src/utils/token-generator';
import { FullUserDto } from '../users/dto/full-user.dto';
import { PasswordRequestResetDto } from './dto/password-request-reset.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import * as speakeasy from 'speakeasy';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService
{
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    @InjectRepository(PasswordResetTokens)
    private readonly passwordResetTokensRepository: Repository<PasswordResetTokens>,
    private i18n: I18nService
  ) {}
  
  async login(payload: LoginDto): Promise<AuthUserDto | { needs2FA: boolean }>
  {
    const { email, password, code } = payload;

    const user = await this.usersService.findByEmail(email);
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException(this.i18n.t('common.auth.INVALID_CREDENTIALS'));
    }

    if (user.is_two_factor_enabled) {
      if (!code) return { needs2FA: true };

      const isValid = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: code
      });
  
      if (!isValid) throw new UnauthorizedException(this.i18n.t('common.auth.INVALID_2FA_CODE'));
    }

    const token = await this.jwtService.signAsync({
      payload: {
        id: user.id
      }
    });

    return {
      access_token: token,
      token_type: jwtConstants.token_type,
      expires_in: jwtConstants.ttl
    }
  }

  async user(authUser: UserDto): Promise<UserDto>
  {
    const user = await this.usersService.findOne(authUser.id);

    if (!user) {
      throw new NotFoundException(this.i18n.t('common.users.USER_NOT_FOUND'));
    }

    return user; /* Revisar porque no puedo usar el mapToUserDto */
  }

  async refresh(authUser, token: any)
  {
    if (!authUser) {
      throw new UnauthorizedException(this.i18n.t('common.auth.UNAUTHORIZED'));
    }

    const user = await this.usersService.findOne(authUser.id);

    if (!user) {
      throw new NotFoundException(this.i18n.t('common.users.USER_NOT_FOUND'));
    }

    const newToken = await this.jwtService.signAsync({
      payload: {
        id: user.id
      }
    });

    await this.addToBlacklist(token);

    const response: AuthUserDto = {
      access_token: newToken,
      token_type: jwtConstants.token_type,
      expires_in: jwtConstants.ttl
    }

    return response;
  }

  async logout(token: any)
  {
    await this.addToBlacklist(token);
  }

  async register(payload: CreateUserDto): Promise<AuthUserDto>
  {
    const user = await this.usersService.create(payload);

    const token = await this.jwtService.signAsync({
      payload: {
        id: user.id
      }
    });

    await this.mailService.sendUserConfirmation(user);

    const response: AuthUserDto = {
      access_token: token,
      token_type: jwtConstants.token_type,
      expires_in: jwtConstants.ttl
    }

    return response;
  }

  async validateUserById(id: number): Promise<UserDto>
  {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(this.i18n.t('common.users.USER_NOT_FOUND'));
    }

    return user;
  }

  async addToBlacklist(token: string): Promise<void>
  {
    const decoded = this.jwtService.decode(token) as { exp: number };
    if (!decoded || !decoded.exp) {
      throw new UnauthorizedException(this.i18n.t('common.auth.INVALID_TOKEN'));
    }
  
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.redisClient.setex(`blacklist:${token}`, ttl, '1');
    } else {
      throw new UnauthorizedException(this.i18n.t('common.auth.TOKEN_EXPIRED'));
    }
  }

    async verify(id: number, hash: string)
    {
      return this.usersService.verify(id, hash);
    }

  async passwordRequestReset(passwordRequestResetDto: PasswordRequestResetDto)
  {
    const { email } = passwordRequestResetDto;
    const user = await this.usersService.findByEmail(email);

    const token = generateUniqueToken();
    await this.storePasswordResetToken(user, token);

    await this.mailService.sendPasswordRequestChange(user, token);

    return { message: this.i18n.t('common.strings.SUCCESSFULLY') };
  }

  async passwordReset(passwordResetDto: PasswordResetDto)
  {
    const { token, password } = passwordResetDto;
    const resetToken = await this.passwordResetTokensRepository.findOneBy({ token: token });

    if (!resetToken) {
      throw new BadRequestException(this.i18n.t('common.auth.INVALID_TOKEN'));
    }

    if (resetToken.expiration_date < new Date() || resetToken.deleted_at != null) {
      throw new BadRequestException(this.i18n.t('common.auth.TOKEN_EXPIRED'));
    }

    const user = await this.usersService.findByEmail(resetToken.email);
    await this.usersService.update(user.id, { password });

    await this.passwordResetTokensRepository.update( resetToken.id, { deleted_at: new Date() });

    await this.mailService.sendPasswordRestoredSuccessfully(user);

    return { message: this.i18n.t('common.strings.SUCCESSFULLY') };
  }

  async storePasswordResetToken(user: FullUserDto, token: string)
  {
    const passwordResetToken = new PasswordResetTokens();
    passwordResetToken.email = user.email;
    passwordResetToken.token = token;
    await this.passwordResetTokensRepository.save(passwordResetToken);
  }
}
