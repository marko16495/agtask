import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {map, Observable, shareReplay, tap, forkJoin, timer} from 'rxjs';
import {CreatePost} from '../models/create-post';
import {GetPostsRequest} from '../models/get-posts-request';
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
        this._allPosts$ = forkJoin([
            this._apiPosts$,
            timer(300)
        ])
            .pipe(map(([posts]) => {
                return posts
                    .filter(post => !this._deletedPostsIds.includes(post.id))
                    .concat(this._createdPosts)
            }));
    }

    getAll(request: GetPostsRequest): Observable<PaginatedResponse<Post>> {
        return this._allPosts$.pipe(map(posts => {
            let filteredPosts = request.filter
                ? posts.filter(post => post.title.toLowerCase().includes(request.filter!.toLowerCase()))
                : posts;
            const startIndex = request.pageIndex * request.pageSize;
            const endIndex = startIndex + request.pageSize;
            const data = filteredPosts.slice(startIndex, endIndex);
            return {
                data: data,
                totalCount: filteredPosts.length
            };
        }))
    }

    create(createPost: CreatePost): Observable<Post> {
        return this._apollo.mutate({
            mutation: createPostMutation,
            variables: {
                input: {
                    title: createPost.title,
                    body: createPost.body
                }
            }
        }).pipe(
            map(() => {
                const post: Post = {
                    id: this._nextPostId.toString(),
                    title: createPost.title,
                    body: createPost.body
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
