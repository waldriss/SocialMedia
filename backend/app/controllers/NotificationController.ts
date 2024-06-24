import { Response } from "express";
import {
  getNotificationsRequest,
  SeeNotificationRequest,
} from "../types/notification";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNotifications = async (
  req: getNotificationsRequest,
  res: Response
) => {
  try {

    const { page = "1" } = req.query;
    const userId = parseInt(req.query.userId);
    if (userId != req.AuthentifiedUserId)
  {
      return res.status(401).json({ message: "Unauthorized" });}

    const offset = (parseInt(page) - 1) * 10;
    const notifications = await prisma.notification.findMany({
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
                  state:"pending"
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

    const NumberOfUnseenNotifications = await prisma.notification.count({
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
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const SeeNotification = async (
  req: SeeNotificationRequest,
  res: Response
) => {
  try {
    //controleAuth
    
    const notificationId = parseInt(req.body.notificationId);
    const userId=parseInt(req.body.userId)
    if (userId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const UpdatedNotification = await prisma.notification.update({
      data:{
        state:"seen"
      },
      where: {
        id: notificationId,
      }
    });
    
    return res.status(200).json({ message: "Notification Updated" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
