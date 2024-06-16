import { Request } from "express";
import { IFile } from "./globalTypes";

export interface likeSharePostRequest extends Request {
  body: {
    postId: string;
    userId: string;
  };
}

export interface CommentPostRequest extends Request {
  body: {
    postId: string;
    userId: string;
    body: string;
  };
}
export interface DeleteCommentPostRequest extends Request {
  body: {
    commentId: string;
    
  };
}

export interface CreatePostRequest extends Request {
  body: {
    userId: string;
    caption: string;
    tags: string;
    location: string;
  };
}

export interface getHomePostsRequest extends Request {
  query: {
    page?: string;
  };
  auth?:any
}

export interface getExplorePostsRequest extends Request {
  query: {
    page?: string;
    search: string;
    userId?:string;
  };
}



export interface deletePostRequest extends Request {
  body: {
    postId: string;
  };
}