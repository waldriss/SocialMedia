"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.DeleteComment = exports.CommentPost = exports.DisLikePost = exports.LikePost = exports.UnSharePost = exports.SharePost = exports.getPost = exports.getExplorePosts = exports.getHomePosts = exports.updatePost = exports.createPost = void 0;
const client_1 = require("@prisma/client");
const storage_1 = require("../storage/storage");
const __1 = require("..");
const prisma = new client_1.PrismaClient();
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file != undefined) {
            const postimage = req.file;
            const imageUrl = yield (0, storage_1.uploadPostImage)(postimage);
            if (imageUrl) {
                const { caption, location, tags, userId } = req.body;
                if (parseInt(userId) != req.AuthentifiedUserId)
                    return res.status(401).json({ message: "Unauthorized" });
                const createdpost = yield prisma.post.create({
                    data: {
                        caption: caption,
                        location: location,
                        tags: tags.split(","),
                        posterId: parseInt(userId),
                        postImage: imageUrl,
                    },
                });
                return res.status(200).json({ message: "post created" });
            }
            else {
                return res.status(500).json({ message: "error uploading image" });
            }
        }
        else {
            return res.status(500).json({ message: "no image found" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const postId = parseInt((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
        if (!postId)
            return res.status(400).json({ error: "Post ID is required" });
        const { caption, location, tags, userId } = req.body;
        if (parseInt(userId) != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.file != undefined) {
            const postimage = req.file;
            const imageUrl = yield (0, storage_1.uploadPostImage)(postimage);
            const updatedPost = yield prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    caption: caption,
                    location: location,
                    tags: tags.split(","),
                    postImage: imageUrl,
                },
            });
            if (updatedPost) {
                return res.status(200).json({ message: "post updated" });
            }
            else {
                return res.status(404).json({ error: "Post not found" });
            }
        }
        else {
            const updatedPost = yield prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    caption: caption,
                    location: location,
                    tags: tags.split(","),
                },
            });
            if (updatedPost) {
                return res.status(200).json({ message: "post updated" });
            }
            else {
                return res.status(404).json({ error: "Post not found" });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.updatePost = updatePost;
const getHomePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = parseInt((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id);
        if (userId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const { page = "1" } = req.query;
        const offset = (parseInt(page) - 1) * 10;
        const posts = yield prisma.post.findMany({
            take: +10,
            skip: +offset,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        commented_posts: true,
                    },
                },
                poster: {
                    select: {
                        name: true,
                        username: true,
                        userImage: true,
                    },
                },
                liked_posts: {
                    select: {
                        likerId: true,
                    },
                },
                shared_posts: {
                    select: {
                        sharerId: true,
                    },
                },
            },
            /*where: {
              poster: {
                followedBy: {
                  some: {
                    followingId: userId,
                  },
                },
              },
            },*/
        });
        return res.status(200).json({ posts: posts });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});
