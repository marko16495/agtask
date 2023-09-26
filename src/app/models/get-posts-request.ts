export interface GetPostsRequest {
    /** Zero-based page index */
    pageIndex: number;
    pageSize: number;
    filter?: string;
}
