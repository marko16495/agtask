import {Injectable} from '@angular/core';
import {MutationResult} from 'apollo-angular';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from 'rxjs';
import {CreatePost} from '../models/create-post';
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

const updatePostMutation = gql`
    mutation (
        $id: ID!,
        $input: UpdatePostInput!
    ) {
        updatePost(id: $id, input: $input) {
            id
            title
            body
        }
    }
`;

const deletePostMutation = gql`
    mutation (
        $id: ID!
    ) {
        deletePost(id: $id)
    }
`

@Injectable({
    providedIn: 'root'
})
export class PostGqlService {

    constructor(private _apollo: Apollo) { }

    getAll() {
        return this._apollo.query<{ posts: { data: Post[] } }>({
            query: getPostsQuery
        });
    }

    create(createPost: CreatePost): Observable<MutationResult<unknown>> {
        return this._apollo.mutate({
            mutation: createPostMutation,
            variables: {
                input: {
                    title: createPost.title,
                    body: createPost.body
                }
            }
        });
    }

    update(post: Post): Observable<MutationResult<unknown>> {
        return this._apollo.mutate({
            mutation: updatePostMutation,
            variables: {
                id: post.id,
                input: {
                    title: post.title,
                    body: post.body
                }
            }
        });
    }

    delete(post: Post): Observable<MutationResult<unknown>> {
        return this._apollo.mutate({
            mutation: deletePostMutation,
            variables: {
                id: post.id
            }
        })
    }

}
