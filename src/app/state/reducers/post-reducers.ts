import {createReducer, on} from '@ngrx/store';
import {PostsState} from '../models/posts-state';
import {PostsActions} from '../actions/posts-actions';

const initialState: PostsState = {
  posts: [],
  totalCount: 0,
  loading: false
}

export const postReducer = createReducer(
  initialState,
  on(PostsActions.LOAD_INIT, (state, args) => {
    return {
      ...state,
      request: args.request,
      loading: true
    }
  }),
  on(PostsActions.LOAD_SUCCESS, (state, args) => {
    return {
      ...state,
      posts: args.response.data,
      totalCount: args.response.totalCount,
      loading: false
    }
  }),
  on(PostsActions.LOAD_FAILURE, (state, args) => {
    return {
      ...state,
      loading: false,
      error: args.error
    }
  }),
  on(PostsActions.CLEAR, () => {
    return {
      posts: [],
      totalCount: 0,
      loading: false
    }
  }),
)
