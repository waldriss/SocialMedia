import { Request } from "express";

export interface updateUserRequest extends Request {
  body: {
    name?: string;
    username?: string;
    bio?: string;
  };
}


export interface dataToUpdateInterface {
  name?: string;
  username?: string;
  userImage?: string;
  bio?: string;
}

export interface ClerkdataToUpdateInterface {
  firstName?: string;
  username?: string;
}

export interface followRequest extends Request {
  body: {
   followerId:string;
   followedId:string;
  };
}



export interface getExploreUsersRequest extends Request {
  query: {
    page?: string;
    search: string;
    userId?:string;
  };
}