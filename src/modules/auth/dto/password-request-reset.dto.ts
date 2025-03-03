import { ApiProperty } from "@nestjs/swagger"
import { IsEmail } from "class-validator"

export class PasswordRequestResetDto
{
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string
}
