import { filtersFields } from "../config/constants";
import { PaginationDto } from "../dtos/pagination.dto";

export const makePagination = (
  totalItems: number,
  queryParams: any
): PaginationDto => {
  const { defaultLimit, defaultPage } = filtersFields;

  return {
    totalItems,
    currentPage: queryParams.page ?? defaultPage,
    totalPages: Math.ceil(totalItems / (queryParams.limit ?? defaultLimit)),
    itemsPerPage: queryParams.limit ?? defaultLimit
  }
}
