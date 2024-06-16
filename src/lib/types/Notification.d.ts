export interface TNotification{
    id:number;
    createdAt:Date;
    state:string;
    type:string;
    like:TNotifLike|null;
    comment:TNotifComment|null;
    followRequest:TNotifFollowRequest|null
    NbUnseenNotifications?:number

}


export interface TNotifUser{
    id:number;
    name:string;
    userImage:string;
}

export interface TNotifLike{
    liker:TNotifUser;
    liked_postId:number;
}
export interface TNotifComment{
    commenter:TNotifUser;
    commented_postId;
}
export interface TNotifFollowRequest{
    follower:TNotifUser;
    followed:TNotifUser;
}