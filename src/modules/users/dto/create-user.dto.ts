import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto
{
  @ApiProperty({ example: 'John', required: true })
  @IsNotEmpty({ message: 'The name should not be empty' })
  @IsString({ message: 'The name must be a text' })
  @MinLength(5, { message: 'The name is too short and must contain at least $constraint1 character' })
  name: string

  @ApiProperty({ example: 'Doe', required: true })
  @IsNotEmpty({ message: 'The last name should not be empty' })
  @IsString({ message: 'The last name must be a text' })
  @MinLength(5, { message: 'The last name is too short and must contain at least $constraint1 character' })
  last_name: string

  @ApiProperty({ example: 'john_doe@example.com', required: true })
  @IsNotEmpty({ message: 'The email should not be empty' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password', required: true })
  @IsNotEmpty({ message: 'The password should not be empty' })
  @IsString({ message: 'The password must be a text' })
  password: string
}
