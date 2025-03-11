import { PaginationDto } from "./pagination.dto";

export class PaginationResponseDto<T> extends PaginationDto
{
  data: T[];
}