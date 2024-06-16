import { Request } from "express";

export interface getNotificationsRequest extends Request {
    query: {
      page?: string;
      userId:string
    };
  }



  export interface SeeNotificationRequest extends Request {
    body: {
      notificationId: string;
      userId:string;
      
      
    };
  }

  