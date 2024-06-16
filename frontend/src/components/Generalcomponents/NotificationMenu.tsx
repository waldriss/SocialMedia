"use client";
import { useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import Notification from "./Notification";
import { TNotification } from "@/lib/types/Notification";
import { useGetNotifications } from "@/lib/react-query/queries";
import {
  calculateTimeElapsed,

  notificationAvatarsrc,
  NotificationBody,
  NotificationLink,
} from "@/lib/utils";
import { generateUniqueId, socket } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import profilesvg from "@public/svgs/profile.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { useSeeNotification } from "@/lib/react-query/mutations";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

const NotificationMenu = ({
  InitialNotifications,
  userId,
 
}: {
  InitialNotifications?: TNotification[];
  userId: string;

}) => {
  
 
  const queryClient = useQueryClient();
  const router = useRouter();
  const { getToken } = useAuth();
  const { mutate: seeNotification } = useSeeNotification(getToken);

  const { data, hasNextPage, fetchNextPage,refetch } = useGetNotifications(
    userId,
    InitialNotifications,
    getToken
  );
  if(!InitialNotifications) {refetch();}
  const notifications: TNotification[] = data?[].concat(...data.pages):[];
 
  
  const notificationsRef=useRef(notifications);
  notificationsRef.current=notifications;

  useEffect(() => {
    
    socket.on(
      "notification",
      ({ notification }: { notification: TNotification }) => {
        
        let updatedNotification = notification;
        if (notificationsRef.current[0]?.NbUnseenNotifications) {
          updatedNotification.NbUnseenNotifications =
          notificationsRef.current[0].NbUnseenNotifications + 1;
        }

        const realTimeNotifications = notificationsRef.current;
        if (realTimeNotifications[0].id !== notification.id) {
          realTimeNotifications.unshift(updatedNotification);
          realTimeNotifications.pop();
        }

        queryClient.setQueriesData(
          { queryKey: [QUERY_KEYS.GET_NOTIFICATIONS,userId] },
          (data: any) => {
            return {
              pages: realTimeNotifications,
              pageParams: [1],
            };
          }
        );
        
        const id = generateUniqueId();
        toast(toastContent(id, updatedNotification), {
          position: "bottom-center",
          id: id,
        });
      }
    );

    socket.on("refesh_notifications", async() => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_NOTIFICATIONS,userId],
      });

    });
  }, []);
  useEffect(() => {
    socket.emit("login", { userId: userId });
  }, [userId]);
  /*useEffect(() => {
    queryClient.setQueriesData(
      { queryKey: [QUERY_KEYS.GET_NOTIFICATIONS,userId] },
      (data: any) => {
        return {
          pages: InitialNotifications,
          pageParams: [1],
        };
      }
    );
  }, [InitialNotifications]);*/

  const handleLink = (notification: TNotification) => {
    if (notification.state === "unseen") {
      seeNotification({
        notificationId: notification.id,
        userId:userId
      });
    }

    router.push(NotificationLink(notification));
  };
  useEffect(()=>{
    notificationsRef.current=notifications;
  },[notifications])
  

  const toastContent = (id: string, notification: TNotification) => (
    <div className="w-full">
      <h4 className="-mt-1 font-sans font-semibold text-whiteShade text-base ">
        Notification
      </h4>
      <div className="pt-2  font-sans-serif2 flex items-center justify-between w-full">
        <div
          onClick={() => handleLink(notification)}
          className="flex items-center space-x-2 relative w-full   cursor-pointer "
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={notificationAvatarsrc(notification)} />
            <AvatarFallback>
            <Image alt=''  className='w-full h-full p-1 bg-borderPrimary' src={profilesvg.src} height={100} width={100}/>
            </AvatarFallback>
          </Avatar>

          <div className="w-full ">
            <p className="text-sm  text-whiteShade leading-none">
              {NotificationBody(notification)}
            </p>

            <p className="text-[0.95rem] pt-1 text-muted-foreground">
              {calculateTimeElapsed(notification.createdAt)}
            </p>
          </div>
        </div>
        <Button
          onClick={() => toast.dismiss(id)}
          size={"sm"}
        >
          Undo
        </Button>
      </div>
    </div>
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          className="relative w-[70%] bg-secondary hover:bg-[#2e3142]"
        >
          <Bell className="w-5 h-5" />
          {!(notifications[0]?.NbUnseenNotifications===0||notifications[0]?.NbUnseenNotifications===undefined) &&<span className="absolute text-[12px] -bottom-2 -right-2 bg-primary rounded-full flex justify-center items-center h-5 w-5">
            {notifications[0]?.NbUnseenNotifications}
          </span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 w-96 min-h-72 max-h-[440px] border-2 border-[#1e1e29] overflow-y-auto  text-whiteShade   customScrollBar_dark bg-gradient-to-t from-backgroundgrad1 to-backgroundgrad2 ">
        <div className="w-full">
          <div className="px-4 flex items-center justify-between ">
            <h4 className="font-sans  font-semibold text-lg leading-none">
              Notifications
            </h4>
            <p className="text-sm  font-sans-serif2 text-muted-foreground">
              {notifications[0]?.NbUnseenNotifications!=0&&notifications[0]?.NbUnseenNotifications} {!(notifications[0]?.NbUnseenNotifications===0||notifications[0]?.NbUnseenNotifications===undefined) &&'unseen'}  
            </p>
          </div>

          <div className="w-full flex flex-col font-sans-serif2 items-center pt-4 ">
            <Separator className="bg-[#1d1f2a] w-full h-[0.5px]" />
            {notifications.map((notification) => (
              <Notification
              userId={userId}
                key={notification.id}
                notification={notification}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
               
              />
            ))}
          </div>
        </div>
        {hasNextPage && (
          <div className="w-full font-sans  text-center pt-4">
            <Button
              onClick={() => fetchNextPage()}
              size={"lg"}
              className=" bg-secondary w-[90%]"
            >
              View More
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationMenu;
