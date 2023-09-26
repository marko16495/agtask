import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {switchMap, map, catchError, of, takeUntil, withLatestFrom, filter} from 'rxjs';
import {GetPostsRequest} from '../../models/get-posts-request';
import {PostService} from '../../services/post.service';
import {PostsActions} from '../actions/posts-actions';
import {AppState} from '../models/app-state';
import {PostSelectors} from '../selectors/post-selectors';

@Injectable({
    providedIn: 'root'
})
export class PostEffects {

    constructor(
        private _actions$: Actions,
        private _store: Store<AppState>,
        private _postService: PostService
    ) { }

    loadPosts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.LOAD_INIT),
            switchMap((action) => this._postService.getAll(action.request).pipe(
                takeUntil(this._actions$.pipe(ofType(PostsActions.CLEAR)))
            )),
            map(response => PostsActions.LOAD_SUCCESS({response: response})),
            catchError(error => of(PostsActions.LOAD_FAILURE({error: error})))
        )
    )

    nextPage$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.NEXT_PAGE),
            withLatestFrom(
                this._store.select(PostSelectors.request)
            ),
            filter(([, request]) => !!request),
            map(([, request]) => {
                return PostsActions.LOAD_INIT({
                    request: {
                        ...request as GetPostsRequest,
                        pageIndex: request!.pageIndex + 1
                    }
                })
            })
        )
    )

    previousPage$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.PREVIOUS_PAGE),
            withLatestFrom(
                this._store.select(PostSelectors.request)
            ),
            filter(([, request]) => !!request),
            map(([, request]) => {
                return PostsActions.LOAD_INIT({
                    request: {
                        ...request as GetPostsRequest,
                        pageIndex: request!.pageIndex - 1
                    }
                })
            })
        )
    )

    filter$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.FILTER),
            withLatestFrom(
                this._store.select(PostSelectors.request)
            ),
            filter(([, request]) => !!request),
            map(([action, request]) => {
                return PostsActions.LOAD_INIT({
                    request: {
                        pageIndex: 0,
                        pageSize: request!.pageSize,
                        filter: action.filter ?? ''
                    }
                })
            })
        )
    )

    createPost$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.CREATE_POST_INIT),
            switchMap((action) => this._postService.create(action.body)),
            map(response => PostsActions.CREATE_POST_SUCCESS({response: response})),
            catchError(error => of(PostsActions.CREATE_POST_FAILURE({error: error})))
        )
    )

    createPostSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.CREATE_POST_SUCCESS),
            map(() => PostsActions.RELOAD()),
        )
    )

    reload$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.RELOAD),
            withLatestFrom(
                this._store.select(PostSelectors.request)
            ),
            filter(([, request]) => !!request),
            map(([, request]) => {
                return PostsActions.LOAD_INIT({
                    request: request as GetPostsRequest
                })
            })
        )
    )

    updatePost$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.UPDATE_POST_INIT),
            switchMap((action) => this._postService.update(action.body)),
            map(response => PostsActions.UPDATE_POST_SUCCESS({response: response})),
            catchError(error => of(PostsActions.UPDATE_POST_FAILURE({error: error})))
        )
    )

    updatePostSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.UPDATE_POST_SUCCESS),
            map(() => PostsActions.RELOAD()),
        )
    )

    deletePost$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.DELETE_POST_INIT),
            switchMap((action) => this._postService.delete(action.body)),
            map(response => PostsActions.DELETE_POST_SUCCESS({response: response})),
            catchError(error => of(PostsActions.DELETE_POST_FAILURE({error: error})))
        )
    )

    deletePostSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(PostsActions.DELETE_POST_SUCCESS),
            map(() => PostsActions.RELOAD()),
        )
    )

}
