import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  ClerkdataToUpdateInterface,
  dataToUpdateInterface,
  followRequest,
  getExploreUsersRequest,
  updateUserRequest,
} from "../types/user";
import { uploadProfileImage } from "../storage/storage";
import { io } from "..";

import { customclerkClient } from "..";
const prisma = new PrismaClient();

export const updateUser = async (req: updateUserRequest, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);
    if (userId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const { name, username, bio } = req.body;
    console.log(bio);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const dataToUpdate: dataToUpdateInterface = {};
      const clerkUpdate: ClerkdataToUpdateInterface = {};
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
      } else {
        dataToUpdate.bio = "";
      }
      if (req.file != undefined) {
        const userImage = req.file;
        const imageUrl = await uploadProfileImage(userImage);
        dataToUpdate.userImage = imageUrl;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });
      const clerkUsers = await customclerkClient.users.getUserList({
        externalId: [req?.params?.id],
      });

      const updatedclerkuser = await customclerkClient.users.updateUser(
        clerkUsers[0].id,
        clerkUpdate
      );

      return res
        .status(200)
        .json({ message: "user updated", updatedUser: updatedUser });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(401).json({ message: "username already used." });
      }
    }
    return res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const user = await prisma.user.findUnique({
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
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);
    if (userId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
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
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
export const getTopUsers = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);
    if (userId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const users = await prisma.user.findMany({
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
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
export const getExploreUsers = async (
  req: getExploreUsersRequest,
  res: Response
) => {
  try {
    const { page = "1", search = "", userId } = req.query;

    const offset = (parseInt(page) - 1) * 10;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      if (parseInt(userId) != req.AuthentifiedUserId)
        return res.status(401).json({ message: "Unauthorized" });
      const users = await prisma.user.findMany({
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
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const follow = async (req: followRequest, res: Response) => {
  try {
    const followerId = parseInt(req.body.followerId);
    const followedId = parseInt(req.body.followedId);

    if (followerId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const created_notification = await prisma.notification.create({
      data: {
        type: "follow",
      },
    });
    const created_follow_request = await prisma.followRequest.create({
      data: {
        followerId: followerId,
        followedId: followedId,
        notificationId: created_notification.id,
      },
    });
    const notification = await prisma.notification.findUnique({
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

    io.to(notification?.followRequest?.followed.id.toString()).emit(
      "notification",
      {
        notification: notification,
      }
    );

    return res.status(200).json({ message: "follow request sent" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const acceptFollow = async (req: followRequest, res: Response) => {
  try {
    const followerId = parseInt(req.body.followerId);
    const followedId = parseInt(req.body.followedId);

    if (followedId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const follow_request = await prisma.followRequest.updateMany({
      where: {
        followerId: followerId,
        followedId: followedId,
      },
      data: {
        state: "accepted",
      },
    });
    const updatedNotification = await prisma.notification.updateMany({
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

    const notification = await prisma.notification.findFirst({
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

    io.to(notification?.followRequest?.follower.id.toString()).emit(
      "notification",
      {
        notification: notification,
      }
    );

    return res.status(200).json({ message: "follow Request accepted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
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
export const deleteFollow = async (req: followRequest, res: Response) => {
  try {
    const followerId = parseInt(req.body.followerId);
    const followedId = parseInt(req.body.followedId);
    if (
      followerId != req.AuthentifiedUserId &&
      followedId != req.AuthentifiedUserId
    )
      return res.status(401).json({ message: "Unauthorized" });

    const deleted_follow_request = await prisma.followRequest.deleteMany({
      where: {
        followerId: followerId,
        followedId: followedId,
      },
    });

    if (!deleted_follow_request)
      return res.status(404).json({ message: "follow Request not found" });
    const notification = await prisma.notification.findFirst({
      where: {
        followRequest: {
          followerId: followerId,
          followedId: followedId,
        },
      },
    });
    const deletedNotification = await prisma.notification.deleteMany({
      where: {
        followRequest: {
          followerId: followerId,
          followedId: followedId,
        },
      },
    });
    if (notification?.type === "follow") {
      io.to(req.body.followedId).emit("refesh_notifications");
    }

    return res.status(200).json({ message: "follow Request deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};






export const serverfunc = async (req: Request, res: Response) => {
  try {
    
    return res.status(200).json({ message: "response" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};