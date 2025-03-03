import { User } from "../entities/user.entity";
import { UserDto } from "./user.dto";

export function mapToUserDto(user: User): UserDto
{
  const UserDto: UserDto = {
    id: user.id,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at
  }

  return UserDto;
}
