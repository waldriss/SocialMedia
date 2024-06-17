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
exports.SeeNotification = exports.getNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1" } = req.query;
        const userId = parseInt(req.query.userId);
        if (userId != req.AuthentifiedUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const offset = (parseInt(page) - 1) * 10;
        const notifications = yield prisma.notification.findMany({
            take: +10,
            skip: +offset,
            orderBy: {
                createdAt: "desc",
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
            where: {
                OR: [
                    {
                        like: {
                            liked_post: {
                                posterId: userId,
                            },
                        },
                    },
                    {
                        comment: {
                            commented_post: {
                                posterId: userId,
                            },
                        },
                    },
                    {
                        OR: [
                            {
                                followRequest: {
                                    followedId: userId,
                                },
                            },
                            {
                                followRequest: {
                                    followerId: userId,
                                    state: "accepted",
                                },
                            },
                        ],
                    },
                ],
            },
        });
        const NumberOfUnseenNotifications = yield prisma.notification.count({
            where: {
                state: "unseen",
                OR: [
                    {
                        like: {
                            liked_post: {
                                posterId: userId,
                            },
                        },
                    },
                    {
                        comment: {
                            commented_post: {
                                posterId: userId,
                            },
                        },
                    },
                    {
                        OR: [
                            {
                                followRequest: {
                                    followedId: userId,
                                },
                            },
                            {
                                followRequest: {
                                    followerId: userId,
                                    state: "accepted",
                                },
                            },
                        ],
                    },
                ],
            },
        });
        return res
            .status(200)
            .json({
            notifications: notifications,
            NbUnseenNotifications: NumberOfUnseenNotifications,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});
exports.getNotifications = getNotifications;
const SeeNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //controleAuth
        const notificationId = parseInt(req.body.notificationId);
        const userId = parseInt(req.body.userId);
        if (userId != req.AuthentifiedUserId)
            return res.status(401).json({ message: "Unauthorized" });
        const UpdatedNotification = yield prisma.notification.update({
            data: {
                state: "seen"
            },
            where: {
                id: notificationId,
            }
        });
        return res.status(200).json({ message: "Notification Updated" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.SeeNotification = SeeNotification;
