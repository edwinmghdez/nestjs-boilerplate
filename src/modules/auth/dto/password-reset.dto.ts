import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class PasswordResetDto
{
  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  token: string
}
