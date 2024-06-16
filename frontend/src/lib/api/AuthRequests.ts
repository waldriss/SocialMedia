import { UserToRegister } from "../types/user";
import { backendUrl } from "../utils";

export const registerUserInDB = async (
 { email,
  username,
  name,
  password
}:UserToRegister
) => {
  try {
  
    const res = await fetch(`${backendUrl}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, name,password }),
    });


    if (!res.ok) {
      const error=await res.json();
      
      throw new Error(error.message);
    }
    else{
        return res.json();
    }
  } catch (error) {
    console.log(error);
    
    throw error
  }
};


export const SigInOrSignUpGoogleInDB = async (
  email: string,
  name: string,
  userId:string,
) => {
  try {
    const res = await fetch(`${backendUrl}SigInOrSignUpGoogle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name,userId }),
    });

    if (!res.ok) {
      const error=await res.json();
      
      throw new Error(error.message);
    }
    else{
        return res.json();
    }
  } catch (error) {
    
    throw error
  }
};



export const SignInUserInDB = async (
  email: string,
  username: string,
  name: string
) => {
  try {
    const res = await fetch(`${backendUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, name }),
    });

    if (!res.ok) {
      throw new Error("Error signing in user in db:");
    }
  } catch (error) {
    console.error("Error signing in user in db:", error);
  }
};
