"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPaginator = void 0;
const searchPaginator = (defaultOptions) => async (prisma, modelName, options) => {
    let data;
    if (options?.searchValue) {
        data = await prisma.$queryRawUnsafe(`
        SELECT *,
        (SELECT COUNT(*) FROM "${modelName}"
          WHERE to_tsvector('english',
          ${options.searchColumns.map((c) => `coalesce("${c}", '')`).join(" || ' ' || \n")}
          ) @@ to_tsquery('english', '${options.searchValue}')) AS row_count
        FROM "${modelName}"
        WHERE to_tsvector('english',
          ${options.searchColumns.map((c) => `coalesce("${c}", '')`).join(" || ' ' || \n")}
          ) @@ to_tsquery('english', '${options.searchValue}')
          limit ${options.perPage}
          offset ${options.skip};
      `);
    }
    else {
        data = await prisma.$queryRawUnsafe(`
         SELECT *,
        (SELECT COUNT(*) FROM "${modelName}") as row_count
        FROM "${modelName}"
        limit ${options.perPage}
        offset ${options.skip};
        `);
    }
    const total = Number(data[0]?.row_count || 0);
    const lastPage = Math.ceil((total) / (options?.perPage || defaultOptions.perPage) - 1);
    return {
        data: data,
        meta: {
            total,
            lastPage,
            currentPage: options?.page || 0,
            perPage: options?.perPage || 10,
            prev: options?.page > 0 ? (options?.page || defaultOptions.page) - 1 : null,
            next: options?.page < lastPage ? (options?.page || defaultOptions.page) + 1 : null,
        },
    };
};
exports.searchPaginator = searchPaginator;
//# sourceMappingURL=search-paginator.js.map