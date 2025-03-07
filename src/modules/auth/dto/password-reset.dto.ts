import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class PasswordResetDto
{
  @ApiProperty()
  @IsNotEmpty({ message: 'The passowrd should not be empty' })
  password: string

  @ApiProperty()
  token: string
}
