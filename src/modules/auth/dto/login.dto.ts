import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginDto
{
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty({ message: 'The email should not be empty' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({ message: 'The password should not be empty' })
  password: string

  @ApiPropertyOptional({ example: '243891' })
  @IsString({ message: 'The code must be a text' })
  @IsOptional()
  code?: string
}
