import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {PostsActions} from './state/actions/posts-actions';
import {AppState} from './state/models/app-state';
import {PostSelectors} from './state/selectors/post-selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  posts$ = this.store.select(PostSelectors.posts);

  request$ = this.store.select(PostSelectors.request);

  isFirstPage$ = this.store.select(PostSelectors.isFirstPage);
  isLastPagePage$ = this.store.select(PostSelectors.isLastPage);

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(PostsActions.LOAD_INIT({
      request: {
        pageIndex: 0,
        pageSize: 10,
      }
    }))
  }

  prevPage() {
    this.store.dispatch(PostsActions.PREVIOUS_PAGE());
  }

  nextPage() {
    this.store.dispatch(PostsActions.NEXT_PAGE());
  }

}
