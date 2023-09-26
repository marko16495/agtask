import {Injectable} from '@angular/core';
import {map, Observable, shareReplay, tap, forkJoin, timer} from 'rxjs';
import {CreatePost} from '../models/create-post';
import {GetPostsRequest} from '../models/get-posts-request';
import {PaginatedResponse} from '../models/paginated-response';
import {Post} from '../models/post';
import {PostGqlService} from './post-gql.service';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    // GraphQLZero always returns the same id when creating post,
    // that's why we have to set it in this service
    private _nextPostId = 101;
    private _createdPosts: Post[] = [];
    private _deletedPostsIds: string[] = [];
    private _updatedPostsMap: Map<string, Post> = new Map();

    private _apiPosts$: Observable<Post[]>;

    private _allPosts$: Observable<Post[]>;

    constructor(private _postGqlService: PostGqlService) {
        // We load posts from GraphQLZero only once
        this._apiPosts$ = this._postGqlService.getAll()
            .pipe(
                map(response => response.data.posts.data),
                shareReplay(1)
            );
        this._allPosts$ = forkJoin([
            this._apiPosts$,
            // Make sure there is some delay when changing page or filtering
            // (because we aren't calling GraphQLZero)
            timer(300)
        ])
            .pipe(map(([posts]) => {
                return posts
                    .filter(post => !this._deletedPostsIds.includes(post.id))
                    .concat(this._createdPosts)
                    .map(post => {
                        if (this._updatedPostsMap.has(post.id)) {
                            return this._updatedPostsMap.get(post.id) as Post
                        }
                        return post;
                    })
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
        return this._postGqlService.create(createPost)
            .pipe(
                map(() => ({
                    id: this._nextPostId.toString(),
                    title: createPost.title,
                    body: createPost.body
                })),
                tap(post => {
                    this._createdPosts.push(post);
                    this._nextPostId++;
                })
            )
    }

    update(post: Post): Observable<Post> {
        return this._postGqlService.update(post)
            .pipe(
                map(() => post),
                tap(post => {
                    this._updatedPostsMap.set(post.id, {...post});
                })
            )
    }

    delete(post: Post): Observable<Post> {
        return this._postGqlService.delete(post)
            .pipe(
                map(() => post),
                tap(post => {
                    this._deletedPostsIds.push(post.id);
                })
            )
    }

}
