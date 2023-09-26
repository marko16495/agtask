import {createAction, props} from '@ngrx/store';
import {CreatePost} from '../../models/create-post';
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
    RELOAD: createAction(
        '[Posts] Reload',
    ),
    NEXT_PAGE: createAction(
        '[Posts] Next page'
    ),
    PREVIOUS_PAGE: createAction(
        '[Posts] Previous page'
    ),
    FILTER: createAction(
        '[Posts] Filter',
        props<{ filter: string | null }>()
    ),
    CLEAR: createAction(
        '[Posts] Clear'
    ),
    CREATE_POST_INIT: createAction(
        '[Posts] Create post init',
        props<{ body: CreatePost }>()
    ),
    CREATE_POST_SUCCESS: createAction(
        '[Posts] Create post success',
        props<{ response: Post }>()
    ),
    CREATE_POST_FAILURE: createAction(
        '[Posts] Create post failure',
        props<{ error: any }>()
    ),
}
