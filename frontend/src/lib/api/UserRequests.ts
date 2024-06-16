import { GetToken } from "../types/global";
import { UpdatedUser } from "../types/user";
import { backendUrl } from "../utils";





export const updateUser = async (updatedUser: UpdatedUser,id:number,getToken: GetToken) => {
  try {  const token= await getToken()
    const formData = new FormData();
    if(updatedUser.file)  formData.append("file", updatedUser.file[0]);
    if(updatedUser.bio)  formData.append("bio", updatedUser.bio);
     formData.append("name", updatedUser.name);
     formData.append("username", updatedUser.username);

    

    const response = await fetch(`${backendUrl}user/${id}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
    });

    const responseData = await response.json();
    

    if (!response.ok) {
      throw new Error(responseData.message); // Error message from the backend
    }

    return responseData;
  } catch (error) {
    throw error
  }
};


export const getUser = async (userId: string,getToken: GetToken) => {
  try {
    const token= await getToken()
    const userResponse = await fetch(`${backendUrl}user/${userId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
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

export const getAuth = async (userId: string|undefined|null,getToken:GetToken) => {
  try {
    
    const token=await getToken();
 
    
    const userResponse = await fetch(`${backendUrl}authenticatedUser/${userId}`, {
      cache: "default",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
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
export const getTopUsers = async (userId: string,getToken: GetToken,) => {
  try {
    const token=await getToken();
    const usersResponse = await fetch(`${backendUrl}users/${userId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
    })
    const usersData = await usersResponse.json();

    return usersData.users;
  } catch (error) {
    console.log(error);
  }
};



export const getExploreUsers = async (page: number, search: string,getToken: GetToken,userId?:string) => {
  try {
    const token=await getToken();
    const usersResponse = await fetch(`${backendUrl}exploreUsers?page=${page}&search=${search}&userId=${userId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
    })
    const usersData = await usersResponse.json();

    return usersData.users;
  } catch (error) {
    console.log(error);
  }
};





export const follow = async (followerId: number, followedId: number,getToken: GetToken) => {
  try {
    const token= await getToken()
    const response = await fetch(`${backendUrl}follow`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
      body: JSON.stringify({ followerId: followerId, followedId: followedId }),
      
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

export const acceptFollow = async (followerId: number, followedId: number,getToken: GetToken) => {
  try {
    const token= await getToken()
    const response = await fetch(`${backendUrl}acceptfollow`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
      body: JSON.stringify({ followerId: followerId, followedId: followedId }),
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

export const deleteFollow = async (followerId: number, followedId: number,getToken: GetToken) => {
  try {
    const token= await getToken()
    const response = await fetch(`${backendUrl}deletefollow`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors',
      },
      body: JSON.stringify({ followerId: followerId, followedId: followedId }),
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