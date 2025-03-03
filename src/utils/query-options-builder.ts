import { FindManyOptions, Like, Between, In, FindOptionsWhere } from 'typeorm'

type FindManyOptionsParams = {
  queryParams: any
  relations?: string[]
  where?: FindOptionsWhere<any>[]
  withDeleted?: boolean
  disabledPagination?: boolean
}

export const buildFindManyOptions = (
  params: FindManyOptionsParams,
): FindManyOptions => {
  const { where = [] } = params

  const findOptions: FindManyOptions = {
    skip:
      params.queryParams.page && !params?.disabledPagination
        ? (params.queryParams.page - 1) * (params.queryParams.limit || 10)
        : 0,
    ...(params?.disabledPagination
      ? {}
      : { take: params.queryParams.limit || 10 }),
    where: [],
    withDeleted: !!params?.withDeleted,
    relations: [...(params?.relations?.length ? [...params.relations] : [])],
  }

  if (params.queryParams) {
    Object.keys(params.queryParams).forEach((key) => {
      if (Array.isArray(params.queryParams[key])) {
        const field = key
        const values = params.queryParams[key]
        findOptions.where.push({ [field]: In(values) })
      }
    })
  }

  if (params.queryParams.param) {
    const searchTerms = params.queryParams.param.split(',')

    if (searchTerms.length >= 2) {
      const searchTerm = searchTerms[0]
      const fieldsToSearch = searchTerms.slice(1)

      fieldsToSearch.forEach((field: string) => {
        findOptions.where.push({
          [field]: Like(`%${searchTerm}%`),
        })
      })
    }
  }

  if (params.queryParams.between_dates) {
    const dateRange = params.queryParams.between_dates.split(',')
    if (dateRange.length === 3) {
      const fieldToSearch = dateRange.pop()
      if (findOptions.where.length) {
        findOptions.where = findOptions.where.map((filter) => ({
          ...filter,
          [fieldToSearch]: Between(
            new Date(dateRange[0]),
            new Date(dateRange[1]),
          ),
        }))
      } else {
        findOptions.where.push({
          [fieldToSearch]: Between(
            new Date(dateRange[0]),
            new Date(dateRange[1]),
          ),
        })
      }
    }
  }

  if (params.queryParams.order_by) {
    const [orderBy, orderDirection] = params.queryParams.order_by.split(',')
    findOptions.order = {
      [orderBy]: orderDirection === 'desc' ? 'DESC' : 'ASC',
    }
  }

  if (where.length) {
    if (!findOptions.where.length) {
      findOptions.where.push(...where)
    } else {
      where.forEach((query) => {
        findOptions.where = findOptions.where.map((filter) => ({
          ...filter,
          ...query,
        }))
      })
    }
  }

  return findOptions
}
