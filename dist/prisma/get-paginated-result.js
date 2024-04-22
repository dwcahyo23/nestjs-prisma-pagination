"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedResult = exports.getPagination = void 0;
const getPagination = (rawPage, rawPerPage) => {
    const page = Number(rawPage || 0);
    const perPage = Number(rawPerPage || 10);
    const skip = page > 0 ? perPage * (page) : 0;
    return {
        perPage,
        page,
        skip,
    };
};
exports.getPagination = getPagination;
const getPaginatedResult = ({ data, pagination, count = data.length, }) => {
    const { page = 0, perPage = 10 } = pagination;
    const slicedData = data.slice(pagination.page === 0 ? 0 : (pagination.page) * pagination.perPage, pagination.page * pagination.perPage);
    const total = Number(count || 0);
    const lastPage = Math.ceil(total / perPage);
    return {
        data: slicedData,
        meta: {
            total: total - 1,
            lastPage: lastPage - 1,
            currentPage: page,
            perPage,
            prev: page > 0 ? page - 1 : null,
            next: page < lastPage ? page + 1 : null,
        },
    };
};
exports.getPaginatedResult = getPaginatedResult;
//# sourceMappingURL=get-paginated-result.js.map