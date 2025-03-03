import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginDto
{
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional({ example: '243891' })
  @IsString()
  @IsOptional()
  code?: string
}
