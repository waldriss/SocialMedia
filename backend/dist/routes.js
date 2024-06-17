"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = require("./api/controllers/AuthController");
const UserController_1 = require("./api/controllers/UserController");
const storage_1 = require("./api/storage/storage");
const PostController_1 = require("./api/controllers/PostController");
const NotificationController_1 = require("./api/controllers/NotificationController");
require("dotenv/config"); // To read CLERK_API_KEY
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const Auth_1 = require("./api/middlewares/Auth");
const express = require('express');
const routes = express.Router();
routes.use(Auth_1.clerkAuthMiddleware);
routes.use(Auth_1.getUserIdAuthMiddleware);
//--------------------User/auth routes-----------------------
routes.post("/register", AuthController_1.registerUser);
routes.post("/SigInOrSignUpGoogle", AuthController_1.SigInOrSignUpGoogle);
routes.get("/user/:id", UserController_1.getUser);
routes.get("/authenticatedUser/:id", UserController_1.getAuthenticatedUser);
routes.get("/users/:id", UserController_1.getTopUsers);
routes.post("/user/:id", storage_1.upload.single('file'), UserController_1.updateUser);
routes.get("/exploreUsers", UserController_1.getExploreUsers);
//---------follow---------///
routes.post("/follow", UserController_1.follow);
routes.post("/acceptfollow", UserController_1.acceptFollow);
routes.post("/deletefollow", UserController_1.deleteFollow);
//---------follow---------///
//--------------------User/auth routes-----------------------
//--------------------     Post routes-----------------------
routes.post("/createpost", storage_1.upload.single('file'), PostController_1.createPost);
routes.post("/updatepost/:id", storage_1.upload.single('file'), PostController_1.updatePost);
routes.get("/homePosts/:id", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), PostController_1.getHomePosts);
routes.get("/explorePosts", PostController_1.getExplorePosts);
routes.get("/getPost/:id", PostController_1.getPost);
routes.post("/deletePost", PostController_1.deletePost);
//------------- like---------///
routes.post("/likepost", PostController_1.LikePost);
routes.post("/dislikepost", PostController_1.DisLikePost);
//------------share---------///
routes.post("/sharepost", PostController_1.SharePost);
routes.post("/unsharepost", PostController_1.UnSharePost);
//---------comment---------///
routes.post("/commentpost", PostController_1.CommentPost);
routes.post("/deletecomment", PostController_1.DeleteComment);
//--------------------     Post routes-----------------------
//------------------notification routes-----------------------
routes.get("/getNotifications", NotificationController_1.getNotifications);
routes.post("/seeNotification", NotificationController_1.SeeNotification);
//------------------notification routes-----------------------
module.exports = routes;
