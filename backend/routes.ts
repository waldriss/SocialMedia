import { Router } from "express";
import { registerUser, SigInOrSignUpGoogle } from "./api/controllers/AuthController";
import { acceptFollow, deleteFollow, follow, getAuthenticatedUser, getExploreUsers, getTopUsers, getUser, updateUser } from "./api/controllers/UserController";
import { upload } from "./api/storage/storage";
import { CommentPost, DeleteComment, DisLikePost, LikePost, SharePost, UnSharePost, createPost, deletePost, getExplorePosts, getHomePosts, getPost, updatePost } from "./api/controllers/PostController";
import { getNotifications, SeeNotification } from "./api/controllers/NotificationController";
import 'dotenv/config' // To read CLERK_API_KEY

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { clerkAuthMiddleware, getUserIdAuthMiddleware } from "./api/middlewares/Auth";


const express= require('express');


const routes:Router=express.Router();
routes.use(clerkAuthMiddleware);
routes.use(getUserIdAuthMiddleware);

//--------------------User/auth routes-----------------------
routes.post("/register",registerUser);
routes.post("/SigInOrSignUpGoogle",SigInOrSignUpGoogle);
routes.get("/user/:id",getUser);
routes.get("/authenticatedUser/:id",getAuthenticatedUser);
routes.get("/users/:id",getTopUsers);
routes.post("/user/:id",upload.single('file'),updateUser);
routes.get("/exploreUsers",getExploreUsers);

//---------follow---------///
routes.post("/follow",follow);
routes.post("/acceptfollow",acceptFollow);
routes.post("/deletefollow",deleteFollow);

//---------follow---------///

//--------------------User/auth routes-----------------------




//--------------------     Post routes-----------------------

routes.post("/createpost",upload.single('file'),createPost);
routes.post("/updatepost/:id",upload.single('file'),updatePost)
routes.get("/homePosts/:id",ClerkExpressRequireAuth(),getHomePosts);
routes.get("/explorePosts",getExplorePosts);
routes.get("/getPost/:id",getPost)
routes.post("/deletePost",deletePost);
//------------- like---------///
routes.post("/likepost",LikePost);
routes.post("/dislikepost",DisLikePost);
//------------share---------///
routes.post("/sharepost",SharePost);
routes.post("/unsharepost",UnSharePost);
//---------comment---------///
routes.post("/commentpost",CommentPost);
routes.post("/deletecomment",DeleteComment);


//--------------------     Post routes-----------------------


//------------------notification routes-----------------------

routes.get("/getNotifications",getNotifications);
routes.post("/seeNotification",SeeNotification)

//------------------notification routes-----------------------

module.exports = routes;