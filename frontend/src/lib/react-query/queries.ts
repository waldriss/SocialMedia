import {
  useInfiniteQuery,
  useQuery
} from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getExplorePosts, getHomePosts, getPost } from "../api/PostRequests";
import { IPost, TExplorePost, TPostDetails } from "../types/Post";
import { AuthenticatedUser, TExploreUser, TopUser, TUser } from "../types/user";
import { getAuth, getExploreUsers, getTopUsers, getUser } from "../api/UserRequests";
import { getNotifications } from "../api/NotificationsRequests";
import { TNotification } from "../types/Notification";
import { GetToken } from "../types/global";


//------------Post Queries-----------------------
export const useGetPost = (postId: string, initialPost: TPostDetails,getToken:GetToken) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST,postId],
    queryFn: () => getPost(postId,getToken),
    initialData: initialPost,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 100,
  });
};

export const useGetHomePosts = (userId: string, initialPosts: IPost[],getToken: GetToken) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_HOME_POSTS,userId],
    queryFn: ({ pageParam = 1 }) => getHomePosts(userId, pageParam,getToken),
    getNextPageParam: (lastpage = [], pages) =>
      lastpage.length === 0 ? undefined : pages.length + 1,
    initialPageParam: 1,
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useGetExplorePosts = (
  initialPosts: TExplorePost[],
  search = "",
  getToken:GetToken,
  userId?:string,
  
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS,userId],
    queryFn: ({ pageParam = 1 }) => getExplorePosts(pageParam, search,getToken,userId),
    getNextPageParam: (lastpage = [], pages) => {
      
      return lastpage.length === 0 ? undefined : pages.length + 1;
    },
    initialPageParam: 1,
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    refetchOnMount: true,
    staleTime: 100,
    enabled:!!userId
  });
};



//------------User Queries-----------------------


export const useGetUser = (userId:string,initialUser:TUser,getToken:GetToken) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER,userId],
    queryFn: () => getUser(userId,getToken),
    initialData: initialUser,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 100,
  });
};
export const useGetAuthenticatedUser = (initialUser:AuthenticatedUser|undefined,getToken:GetToken,userId?:string|null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AUTHENTICATED_USER,userId],
    queryFn: () => getAuth( userId,getToken),
    initialData: initialUser,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 100,
    enabled:!!userId
  });
};
export const useGetTopUsers = (userId:string,initialTopUsers:TopUser[],getToken:GetToken) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TOP_USERS,userId],
    queryFn: () => getTopUsers(userId,getToken),
    initialData: initialTopUsers,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 100,
  });
};


export const useGetExploreUsers = (
  initialExploreUsers: TExploreUser[],
  search = "",
  getToken:GetToken,
  userId?:string
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_EXPLORE_USERS, userId],
    queryFn: ({ pageParam = 1 }) => getExploreUsers(pageParam, search,getToken,userId),
    getNextPageParam: (lastpage = [], pages) => {
      
      return lastpage.length === 0 ? undefined : pages.length + 1;
    },
    initialPageParam: 1,
    initialData: {
      pages: [initialExploreUsers],
      pageParams: [1],
    },
    refetchOnMount: true,
    staleTime: 100,
    enabled:!!userId
  });
};




//------------Notification Queries-----------------------


export const useGetNotifications = (userId: string, initialNotifications: TNotification[]|undefined,getToken:GetToken) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_NOTIFICATIONS,userId],
    queryFn: ({ pageParam = 1 }) => getNotifications(userId, pageParam,getToken),
    getNextPageParam: (lastpage = [], pages) =>
      lastpage.length === 0 ? undefined : pages.length + 1,
    initialPageParam: 1,
    initialData:initialNotifications? {
      pages: [initialNotifications],
      pageParams: [1],
    }:{
      pages: [],
      pageParams: [1]
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 100,
    enabled:!!userId
  });
};
