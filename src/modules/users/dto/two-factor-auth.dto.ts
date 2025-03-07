import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TwoFactorAuthDto
{
  @ApiProperty({ example: '243891' })
  @IsNotEmpty({ message: 'The code should not be empty' })
  code: string
}
