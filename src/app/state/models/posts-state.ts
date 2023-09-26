import {GetPostsRequest} from '../../models/get-posts-request';
import {Post} from '../../models/post';

export interface PostsState {
  request?: GetPostsRequest;
  posts: Post[];
  totalCount: number;
  loading: boolean;
  error?: string;
}
