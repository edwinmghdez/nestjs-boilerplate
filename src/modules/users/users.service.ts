import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException, Query, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { mapToUserDto } from './dto/mapping-user.dto';
import { PaginateUserDto } from './dto/paginate-user.dto';
import { buildFindManyOptions } from 'src/utils/query-options-builder';
import { makePagination } from 'src/utils/pagination';
import { FullUserDto } from './dto/full-user.dto';
import { hashPassword } from 'src/utils/password-hashing';
import { createHmac } from 'crypto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { TwoFactorAuthDto } from './dto/two-factor-auth.dto';
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class UsersService
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(payload: CreateUserDto): Promise<UserDto>
  {
    const { password } = payload;
    const hashedPassword = await hashPassword(password);
    const data = this.userRepository.create({
      ...payload,
      password: hashedPassword
    });
    const user = await this.userRepository.save(data);
    return mapToUserDto(user);
  }

  async findAll(@Query() queryParams: any): Promise<PaginateUserDto>
  {
    const [users, totalItems] = await this.userRepository.findAndCount(
      buildFindManyOptions({ queryParams })
    );

    const data = users.map((user) => mapToUserDto(user));
    const pagination = makePagination(totalItems, queryParams);
    return { data, ...pagination }
  }

  async findOne(id: number): Promise<UserDto | null>
  {
    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({status: HttpStatus.BAD_REQUEST, message: 'User not found'});
    });

    return mapToUserDto(user);
  }

  async update(id: number, payload: UpdateUserDto): Promise<UserDto>
  {
    let hashedPassword = null;

    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({status: HttpStatus.BAD_REQUEST, message: 'User not found'});
    });

    if (payload.password) {
      hashedPassword = await hashPassword(payload.password);
    }

    const data: Partial<User> = {
      ...user,
      ...payload,
      ...(hashedPassword ? { password: hashedPassword } : {})
    }

    const updatedUser = await this.userRepository.save(data);
    return mapToUserDto(updatedUser);
  }

  async remove(id: number)
  {
    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({status: HttpStatus.BAD_REQUEST, message: 'User not found'});
    });

    return await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<FullUserDto | null>
  {
    const user = await this.userRepository.findOneOrFail({ where: { email } }).catch((e) => {
      throw new NotFoundException({status: HttpStatus.BAD_REQUEST, message: 'User not found'});
    });

    return {
      ...mapToUserDto(user),
      password: user.password,
      is_two_factor_enabled: user.is_two_factor_enabled,
      two_factor_secret: user.two_factor_secret
    };
  }

  async verify(id: number, hash: string)
  {
    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({status: HttpStatus.BAD_REQUEST, message: 'User not found'});
    });

    if (user.email_verified_at) {
      throw new ConflictException('Email already verified');
    }

    const expectedHash = createHmac('sha1', user.email).digest('hex');

    if (expectedHash !== hash) {
      throw new BadRequestException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid verification link' });
    }

    const data = {
      ...user,
      email_verified_at: new Date()
    }

    const updatedUser = await this.userRepository.save(data);
    return mapToUserDto(updatedUser);
  }

  async generate2FA(id: number)
  {
    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({ status: HttpStatus.BAD_REQUEST, message: 'User not found' });
    });

    const secret = speakeasy.generateSecret({
      length: 20,
      name: process.env.APP_NAME + ` (${ user.email })`,
      issuer: process.env.APP_NAME
    });

    const data: Partial<User> = {
      ...user,
      two_factor_secret: secret.base32
    }

    await this.userRepository.save(data);

    const otpAuthUrl = secret.otpauth_url;
    const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl);

    return { secret: secret.base32, qrCode: qrCodeDataUrl };
  }

  async enable2FA(id: number, payload: TwoFactorAuthDto)
  {
    const { code } = payload;
    console.log(code);
    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({ status: HttpStatus.BAD_REQUEST, message: 'User not found' });
    });

    const isValid = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token: code
    });

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    const data: Partial<User> = {
      ...user,
      is_two_factor_enabled: true
    }

    await this.userRepository.save(data);

    return { message: '2FA enabled successfully' };
  }

  async disable2FA(id: number)
  {
    const user = await this.userRepository.findOneOrFail({ where: { id } }).catch((e) => {
      throw new NotFoundException({ status: HttpStatus.BAD_REQUEST, message: 'User not found' });
    });

    const data: Partial<User> = {
      ...user,
      is_two_factor_enabled: false,
      two_factor_secret: null
    }


    await this.userRepository.save(data);
    return { message: '2FA disabled successfully' };
  }
}
