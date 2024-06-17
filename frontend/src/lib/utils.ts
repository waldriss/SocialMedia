import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import io from "socket.io-client";
import { TNotification } from "./types/Notification";
import { infiniteQueryData, IPost, TExplorePost, TPostDetails } from "./types/Post";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//export const socket = io("http://localhost:5000");
export const socket = io("https://imgram-backend.fly.dev/");

export function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36 string
  const randomStr = Math.random().toString(36).substring(2, 8);
  console.log(randomStr); // Generate random string
  return timestamp + randomStr; // Concatenate timestamp and random string
}
//export const backendUrl = "http://localhost:5000/";
export const backendUrl="https://imgram-backend.fly.dev/"

export const NotificationBody = (notification: TNotification) => {
  switch (notification.type) {
    case "like":
      return `${notification.like?.liker.name} liked one of your posts.`;
    case "comment":
      return `${notification.comment?.commenter.name} left a comment on one of your posts.`;
    case "follow":
      return `${notification.followRequest?.follower.name} has sent you a follow request.`;
    case "accept_follow":
      return `${notification.followRequest?.followed.name} has accepted your follow request.`;
    default:
      return "Unknown notification action.";
  }
};
export const notificationAvatarsrc = (notification: TNotification) => {
  switch (notification.type) {
    case "like":
      return `${notification.like?.liker.userImage}`;
    case "comment":
      return `${notification.comment?.commenter.userImage}`;
    case "follow":
      return `${notification.followRequest?.follower.userImage}`;
    case "accept_follow":
      return `${notification.followRequest?.followed.userImage}`;
  }
};

export const notificationAvatarFallBack = (notification: TNotification) => {
  switch (notification.type) {
    case "like":
      return `${notification.like?.liker.name.substring(0, 2)} `;
    case "comment":
      return `${notification.comment?.commenter.name.substring(0, 2)}`;
    case "follow":
      return `${notification.followRequest?.follower.name.substring(0, 2)} `;
    case "accept_follow":
      return `${notification.followRequest?.followed.name.substring(0, 2)}`;
  }
};
export const NotificationLink = (notification: TNotification) => {
  switch (notification.type) {
    case "like":
      return `/posts/${notification.like?.liked_postId}`;
    case "comment":
      return `/posts/${notification.comment?.commented_postId}`;
    case "follow":
      return `/profiles/${notification.followRequest?.followed.id}`;
    case "accept_follow":
      return `/profiles/${notification.followRequest?.followed.id}`;
    default:
      return "";
  }
};

export function calculateTimeElapsed(createdAt: Date) {
  const currentTime = new Date();
  const notificationTime = new Date(createdAt);
  const elapsedMilliseconds =
    currentTime.getTime() - notificationTime.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

  if (elapsedSeconds < 60) {
    return "just now";
  } else if (elapsedSeconds < 3600) {
    const minutes = Math.floor(elapsedSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (elapsedSeconds < 86400) {
    const hours = Math.floor(elapsedSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(elapsedSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}


//-------------LIKES OPTIMISTIC UPDATES FUNCTION
export function addLikerToPost(
  data: infiniteQueryData<IPost>,
  postId: number,
  likerId: number
) {
  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked_posts: [...post.liked_posts, { likerId }],
            }
          : post
      )
    ),
  };
  return newData;
}

export function removeLikerFromPost(
  data: infiniteQueryData<IPost>,
  postId: number,
  likerId: number
) {
  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked_posts: post.liked_posts.filter(
                (liker) => liker.likerId !== likerId
              ),
            }
          : post
      )
    ),
  };
  return newData;
}


export function addLikerToExplorePost(
  data: infiniteQueryData<TExplorePost>,
  postId: number,
  likerId: number
) {

  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked_posts: [...post.liked_posts, { likerId }],
            }
          : post
      )
    ),
  };
  return newData;
}

export function removeLikerFromExplorePost(
  data: infiniteQueryData<TExplorePost>,
  postId: number,
  likerId: number
) {
 
  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked_posts: post.liked_posts.filter(
                (liker) => liker.likerId !== likerId
              ),
            }
          : post
      )
    ),
  };
  return newData;
}



export function addLikerToOnePost(post: TPostDetails, likerId: number): TPostDetails {

  return {
    ...post,
    liked_posts: [...post.liked_posts, { likerId }],
  };
}


export function removeLikerFromOnePost(post: TPostDetails, likerId: number): TPostDetails {

  return {
    ...post,
    liked_posts: post.liked_posts.filter(liker => liker.likerId !== likerId),
  };
}




//-------------Shares OPTIMISTIC UPDATES FUNCTION

export function addSharerToPost(
  data: infiniteQueryData<IPost>,
  postId: number,
  sharerId: number
) {
  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              shared_posts: [...post.shared_posts, { sharerId }],
            }
          : post
      )
    ),
  };
  return newData;
}

export function removeSharerFromPost(
  data: infiniteQueryData<IPost>,
  postId: number,
  sharerId: number
) {
  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              shared_posts: post.shared_posts.filter(
                (sharer) => sharer.sharerId !== sharerId
              ),
            }
          : post
      )
    ),
  };
  return newData;
}


export function addSharerToExplorePost(
  data: infiniteQueryData<TExplorePost>,
  postId: number,
  sharerId: number
) {

  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              shared_posts: [...post.shared_posts, { sharerId }],
            }
          : post
      )
    ),
  };
  return newData;
}

export function removeSharerFromExplorePost(
  data: infiniteQueryData<TExplorePost>,
  postId: number,
  sharerId: number
) {
 
  const newData = {
    ...data,
    pages: data.pages.map((page) =>
      page.map((post) =>
        post.id === postId
          ? {
              ...post,
              shared_posts: post.shared_posts.filter(
                (sharer) => sharer.sharerId !== sharerId
              ),
            }
          : post
      )
    ),
  };
  return newData;
}



export function addSharerToOnePost(post: TPostDetails, sharerId: number): TPostDetails {

  return {
    ...post,
    shared_posts: [...post.shared_posts, { sharerId }],
  };
}


export function removeSharerFromOnePost(post: TPostDetails, sharerId: number): TPostDetails {

  return {
    ...post,
    shared_posts: post.shared_posts.filter(sharer => sharer.sharerId !== sharerId),
  };
}



