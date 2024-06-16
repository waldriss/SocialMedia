import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  CommentPostRequest,
  CreatePostRequest,
  DeleteCommentPostRequest,
  deletePostRequest,
  getExplorePostsRequest,
  getHomePostsRequest,
  likeSharePostRequest,
} from "../types/post";
import { uploadPostImage } from "../storage/storage";
import { io } from "..";

const prisma = new PrismaClient();

export const createPost = async (req: CreatePostRequest, res: Response) => {
  try {
    if (req.file != undefined) {
      const postimage = req.file;
      const imageUrl = await uploadPostImage(postimage);
      if (imageUrl) {
        const { caption, location, tags, userId } = req.body;

        if (parseInt(userId) != req.AuthentifiedUserId)
          return res.status(401).json({ message: "Unauthorized" });

        const createdpost = await prisma.post.create({
          data: {
            caption: caption,
            location: location,
            tags: tags.split(","),
            posterId: parseInt(userId),
            postImage: imageUrl,
          },
        });
        return res.status(200).json({ message: "post created" });
      } else {
        return res.status(500).json({ message: "error uploading image" });
      }
    } else {
      return res.status(500).json({ message: "no image found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req: CreatePostRequest, res: Response) => {
  try {
    const postId = parseInt(req?.params?.id);
    if (!postId) return res.status(400).json({ error: "Post ID is required" });

    const { caption, location, tags, userId } = req.body;
    if (parseInt(userId) != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    if (req.file != undefined) {
      const postimage = req.file;
      const imageUrl = await uploadPostImage(postimage);

      const updatedPost = await prisma.post.update({
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
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    } else {
      const updatedPost = await prisma.post.update({
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
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getHomePosts = async (req: getHomePostsRequest, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);
    if (userId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const { page = "1" } = req.query;

    const offset = (parseInt(page) - 1) * 10;

    const posts = await prisma.post.findMany({
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
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getExplorePosts = async (
  req: getExplorePostsRequest,
  res: Response
) => {
  try {
    const { page = "1", search, userId } = req.query;

    const offset = (parseInt(page) - 1) * 10;
    if (!userId) {console.log("here");
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      if (parseInt(userId) != req.AuthentifiedUserId){console.log("here"); return res.status(401).json({ message: "Unauthorized" });
}
      const posts = await prisma.post.findMany({
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
   
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req?.params?.id);

    const post = await prisma.post.findMany({
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
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const SharePost = async (req: likeSharePostRequest, res: Response) => {
  try {
    const { postId, userId } = req.body;
    const sharerId = parseInt(userId);
    const shared_postId = parseInt(postId);

    if (sharerId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const created_share = await prisma.share.create({
      data: {
        sharerId: sharerId,
        shared_postId: shared_postId,
      },
    });
    return res.status(200).json({ message: "Post shared" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const UnSharePost = async (req: likeSharePostRequest, res: Response) => {
  try {
    const { postId, userId } = req.body;
    const sharerId = parseInt(userId);
    const shared_postId = parseInt(postId);
    if (sharerId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });
    const deletedShare = await prisma.share.delete({
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
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const LikePost = async (req: likeSharePostRequest, res: Response) => {
  try {
    
    //await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { postId, userId } = req.body;
    const likerId = parseInt(userId);
    const liked_postId = parseInt(postId);
    if (likerId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const likedpost = await prisma.post.findUnique({
      where: {
        id: liked_postId,
      },
    });
    if (likedpost?.posterId === likerId) {
      const created_like = await prisma.like.create({
        data: {
          likerId: likerId,
          liked_postId: liked_postId,
        },
      });
    } else {
      const created_notification = await prisma.notification.create({
        data: {
          type: "like",
        },
      });

      const created_like = await prisma.like.create({
        data: {
          likerId: likerId,
          liked_postId: liked_postId,
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

      io.to(likedpost?.posterId.toString()).emit("notification", {
        notification: notification,
      });
    }

    return res.status(200).json({ message: "Post liked" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const DisLikePost = async (req: likeSharePostRequest, res: Response) => {
  try {
   
    const { postId, userId } = req.body;
    const likerId = parseInt(userId);
    const liked_postId = parseInt(postId);
    if (likerId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const deletedLike = await prisma.like.delete({
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
      const deletedNotification = await prisma.notification.delete({
        where: {
          id: deletedLike.notificationId,
        },
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: liked_postId },
    });

    io.to(post?.posterId.toString()).emit("refesh_notifications");

    return res.status(200).json({ message: "Post disLiked" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const CommentPost = async (req: CommentPostRequest, res: Response) => {
  try {
    const { postId, userId, body } = req.body;
    const commenterId = parseInt(userId);
    const commented_postId = parseInt(postId);
    if (commenterId != req.AuthentifiedUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const commented_post = await prisma.post.findUnique({
      where: {
        id: commented_postId,
      },
    });
    if (commented_post?.posterId === commenterId) {
      const created_comment = await prisma.comment.create({
        data: {
          commenterId: commenterId,
          commented_postId: commented_postId,
          body: body,
        },
      });
    } else {
      const created_notification = await prisma.notification.create({
        data: {
          type: "comment",
        },
      });

      const created_comment = await prisma.comment.create({
        data: {
          commenterId: commenterId,
          commented_postId: commented_postId,
          notificationId: created_notification.id,
          body: body,
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

      io.to(commented_post?.posterId.toString()).emit("notification", {
        notification: notification,
      });
    }

    return res.status(200).json({ message: "Post commented" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const DeleteComment = async (
  req: DeleteCommentPostRequest,
  res: Response
) => {
  try {
    const { commentId: StringCommentId } = req.body;
    const commentId = parseInt(StringCommentId);

    const commentToDelete = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (commentToDelete) {
      if (commentToDelete.commenterId != req.AuthentifiedUserId)
        return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    if (!deletedComment)
      return res.status(404).json({ message: "comment not found" });
    if (deletedComment.notificationId) {
      const deletedNotification = await prisma.notification.delete({
        where: {
          id: deletedComment.notificationId,
        },
      });
    }

    const post = await prisma.post.findFirst({
      where: { commented_posts: { some: { id: commentId } } },
    });

    io.to(post?.posterId.toString()).emit("refesh_notifications");
    return res.status(200).json({ message: "Comment deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req: deletePostRequest, res: Response) => {
  try {
    const postId = parseInt(req.body.postId);

    const postToDelete = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (postToDelete) {
      if (postToDelete.posterId != req.AuthentifiedUserId)
        return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedpost = await prisma.post.delete({
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
    const commentsNotifications = deletedpost?.commented_posts.map(
      (notification) => {
        return notification?.notificationId ? notification?.notificationId : -1;
      }
    );
    const likesNotifications = deletedpost?.liked_posts.map((notification) => {
      return notification?.notificationId ? notification?.notificationId : -1;
    });

    const filteredLikesNotifs = likesNotifications.filter(
      (value) => value != -1
    );
    const filteredCommentsNotifs = commentsNotifications.filter(
      (value) => value != -1
    );

    const Allnotifications = [
      ...filteredLikesNotifs,
      ...filteredCommentsNotifs,
    ];
    const deletedNotification = await prisma.notification.deleteMany({
      where: {
        id: {
          in: Allnotifications,
        },
      },
    });
    io.to(deletedpost?.posterId.toString()).emit("refesh_notifications");
    return res.status(200).json({ message: "post deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
