import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  dislikePost,
  likePost,
  sharePost,
  unsharePost,
  updatePost,
} from "../api/PostRequests";
import { NewPost, UpdatedPost } from "../types/PostRequestsTypes";
import { QUERY_KEYS } from "./queryKeys";
import {
  TUser,
  UpdatedUser,
  updatedUserMutationResponse,
  UserToRegister,
} from "../types/user";
import {
  acceptFollow,
  deleteFollow,
  follow,
  updateUser,
} from "../api/UserRequests";
import { seeNotification } from "../api/NotificationsRequests";
import { registerUserInDB } from "../api/AuthRequests";
import { GetToken, ToastError } from "../types/global";
import {
  infiniteQueryData,
  IPost,
  TExplorePost,
  TPostDetails,
} from "../types/Post";
import {
  addLikerToExplorePost,
  addLikerToOnePost,
  addLikerToPost,
  addSharerToExplorePost,
  addSharerToOnePost,
  addSharerToPost,
  removeLikerFromExplorePost,
  removeLikerFromOnePost,
  removeLikerFromPost,
  removeSharerFromExplorePost,
  removeSharerFromOnePost,
  removeSharerFromPost,
} from "../utils";

//------------Post Mutations
export const useCreatePost = (userId: string, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost: NewPost) => createPost(newPost, getToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, userId],
      });
    },
  });
};

export const useUpdatePost = (
  postId: number | undefined,
  userId: string,
  getToken: GetToken
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedPost: UpdatedPost) =>
      updatePost(updatedPost, postId, getToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, userId],
      });
    },
  });
};

export const useLikePost = (userId: string, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: number; userId: number }) =>
      likePost(postId, userId, getToken),
    onMutate: async ({ postId, userId }) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<IPost>) => {
          if (data != undefined) {
            const newData = addLikerToPost(data, postId, userId);
            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<TExplorePost>) => {
          if (data != undefined) {
            const newData = addLikerToExplorePost(data, postId, userId);
            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_POST, postId.toString()] },
        (data: undefined | TPostDetails) => {
          if (data != undefined) {
            const newData = addLikerToOnePost(data, userId);

            return newData;
          }
        }
      );
    },
    onSettled: (data, error, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, postId.toString()],
      });
    },
  });
};

export const useDisLikePost = (userId: string, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: number; userId: number }) =>
      dislikePost(postId, userId, getToken),
    onMutate: async ({ postId, userId }) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<IPost>) => {
          if (data != undefined) {
            const newData = removeLikerFromPost(data, postId, userId);

            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<TExplorePost>) => {
          if (data != undefined) {
            const newData = removeLikerFromExplorePost(data, postId, userId);

            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_POST, postId.toString()] },
        (data: undefined | TPostDetails) => {
          if (data != undefined) {
            const newData = removeLikerFromOnePost(data, userId);

            return newData;
          }
        }
      );
    },
    onSettled: (data, error, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, postId.toString()],
      });
    },
  });
};

export const useSharePost = (userId: string, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: number; userId: number }) =>
      sharePost(postId, userId, getToken),
    onMutate: async ({ postId, userId }) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<IPost>) => {
          if (data != undefined) {
            const newData = addSharerToPost(data, postId, userId);

            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<TExplorePost>) => {
          if (data != undefined) {
            const newData = addSharerToExplorePost(data, postId, userId);

            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_POST, postId.toString()] },
        (data: undefined | TPostDetails) => {
          if (data != undefined) {
            const newData = addSharerToOnePost(data, userId);

            return newData;
          }
        }
      );
    },
    onSettled: (data, error, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, postId.toString()],
      });
    },
  });
};

export const useUnsharePost = (userId: string, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: number; userId: number }) =>
      unsharePost(postId, userId, getToken),
    onMutate: async ({ postId, userId }) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<IPost>) => {
          if (data != undefined) {
            const newData = removeSharerFromPost(data, postId, userId);

            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId.toString()] },
        (data: undefined | infiniteQueryData<TExplorePost>) => {
          if (data != undefined) {
            const newData = removeSharerFromExplorePost(data, postId, userId);

            return {
              pages: newData?.pages ? newData.pages : [],
              pageParams: newData?.pageParams ? newData.pageParams : [],
            };
          }
        }
      );
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.GET_POST, postId.toString()] },
        (data: undefined | TPostDetails) => {
          if (data != undefined) {
            const newData = removeSharerFromOnePost(data, userId);

            return newData;
          }
        }
      );
    },
    onSettled: (data, error, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, postId.toString()],
      });
    },
  });
};

export const useCommentPost = (postId: number, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      userId,
      body,
    }: {
      postId: number;
      userId: number;
      body: string;
    }) => commentPost(postId, userId, body, getToken),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, postId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, variables.userId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, variables.userId.toString()],
      });
    },
  });
};

export const useDeleteComment = (postId: number, getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      userId,
    }: {
      commentId: number;
      userId: string;
    }) => deleteComment(commentId, getToken),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, postId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, variables.userId],
      });
    },
  });
};

export const useDeletePost = (getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: number; userId: string }) =>
      deletePost(postId, getToken),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, variables.postId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, variables.userId],
      });
    },
  });
};

//-------Auth Mutations
export const useRegisterInDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userToRegister: UserToRegister) =>
      registerUserInDB(userToRegister),
    onSuccess: ({ data, variables }) => {
      /* queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER,id.toString()]
      });
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AUTHENTICATED_USER,id.toString()]
      });*/
    },
  });
};

//------------User Mutations

export const useUpdateUser = (id: number, getToken: GetToken,toastError:ToastError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedUser: UpdatedUser) =>
      updateUser(updatedUser, id, getToken),
    onSuccess: (updatedUserResponse: updatedUserMutationResponse) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.GET_USER, id.toString()],
        },
        (data: TUser | undefined) => {
          return data
            ? {
                ...data,
                bio: updatedUserResponse.updatedUser.bio,
                name: updatedUserResponse.updatedUser.name,
                username: updatedUserResponse.updatedUser.username,
                userImage: updatedUserResponse.updatedUser.userImage,
              }
            : undefined;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, id.toString()],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_AUTHENTICATED_USER, id.toString()],
      });
    },
    onError:(error)=>{
      toastError(error.message,"Editing User")

    }
  });
};

export const useFollow = (getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      followerId,
      followedId,
    }: {
      followerId: number;
      followedId: number;
    }) => follow(followerId, followedId, getToken),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, variables.followedId.toString()],
      });
    },
  });
};

export const useAcceptFollow = (getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      followerId,
      followedId,
    }: {
      followerId: number;
      followedId: number;
    }) => acceptFollow(followerId, followedId, getToken),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, variables.followerId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, variables.followedId.toString()],
      });
    },
  });
};

export const useDeleteFollow = (getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      followerId,
      followedId,
    }: {
      followerId: number;
      followedId: number;
    }) => deleteFollow(followerId, followedId, getToken),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, variables.followerId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER, variables.followedId.toString()],
      });
    },
  });
};

// Notification Mutations

export const useSeeNotification = (getToken: GetToken) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      notificationId,
      userId,
    }: {
      notificationId: number;
      userId: string;
    }) => seeNotification(notificationId, userId, getToken),
    onSuccess: (data, variables) => {
      console.log(variables.userId);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_NOTIFICATIONS, variables.userId],
      });
    },
  });
};
