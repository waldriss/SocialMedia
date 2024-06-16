import {
  getServerSideAuth,
  getServerSideNotifications,
} from "@/lib/api/serverSideRequests";
import { TNotification } from "@/lib/types/Notification";
import { auth } from "@clerk/nextjs";
import { cookies } from "next/headers";
import React from "react";
import Resizable from "./Resizable";
import { AuthenticatedUser } from "@/lib/types/user";

const ResizableProvider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  
 
  let notifications: TNotification[] = [];
  let dbUser:AuthenticatedUser|undefined = undefined;
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = false;

  const {getToken,sessionClaims}=auth()
const token=await getToken();

  if (sessionClaims?.userId) {
    const [notificationsResponse, dbUserResponse] = await Promise.all([
      getServerSideNotifications(sessionClaims.userId,token),
      getServerSideAuth(sessionClaims.userId,token),
     
    ]);
    notifications = notificationsResponse;

    dbUser = dbUserResponse;
   
   
    
  }

  
      


  return (
    <Resizable
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
      notifications={notifications}
      authenticatedUser={dbUser}
      token={token}
    >
      {children}
    </Resizable>
  );
};

export default ResizableProvider;
