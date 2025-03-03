import { ApiProperty } from "@nestjs/swagger";

export class TwoFactorAuthDto
{
  @ApiProperty({ example: '243891' })
  code: string
}
