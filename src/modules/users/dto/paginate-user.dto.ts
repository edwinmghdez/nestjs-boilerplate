import { PaginationDto } from "src/dtos/pagination.dto";
import { UserDto } from "./user.dto";

export class PaginateUserDto extends PaginationDto
{
  data: UserDto[]
}