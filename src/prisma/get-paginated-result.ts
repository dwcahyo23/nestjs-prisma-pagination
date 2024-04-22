import { PaginatorTypes } from '../../index';

/**
 * Takes pagination arguments and returns prepared page, perPage, skip
 * @param {number | string | undefined} rawPage
 * @param {number | string | undefined} rawPerPage
 * @return Pagination
 */
export const getPagination = (rawPage?: number | string, rawPerPage?: number | string): PaginatorTypes.Pagination => {
  const page: number = Number(rawPage || 0);
  const perPage: number = Number(rawPerPage || 10);
  const skip: number = page > 0 ? perPage * (page) : 0;

  return {
    perPage,
    page,
    skip,
  };
};

/**
 * Returns data array with pagination
 * @param {Array} data
 * @param {PaginatorTypes.Pagination} pagination
 * @param {string | number | undefined} count
 * @return PaginatorTypes.PaginatedResult<T>
 */
export const getPaginatedResult = <T>({
  data,
  pagination,
  count = data.length,
}:{
  data: T[],
  pagination: PaginatorTypes.Pagination,
  count?: string | number,
}): PaginatorTypes.PaginatedResult<T> => {
  const { page = 0, perPage = 10 } = pagination;

  const slicedData = data.slice(
    pagination.page === 0 ? 0 : (pagination.page) * pagination.perPage,
    pagination.page * pagination.perPage,
  );
  const total: number = Number(count || 0);
  const lastPage: number = Math.ceil(total / perPage - 1);

  return {
    data: slicedData,
    meta: {
      total,
      lastPage,
      currentPage: page,
      perPage,
      prev: page > 0 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  };
};
