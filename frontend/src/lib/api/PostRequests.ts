import { NewPost, UpdatedPost } from "../types/PostRequestsTypes";
import { backendUrl } from "../utils";
import { GetToken } from "../types/global";

export const createPost = async (
  newPost: NewPost,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", newPost.file[0]);
    formData.append("caption", newPost.caption);
    formData.append("location", newPost.location);
    formData.append("tags", newPost.tags);
    formData.append("userId", newPost.userId.toString());

    const response = await fetch(`${backendUrl}createpost`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const updatePost = async (
  updatedPost: UpdatedPost,
  postId: number | undefined,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const formData = new FormData();
    if (updatedPost.file) formData.append("file", updatedPost.file[0]);
    formData.append("caption", updatedPost.caption);
    formData.append("location", updatedPost.location);
    formData.append("tags", updatedPost.tags);
    formData.append("userId", updatedPost.userId.toString());

    const response = await fetch(`${backendUrl}updatepost/${postId}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getHomePosts = async (
  userId: string,
  page: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();

    const postsResponse = await fetch(
      `${backendUrl}homePosts/${userId}?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!postsResponse.ok) {
      
      return [];
    }
    const postsData = await postsResponse.json();

    return postsData?.posts ? postsData.posts : [];
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (
  postId: string,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const postResponse = await fetch(`${backendUrl}getPost/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });
    
    const postData = await postResponse.json();
    if (!postResponse.ok) {
      throw new Error(postData.message); // Error message from the backend
    }

    return postData.post[0];
  } catch (error) {
    console.log(error);
  }
};
export const getExplorePosts = async (
  page: number,
  search: string,
  getToken:any,
  userId?: string
) => {
  try {
   
    const token = await getToken();
  
    const postsResponse = await fetch(
      `${backendUrl}explorePosts?page=${page}&search=${search}&userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          mode: "cors",
        },
      }
    );
    
    
    if (!postsResponse.ok) {
      
      return [];
    }
    const postsData = await postsResponse.json();

    return postsData?.posts ? postsData.posts : [];
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (
  postId: number,
  userId: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();

    const response = await fetch(`${backendUrl}likepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ postId: postId, userId: userId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const dislikePost = async (
  postId: number,
  userId: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const response = await fetch(`${backendUrl}dislikepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ postId: postId, userId: userId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.log(error);
    console.error("Error:", error);
  }
};

export const sharePost = async (
  postId: number,
  userId: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();

    const response = await fetch(`${backendUrl}sharepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ postId: postId, userId: userId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const unsharePost = async (
  postId: number,
  userId: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const response = await fetch(`${backendUrl}unsharepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ postId: postId, userId: userId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const commentPost = async (
  postId: number,
  userId: number,
  body: string,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const response = await fetch(`${backendUrl}commentpost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ postId: postId, userId: userId, body: body }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteComment = async (
  commentId: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const response = await fetch(`${backendUrl}deletecomment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ commentId: commentId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deletePost = async (
  postId: number,
  getToken: GetToken
) => {
  try {
    const token = await getToken();
    const response = await fetch(`${backendUrl}deletePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ postId: postId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};
