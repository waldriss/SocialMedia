import { GetToken } from "../types/global";
import { backendUrl } from "../utils";

export const getNotifications = async (userId: string, page: number,getToken: GetToken) => {
    try {
      const token= await getToken();
      
     
      const notificationsResponse = await fetch(
        `${backendUrl}getNotifications?userId=${userId}&page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if(!notificationsResponse.ok) return [];
      let notificationsData = await notificationsResponse.json();
      
  
      if(notificationsData.notifications[0]){

        notificationsData.notifications[0].NbUnseenNotifications=notificationsData.NbUnseenNotifications;
      }
      
      

      return notificationsData.notifications;
    } catch (error) {
      console.log(error);
    }
  };





  export const seeNotification = async (notificationId: number,userId:string,getToken: GetToken) => {
    try {
        const token=await getToken();
      const response = await fetch(`${backendUrl}seeNotification`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          mode: 'cors',
        },
        body: JSON.stringify({ notificationId,userId}),
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
  