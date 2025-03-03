import { PartialType } from '@nestjs/mapped-types'
import { UserDto } from './user.dto'

export class FullUserDto extends PartialType(UserDto)
{
  password: string

  is_two_factor_enabled
  
  two_factor_secret
}
