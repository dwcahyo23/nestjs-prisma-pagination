import { paginator } from '../../src';

describe('Paginator', () => {
  const paginate = paginator({ perPage: 10 });
  const prisma = {
    count: jest.fn(() => 2),
    findMany: jest.fn((args: Record<string, string>) => [
      {
        id: 1,
        name: 'string',
      },
      {
        id: 2,
        name: 'string',
      },
    ]),
  };

  it('Should return paginated response', async () => {
    const args = {
      where: {
        description: 'string',
      },
    };
    const options = {
      page: 0,
    };
    const expectedValue = {
      data: [
        {
          id: 1,
          name: 'string',
        },
        {
          id: 2,
          name: 'string',
        },
      ],
      meta: {
        total: 2,
        lastPage: Math.ceil(2 / 10 - 1),
        currentPage: options.page,
        perPage: 10,
        prev: options.page > 0 ? options.page - 1 : null,
        next: options.page < Math.ceil(options.page / 10) ? options.page + 1 : null,
      },
    };
    const paginatedResponse = await paginate(prisma, args, options);

    expect(paginatedResponse).toEqual(expectedValue);
  });

  it('Should return paginated response (perPage: 1, page: 2)', async () => {
    jest.spyOn(prisma, 'findMany').mockReturnValueOnce([{
      id: 2,
      name: 'string',
    }]);
    const args = {
      where: {
        description: 'string',
      },
    };
    const options = {
      page: 2,
      perPage: 1,
    };
    const expectedValue = {
      data: [
        {
          id: 2,
          name: 'string',
        },
      ],
      meta: {
        total: 2,
        lastPage: Math.ceil(2 / options.perPage - 1),
        currentPage: options.page,
        perPage: options.perPage,
        prev: options.page > 0 ? options.page - 1 : null,
        next: options.page < Math.ceil(options.page / options.perPage) ? options.page + 1 : null,
      },
    };
    const paginatedResponse = await paginate(prisma, args, options);

    expect(paginatedResponse).toEqual(expectedValue);
  });

  it('Should return empty data', async () => {
    jest.spyOn(prisma, 'count').mockReturnValueOnce(0);
    jest.spyOn(prisma, 'findMany').mockReturnValueOnce([]);
    const expectedValue = {
      data: [],
      meta: {
        total: 0,
        lastPage: Math.ceil(0 / 10 - 1),
        currentPage: 0,
        perPage: 10,
        prev: 1 > 1 ? 1 - 1 : null,
        next: Math.ceil(1 / 10 - 1) > 1 ? 1 + 1 : null,
      },
    };
    const paginatedResponse = await paginate(prisma, {}, {});

    expect(paginatedResponse).toEqual(expectedValue);
  });
});