exports.getHomePosts = getHomePosts;
const getExplorePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", search, userId } = req.query;
        const offset = (parseInt(page) - 1) * 10;
        if (!userId) {
            console.log("here");
            return res.status(401).json({ message: "Unauthorized" });
        }
        else {
            if (parseInt(userId) != req.AuthentifiedUserId) {
                console.log("here");
                return res.status(401).json({ message: "Unauthorized" });
            }
            const posts = yield prisma.post.findMany({
                take: +10,
                skip: +offset,
                where: {
                    OR: [
                        { location: { contains: search } },
                        { caption: { contains: search } },
                        { tags: { hasSome: [search ? search : ""] } },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    _count: {
                        select: {
                            liked_posts: true,
                        },
                    },
                    id: true,
                    postImage: true,
                    posterId: true,
                    createdAt: true,
                    poster: {
                        select: {
                            userImage: true,
                            name: true,
                        },
                    },
                    liked_posts: {
                        select: {
                            likerId: true,
                        },
                    },
                    shared_posts: {
                        select: {
                            sharerId: true,
                        },
                    },
                },
            });
            return res.status(200).json({ posts: posts });
        }
        //await new Promise(resolve => setTimeout(resolve, 5000));
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getExplorePosts = getExplorePosts;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const postId = parseInt((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id);
        const post = yield prisma.post.findMany({
            where: {
                id: postId,
            },
            include: {
                poster: {
                    select: {
                        name: true,
                        username: true,
                        userImage: true,
                    },
                },
                liked_posts: {
                    select: {
                        likerId: true,
                    },
                },
                shared_posts: {
                    select: {
                        sharerId: true,
                    },
                },
                commented_posts: {
                    include: {
                        commenter: {
                            select: { name: true, username: true, id: true, userImage: true },
                        },
                    },
                },
            },
        });
        return res.status(200).json({ post: post });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getPost = getPost;
const SharePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.body;
        const sharerId = parseInt(userId);
        const shared_postId = parseInt(postId);
        if (sharerId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const created_share = yield prisma.share.create({
            data: {
                sharerId: sharerId,
                shared_postId: shared_postId,
            },
        });
        return res.status(200).json({ message: "Post shared" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.SharePost = SharePost;
const UnSharePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.body;
        const sharerId = parseInt(userId);
        const shared_postId = parseInt(postId);
        if (sharerId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const deletedShare = yield prisma.share.delete({
            where: {
                sharerId_shared_postId: {
                    sharerId: sharerId,
                    shared_postId: shared_postId,
                },
            },
        });
        if (!deletedShare)
            return res.status(404).json({ message: "share not found" });
        return res.status(200).json({ message: "Post Unshared" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.UnSharePost = UnSharePost;
const LikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //await new Promise(resolve => setTimeout(resolve, 2000));
        const { postId, userId } = req.body;
        const likerId = parseInt(userId);
        const liked_postId = parseInt(postId);
        if (likerId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const likedpost = yield prisma.post.findUnique({
            where: {
                id: liked_postId,
            },
        });
        if ((likedpost === null || likedpost === void 0 ? void 0 : likedpost.posterId) === likerId) {
            const created_like = yield prisma.like.create({
                data: {
                    likerId: likerId,
                    liked_postId: liked_postId,
                },
            });
        }
        else {
            const created_notification = yield prisma.notification.create({
                data: {
                    type: "like",
                },
            });
            const created_like = yield prisma.like.create({
                data: {
                    likerId: likerId,
                    liked_postId: liked_postId,
                    notificationId: created_notification.id,
                },
            });
            const notification = yield prisma.notification.findUnique({
                where: {
                    id: created_notification.id,
                },
                select: {
                    id: true,
                    createdAt: true,
                    state: true,
                    type: true,
                    like: {
                        select: {
                            liker: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                            liked_postId: true,
                        },
                    },
                    comment: {
                        select: {
                            commenter: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                            commented_postId: true,
                        },
                    },
                    followRequest: {
                        select: {
                            follower: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                            followed: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                        },
                    },
                },
            });
            __1.io.to(likedpost === null || likedpost === void 0 ? void 0 : likedpost.posterId.toString()).emit("notification", {
                notification: notification,
            });
        }
        return res.status(200).json({ message: "Post liked" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.LikePost = LikePost;
const DisLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.body;
        const likerId = parseInt(userId);
        const liked_postId = parseInt(postId);
        if (likerId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const deletedLike = yield prisma.like.delete({
            where: {
                likerId_liked_postId: {
                    liked_postId: liked_postId,
                    likerId: likerId,
                },
            },
        });
        if (!deletedLike)
            return res.status(404).json({ message: "like not found" });
        if (deletedLike.notificationId) {
            const deletedNotification = yield prisma.notification.delete({
                where: {
                    id: deletedLike.notificationId,
                },
            });
        }
        const post = yield prisma.post.findUnique({
            where: { id: liked_postId },
        });
        __1.io.to(post === null || post === void 0 ? void 0 : post.posterId.toString()).emit("refesh_notifications");
        return res.status(200).json({ message: "Post disLiked" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.DisLikePost = DisLikePost;
const CommentPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId, body } = req.body;
        const commenterId = parseInt(userId);
        const commented_postId = parseInt(postId);
        if (commenterId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const commented_post = yield prisma.post.findUnique({
            where: {
                id: commented_postId,
            },
        });
        if ((commented_post === null || commented_post === void 0 ? void 0 : commented_post.posterId) === commenterId) {
            const created_comment = yield prisma.comment.create({
                data: {
                    commenterId: commenterId,
                    commented_postId: commented_postId,
                    body: body,
                },
            });
        }
        else {
            const created_notification = yield prisma.notification.create({
                data: {
                    type: "comment",
                },
            });
            const created_comment = yield prisma.comment.create({
                data: {
                    commenterId: commenterId,
                    commented_postId: commented_postId,
                    notificationId: created_notification.id,
                    body: body,
                },
            });
            const notification = yield prisma.notification.findUnique({
                where: {
                    id: created_notification.id,
                },
                select: {
                    id: true,
                    createdAt: true,
                    state: true,
                    type: true,
                    like: {
                        select: {
                            liker: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                            liked_postId: true,
                        },
                    },
                    comment: {
                        select: {
                            commenter: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                            commented_postId: true,
                        },
                    },
                    followRequest: {
                        select: {
                            follower: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                            followed: {
                                select: {
                                    id: true,
                                    name: true,
                                    userImage: true,
                                },
                            },
                        },
                    },
                },
            });
            __1.io.to(commented_post === null || commented_post === void 0 ? void 0 : commented_post.posterId.toString()).emit("notification", {
                notification: notification,
            });
        }
        return res.status(200).json({ message: "Post commented" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.CommentPost = CommentPost;
const DeleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId: StringCommentId } = req.body;
        const commentId = parseInt(StringCommentId);
        const commentToDelete = yield prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });
        if (commentToDelete) {
            if (commentToDelete.commenterId != req.AuthentifiedUserId)
                return res.status(401).json({ message: "Unauthorized" });
        }
        const deletedComment = yield prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
        if (!deletedComment)
            return res.status(404).json({ message: "comment not found" });
        if (deletedComment.notificationId) {
            const deletedNotification = yield prisma.notification.delete({
                where: {
                    id: deletedComment.notificationId,
                },
            });
        }
        const post = yield prisma.post.findFirst({
            where: { commented_posts: { some: { id: commentId } } },
        });
        __1.io.to(post === null || post === void 0 ? void 0 : post.posterId.toString()).emit("refesh_notifications");
        return res.status(200).json({ message: "Comment deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.DeleteComment = DeleteComment;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.body.postId);
        const postToDelete = yield prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (postToDelete) {
            if (postToDelete.posterId != req.AuthentifiedUserId)
                return res.status(401).json({ message: "Unauthorized" });
        }
        const deletedpost = yield prisma.post.delete({
            where: {
                id: postId,
            },
            select: {
                posterId: true,
                liked_posts: {
                    select: {
                        notificationId: true,
                    },
                },
                commented_posts: {
                    select: {
                        notificationId: true,
                    },
                },
            },
        });
        const commentsNotifications = deletedpost === null || deletedpost === void 0 ? void 0 : deletedpost.commented_posts.map((notification) => {
            return (notification === null || notification === void 0 ? void 0 : notification.notificationId) ? notification === null || notification === void 0 ? void 0 : notification.notificationId : -1;
        });
        const likesNotifications = deletedpost === null || deletedpost === void 0 ? void 0 : deletedpost.liked_posts.map((notification) => {
            return (notification === null || notification === void 0 ? void 0 : notification.notificationId) ? notification === null || notification === void 0 ? void 0 : notification.notificationId : -1;
        });
        const filteredLikesNotifs = likesNotifications.filter((value) => value != -1);
        const filteredCommentsNotifs = commentsNotifications.filter((value) => value != -1);
        const Allnotifications = [
            ...filteredLikesNotifs,
            ...filteredCommentsNotifs,
        ];
        const deletedNotification = yield prisma.notification.deleteMany({
            where: {
                id: {
                    in: Allnotifications,
                },
            },
        });
        __1.io.to(deletedpost === null || deletedpost === void 0 ? void 0 : deletedpost.posterId.toString()).emit("refesh_notifications");
        return res.status(200).json({ message: "post deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.deletePost = deletePost;
