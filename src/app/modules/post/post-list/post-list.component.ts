import {Dialog, DialogModule} from '@angular/cdk/dialog';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ofType, Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {Post} from '../../../models/post';
import {PostsActions} from '../../../state/actions/posts-actions';
import {AppState} from '../../../state/models/app-state';
import {PostSelectors} from '../../../state/selectors/post-selectors';
import {PostCreateDialogComponent} from '../post-create-dialog/post-create-dialog.component';
import {PostUpdateDialogComponent} from '../post-update-dialog/post-update-dialog.component';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    imports: [
        AsyncPipe,
        NgForOf,
        ReactiveFormsModule,
        DialogModule,
        NgIf
    ],
    standalone: true
})
export class PostListComponent implements OnInit, OnDestroy {

    filterControl = new FormControl<string>('');

    posts$ = this.store.select(PostSelectors.posts);
    loading$ = this.store.select(PostSelectors.loading);

    currentPage$ = this.store.select(PostSelectors.currentPage);
    totalPages$ = this.store.select(PostSelectors.totalPages)
    isFirstPage$ = this.store.select(PostSelectors.isFirstPage);
    isLastPagePage$ = this.store.select(PostSelectors.isLastPage);

    private destroy$ = new Subject<void>();

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private dialog: Dialog,
    ) { }

    ngOnInit() {
        this.store.dispatch(PostsActions.LOAD_INIT({
            request: {
                pageIndex: 0,
                pageSize: 10
            }
        }));
        this.filterControl.valueChanges
            .pipe(debounceTime(200))
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                this.store.dispatch(PostsActions.FILTER({filter: value}))
            })
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    prevPage() {
        this.store.dispatch(PostsActions.PREVIOUS_PAGE());
    }

    nextPage() {
        this.store.dispatch(PostsActions.NEXT_PAGE());
    }

    openCreateDialog() {
        const dialogRef = this._createPostCreateDialog();
        dialogRef.componentInstance!.submit$
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(createPost => this.store
                .dispatch(PostsActions.CREATE_POST_INIT({body: createPost}))
            )
        this.actions$.pipe(ofType(PostsActions.CREATE_POST_INIT))
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(() => {
                dialogRef.disableClose = true;
                dialogRef.componentInstance!.showLoader = true;
            })
        this.actions$.pipe(ofType(PostsActions.CREATE_POST_SUCCESS))
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(() => dialogRef.close())
        this.actions$.pipe(ofType(PostsActions.CREATE_POST_FAILURE))
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(() => dialogRef.disableClose = false)
    }

    openUpdateDialog(post: Post) {
        const dialogRef = this._createPostUpdateDialog(post);
        dialogRef.componentInstance!.submit$
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(post => this.store
                .dispatch(PostsActions.UPDATE_POST_INIT({body: post}))
            )
        this.actions$.pipe(ofType(PostsActions.UPDATE_POST_INIT))
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(() => {
                dialogRef.disableClose = true;
                dialogRef.componentInstance!.showLoader = true;
            })
        this.actions$.pipe(ofType(PostsActions.UPDATE_POST_SUCCESS))
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(() => dialogRef.close())
        this.actions$.pipe(ofType(PostsActions.UPDATE_POST_FAILURE))
            .pipe(takeUntil(dialogRef.closed))
            .subscribe(() => dialogRef.disableClose = false)
    }

    private _createPostUpdateDialog(post: Post) {
        return this.dialog.open<string, unknown, PostUpdateDialogComponent>(PostUpdateDialogComponent, {
            width: '500px',
            data: post,
        });
    }

    private _createPostCreateDialog() {
        return this.dialog.open<string, unknown, PostCreateDialogComponent>(PostCreateDialogComponent, {
            width: '500px',
            data: {},
        });
    }

}
