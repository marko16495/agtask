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
        private readonly actions$: Actions,
        private readonly store: Store<AppState>,
        private readonly postService: PostService
    ) { }

    loadPosts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostsActions.LOAD_INIT),
            switchMap((action) => this.postService.getAll(action.request).pipe(
                takeUntil(this.actions$.pipe(ofType(PostsActions.CLEAR)))
            )),
            map(response => PostsActions.LOAD_SUCCESS({response: response})),
            catchError(error => of(PostsActions.LOAD_FAILURE({error: error})))
        )
    )

    nextPage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostsActions.NEXT_PAGE),
            withLatestFrom(
                this.store.select(PostSelectors.request)
            ),
            filter(([, request]) => !!request),
            map(([x, request]) => {
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
        this.actions$.pipe(
            ofType(PostsActions.PREVIOUS_PAGE),
            withLatestFrom(
                this.store.select(PostSelectors.request)
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
        this.actions$.pipe(
            ofType(PostsActions.FILTER),
            withLatestFrom(
                this.store.select(PostSelectors.request)
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
        this.actions$.pipe(
            ofType(PostsActions.CREATE_POST_INIT),
            switchMap((action) => this.postService.create(action.body)),
            map(response => PostsActions.CREATE_POST_SUCCESS({response: response})),
            catchError(error => of(PostsActions.CREATE_POST_FAILURE({error: error})))
        )
    )

    createPostSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostsActions.CREATE_POST_SUCCESS),
            map(() => PostsActions.RELOAD()),
        )
    )

    reload$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostsActions.RELOAD),
            withLatestFrom(
                this.store.select(PostSelectors.request)
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
        this.actions$.pipe(
            ofType(PostsActions.UPDATE_POST_INIT),
            switchMap((action) => this.postService.update(action.body)),
            map(response => PostsActions.UPDATE_POST_SUCCESS({response: response})),
            catchError(error => of(PostsActions.UPDATE_POST_FAILURE({error: error})))
        )
    )

    updatePostSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostsActions.UPDATE_POST_SUCCESS),
            map(() => PostsActions.RELOAD()),
        )
    )

}
