import {createAction, props} from '@ngrx/store';
import {GetPostsRequest} from '../../models/get-posts-request';
import {PaginatedResponse} from '../../models/paginated-response';
import {Post} from '../../models/post';

export const PostsActions = {
  LOAD_INIT: createAction(
    '[Posts] Load init',
    props<{ request: GetPostsRequest }>()
  ),
  LOAD_SUCCESS: createAction(
    '[Posts] Load success',
    props<{ response: PaginatedResponse<Post> }>()
  ),
  LOAD_FAILURE: createAction(
    '[Posts] Load failure',
    props<{ error: any }>()
  ),
  NEXT_PAGE: createAction(
    '[Posts] Next page'
  ),
  PREVIOUS_PAGE: createAction(
    '[Posts] Previous page'
  ),
  CLEAR: createAction(
    '[Posts] Clear'
  )
}
