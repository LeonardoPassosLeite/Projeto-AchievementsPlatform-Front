export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface PagedResultWithMeta<T, TMeta> extends PagedResult<T> {
    meta?: TMeta;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}
