import { ApiProperty } from "@nestjs/swagger"

export class UserDto
{
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'John' })
  name: string

  @ApiProperty({ example: 'Doe' })
  last_name: string

  @ApiProperty({ example: 'john_doe@example.com' })
  email: string

  @ApiProperty({ type: Date })
  created_at: Date

  @ApiProperty({ type: Date })
  updated_at: Date
}
