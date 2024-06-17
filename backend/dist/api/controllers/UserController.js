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
exports.deleteFollow = exports.acceptFollow = exports.follow = exports.getExploreUsers = exports.getTopUsers = exports.getAuthenticatedUser = exports.getUser = exports.updateUser = void 0;
const client_1 = require("@prisma/client");
const storage_1 = require("../storage/storage");
const __1 = require("..");
const __2 = require("..");
const prisma = new client_1.PrismaClient();
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = parseInt((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
        if (userId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const { name, username, bio } = req.body;
        console.log(bio);
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            const dataToUpdate = {};
            const clerkUpdate = {};
            if (name != undefined) {
                dataToUpdate.name = name;
                clerkUpdate.firstName = name;
            }
            if (username != undefined) {
                dataToUpdate.username = username;
                clerkUpdate.username = username;
            }
            if (bio != undefined) {
                dataToUpdate.bio = bio;
            }
            else {
                dataToUpdate.bio = "";
            }
            if (req.file != undefined) {
                const userImage = req.file;
                const imageUrl = yield (0, storage_1.uploadProfileImage)(userImage);
                dataToUpdate.userImage = imageUrl;
            }
            const updatedUser = yield prisma.user.update({
                where: { id: userId },
                data: dataToUpdate,
            });
            const clerkUsers = yield __2.customclerkClient.users.getUserList({
                externalId: [(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id],
            });
            const updatedclerkuser = yield __2.customclerkClient.users.updateUser(clerkUsers[0].id, clerkUpdate);
            return res
                .status(200)
                .json({ message: "user updated", updatedUser: updatedUser });
        }
        else {
            return res.status(404).json({ message: "user not found" });
        }
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(401).json({ message: "username already used." });
            }
        }
        return res.status(500).json({ message: err.message });
    }
});
exports.updateUser = updateUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = parseInt((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id);
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: {
                    select: {
                        id: true,
                        postImage: true,
                    },
                },
                shares: {
                    select: {
                        shared_post: {
                            select: {
                                id: true,
                                postImage: true,
                            },
                        },
                    },
                },
                following: {
                    select: {
                        state: true,
                        followed: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                userImage: true,
                            },
                        },
                    },
                },
                followedBy: {
                    select: {
                        state: true,
                        follower: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                userImage: true,
                            },
                        },
                    },
                },
            },
        });
        if (user) {
            return res.status(200).json({ user: user });
        }
        else {
            return res.status(404).json({ message: "user not found" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getUser = getUser;
const getAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = parseInt((_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id);
        if (userId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                userImage: true,
                username: true,
            },
        });
        if (user) {
            return res.status(200).json({ user: user });
        }
        else {
            return res.status(404).json({ message: "user not found" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const getTopUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = parseInt((_e = req === null || req === void 0 ? void 0 : req.params) === null || _e === void 0 ? void 0 : _e.id);
        if (userId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const users = yield prisma.user.findMany({
            where: {
                NOT: {
                    followedBy: {
                        some: {
                            followerId: userId,
                        },
                    },
                },
                id: { notIn: [userId] },
            },
            select: {
                id: true,
                userImage: true,
                username: true,
                name: true,
            },
            orderBy: {
                followedBy: {
                    _count: "desc",
                },
            },
        });
        return res.status(200).json({ users: users });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getTopUsers = getTopUsers;
const getExploreUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", search = "", userId } = req.query;
        const offset = (parseInt(page) - 1) * 10;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        else {
            if (parseInt(userId) != req.AuthentifiedUserId)
                return res.status(401).json({ message: "Unauthorized" });
            const users = yield prisma.user.findMany({
                take: +10,
                skip: +offset,
                where: {
                    OR: [
                        { name: { contains: search } },
                        { username: { contains: search } },
                    ],
                },
                select: {
                    id: true,
                    userImage: true,
                    username: true,
                    name: true,
                },
            });
            return res.status(200).json({ users: users });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getExploreUsers = getExploreUsers;
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const followerId = parseInt(req.body.followerId);
        const followedId = parseInt(req.body.followedId);
        if (followerId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const created_notification = yield prisma.notification.create({
            data: {
                type: "follow",
            },
        });
        const created_follow_request = yield prisma.followRequest.create({
            data: {
                followerId: followerId,
                followedId: followedId,
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
        __1.io.to((_f = notification === null || notification === void 0 ? void 0 : notification.followRequest) === null || _f === void 0 ? void 0 : _f.followed.id.toString()).emit("notification", {
            notification: notification,
        });
        return res.status(200).json({ message: "follow request sent" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.follow = follow;
const acceptFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const followerId = parseInt(req.body.followerId);
        const followedId = parseInt(req.body.followedId);
        if (followedId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const follow_request = yield prisma.followRequest.updateMany({
            where: {
                followerId: followerId,
                followedId: followedId,
            },
            data: {
                state: "accepted",
            },
        });
        const updatedNotification = yield prisma.notification.updateMany({
            data: {
                type: "accept_follow",
                createdAt: new Date(),
            },
            where: {
                followRequest: {
                    followerId: followerId,
                    followedId: followedId,
                },
            },
        });
        const notification = yield prisma.notification.findFirst({
            where: {
                followRequest: {
                    followerId: followerId,
                    followedId: followedId,
                },
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
        __1.io.to((_g = notification === null || notification === void 0 ? void 0 : notification.followRequest) === null || _g === void 0 ? void 0 : _g.follower.id.toString()).emit("notification", {
            notification: notification,
        });
        return res.status(200).json({ message: "follow Request accepted" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.acceptFollow = acceptFollow;
/*
export const declineFollow = async (req: followRequest, res: Response) => {
  try {
    const followerId = parseInt(req.body.followerId);
    const followedId = parseInt(req.body.followedId);

    const follow_request = await prisma.followRequest.updateMany({
      where: {
        followingId: followerId,
        followedById: followedId,
      },
      data: {
        state: "declined",
      },
    });

    return res.status(200).json({ message: "follow declined" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
*/
const deleteFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = parseInt(req.body.followerId);
        const followedId = parseInt(req.body.followedId);
        if (followerId != req.AuthentifiedUserId &&
            followedId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const deleted_follow_request = yield prisma.followRequest.deleteMany({
            where: {
                followerId: followerId,
                followedId: followedId,
            },
        });
        if (!deleted_follow_request)
            return res.status(404).json({ message: "follow Request not found" });
        const notification = yield prisma.notification.findFirst({
            where: {
                followRequest: {
                    followerId: followerId,
                    followedId: followedId,
                },
            },
        });
        const deletedNotification = yield prisma.notification.deleteMany({
            where: {
                followRequest: {
                    followerId: followerId,
                    followedId: followedId,
                },
            },
        });
        if ((notification === null || notification === void 0 ? void 0 : notification.type) === "follow") {
            __1.io.to(req.body.followedId).emit("refesh_notifications");
        }
        return res.status(200).json({ message: "follow Request deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.deleteFollow = deleteFollow;
