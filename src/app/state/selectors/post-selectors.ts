import {AppState} from '../models/app-state';

export const PostSelectors = {
    posts: (state: AppState) => state.posts.posts,
    totalCount: (state: AppState) => state.posts.totalCount,
    loading: (state: AppState) => state.posts.loading,
    request: (state: AppState) => state.posts.request,
    currentPage: (state: AppState): number | undefined => state.posts.request?.pageIndex,
    totalPages: (state: AppState): number | undefined => {
        if (!state.posts.request) {
            return undefined;
        }
        return Math.ceil(state.posts.totalCount / state.posts.request.pageSize);
    },
    isFirstPage: (state: AppState): boolean => {
        if (!state.posts.request) {
            return false;
        }
        return state.posts.request.pageIndex === 0;
    },
    isLastPage: (state: AppState): boolean => {
        if (!state.posts.request) {
            return false;
        }
        const nextPageStartIndex = (state.posts.request.pageIndex + 1) * state.posts.request.pageSize;
        return nextPageStartIndex >= state.posts.totalCount
    }
}
