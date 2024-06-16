export interface UserToRegister{
    email: string,
    username: string,
    name: string,
    password:string,
}

export interface TUser{
    
    id: number;
    email: string;
    name: string;
    username: string;
    bio?:string;
    userImage?:string;
    posts:TUserPost[];
    shares:TUserShare[];
    following:FollowerRequest[];
    followedBy:FollowedRequest[];
    

}
export interface FollowerRequest{
    followed:FollowerOrfollowed,
    state:string
}
export interface FollowedRequest{
    follower:FollowerOrfollowed,
    state:string
}
export interface FollowerOrfollowed extends Commenter{
}
export interface TUserPost{
    id:number;
    postImage:string;
}


export interface UpdatedUser{
    name:string;
    bio?:string;
    username:string;
    file?:File[];
}


export interface Commenter{
    name:string;
    username:string;
    id:number;
    userImage:string;

}

export interface TUserShare{
    shared_post:TUserPost

}


export interface TopUser{
    name:string;
    username:string;
    id:number;
    userImage:string;

}
export interface updatedUserMutationResponse {
    message:string;
    updatedUser:UpdatedUserFromResponse
}
export interface UpdatedUserFromResponse extends TopUser{
    bio?:string;
    userImage?:string;
}

export interface AuthenticatedUser extends TopUser{
}

export interface TExploreUser extends TopUser{
}