import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {map, Observable, shareReplay, tap} from 'rxjs';
import {PaginatedResponse} from '../models/paginated-response';
import {Post} from '../models/post';

const getPostsQuery = gql`
  query GetPosts {
    posts {
      data {
        id
        title
        body
      }
    }
  }
`;

const createPostMutation = gql`
  mutation (
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _nextPostId = 101;
  private _createdPosts: Post[] = [];
  private _deletedPostsIds: string[] = [];

  private _apiPosts$: Observable<Post[]>;

  private _allPosts$: Observable<Post[]>;

  constructor(private _apollo: Apollo) {
    this._apiPosts$ = this._apollo.query<{ posts: { data: Post[] } }>({query: getPostsQuery})
        .pipe(
            map(response => response.data.posts.data),
            shareReplay(1)
        );
    this._allPosts$ = this._apiPosts$
        .pipe(map(posts => {
          return posts
              .filter(post => !this._deletedPostsIds.includes(post.id))
              .concat(this._createdPosts)
        }));
  }

  getAll(pageIndex: number, pageSize: number, filter?: string): Observable<PaginatedResponse<Post>> {
    return this._allPosts$.pipe(map(posts => {
      let filteredPosts = filter
          ? posts.filter(post => post.title.toLowerCase().includes(filter.toLowerCase()))
          : posts;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      const data = filteredPosts.slice(startIndex, endIndex);
      return {
        data: data,
        totalCount: filteredPosts.length
      };
    }))
  }

  create(title: string, body: string): Observable<Post> {
    return this._apollo.mutate({
      mutation: createPostMutation,
      variables: {
        input: {
          title: title,
          body: body
        }
      }
    }).pipe(
        map(() => {
          const post: Post = {
            id: this._nextPostId.toString(),
            title: title,
            body: body
          };
          return post;
        }),
        tap(post => {
          this._createdPosts.push(post);
          this._nextPostId++;
        })
    )
  }

}
