import { backendUrl } from "../utils";

export const getServerSideHomePosts = async (userId: string,token:string|null) => {
  try {
    
    
    
    const postsResponse = await fetch(`${backendUrl}homePosts/${userId}`,{
      cache:"default",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const postsData = await postsResponse.json();

    return postsData.posts;
  } catch (error) {
    console.log(error);
  }
};


export const getServerSideTopUsers = async (userId: string,token:string|null) => {
  try {
    
    const usersResponse = await fetch(`${backendUrl}users/${userId}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const usersData = await usersResponse.json();

    return usersData.users;
  } catch (error) {
    console.log(error);
  }
};


export const getServerSideExplorePosts = async (search:string="",token:string|null,userId:string) => {
  try {
   
    
    const postsResponse = await fetch(`${backendUrl}explorePosts?search=${search}&userId=${userId}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const postsData = await postsResponse.json();

    return postsData.posts;
  } catch (error) {
    console.log(error);
  }
};
export const getServerSideExploreUsers = async ( search: string,token:string|null,userId:string) => {
  try {
    const usersResponse = await fetch(`${backendUrl}exploreUsers?search=${search}&userId=${userId}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    })
    const usersData = await usersResponse.json();

    return usersData.users;
  } catch (error) {
    console.log(error);
  }
};

export const getServerSidePostDetails = async (postId: string,token:string|null) => {
  try {
    const postResponse = await fetch(`${backendUrl}getPost/${postId}`, {
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const postData = await postResponse.json();

    return postData.post[0];
  } catch (error) {
    console.log(error);
  }
};

export const getServerSideUser = async (userId: string,token:string|null) => {
  try {
    const userResponse = await fetch(`${backendUrl}user/${userId}`, {
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const userData = await userResponse.json();
    if (userResponse.ok) {
      

      return userData.user;
    } else {
      throw new Error(userData.message);
    }
  } catch (error) {
    console.log(error);
  }
};


export const getServerSideAuth = async (userId: string,token:string|null) => {
  try {
    const userResponse = await fetch(`${backendUrl}authenticatedUser/${userId}`, {
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const userData = await userResponse.json();
    if (userResponse.ok) {
      

      return userData.user;
    } else {
      throw new Error(userData.message);
    }
  } catch (error) {
    console.log(error);
  }
};


export const getServerSideNotifications = async (userId: string,token:string|null) => {
  try {
    const notificationsResponse = await fetch(`${backendUrl}getNotifications?userId=${userId}`, {
      cache: "default",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      }
    });
    const notificationsData = await notificationsResponse.json();
    
    if(notificationsData.notifications[0]){
      notificationsData.notifications[0].NbUnseenNotifications=notificationsData.NbUnseenNotifications;
    }

    return notificationsData.notifications;
  } catch (error) {
    console.log(error);
  }
};