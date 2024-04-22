/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import {
  PaginatorTypes,
} from '../../index';

const getOrderByWithTieBreaker = (args: any = {}, defaultOptions: PaginatorTypes.PaginateOptions = {}) => {
  const { orderByTieBreakerPropertyName } = defaultOptions;

  if (!orderByTieBreakerPropertyName || !args.orderBy) {
    return args.orderBy;
  }

  return [
    ...((args.orderBy instanceof Array) ? args.orderBy : [args.orderBy]),
    { [orderByTieBreakerPropertyName]: 'asc' },
  ];
};

// eslint-disable-next-line import/prefer-default-export
export const paginator = (defaultOptions: PaginatorTypes.PaginateOptions): PaginatorTypes.PaginateFunction => {
  // eslint-disable-next-line default-param-last
  return async (model, args: any = { where: undefined }, options) => {
    const page = Number(options?.page || defaultOptions?.page) || 0;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;
    const orderBy = getOrderByWithTieBreaker(args, defaultOptions);

    const skip = page > 0 ? perPage * (page) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        orderBy,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage - 1);

    return {
      data,
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
};
