import { Commenter } from "./user";

export interface IPost{
    
    posterId: number;
    caption: string;
    tags: string[];
    location: string;
    createdAt:Date;
    id:number;
    postImage:string;
    poster:IPoster;
    liked_posts:Liker[];
    shared_posts:Sharer[];
    _count:HomePostsNumberOfComments;
   
  

}

export interface Liker{
    likerId:number;
}
export interface Sharer{
    sharerId:number;
}
export interface TComment{
    createdAt:Date;
    commented_postId:number;
    body:string;
    commenterId:number;
    id:number;
    commenter:Commenter
}

export interface IPoster{
    name:string;
    username:string;
    userImage:string;
}


export interface TExplorePoster{
    name:string;
    userImage:string;
}



export interface TPostDetails{
    posterId: number;
    caption: string;
    tags: string[];
    location: string;
    createdAt:Date;
    id:number;
    postImage:string;
    poster:IPoster;
    commented_posts:TComment[];
    liked_posts:Liker[];
    shared_posts:Sharer[];

}


export interface TExplorePost{
    
    posterId: number;
    createdAt:Date;
    id:number;
    postImage:string;
    poster:TExplorePoster;
    _count:ExplorePostsLikes;
    liked_posts:Liker[];
    shared_posts:Sharer[];
    
  

}

export interface ExplorePostsLikes{
    liked_posts:number
}


interface HomePostsNumberOfComments{
    commented_posts:number
}




export interface infiniteQueryData<T> {
    pages: T[][],
    pageParams: number[],
}