import NotificationMenu from "./NotificationMenu";
import { TNotification } from "@/lib/types/Notification";
import { Button } from "../ui/button";
import { Aperture, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { UseAuthenticatedUser } from "@/lib/store/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const TopNav = ({
  notifications,
}: {
  notifications: TNotification[];
}) => {
  const pathname=usePathname()
  const { authenticatedUser, setauthenticatedUser } = UseAuthenticatedUser();
  const router=useRouter()
  const { signOut } = useClerk();
  const logout = () => {
    signOut();
    setauthenticatedUser(undefined);
    router.push("/auth");
  };

  return (
    <div className={` md:hidden z-10 flex items-center justify-between pr-6 sm:pr-10 absolute w-full bg-bgShade1 border-b-1 border-borderPrimary h-20`}>
      <Link href={"/"} className={`px-4 w-full flex gap-x-2`}>
        <Aperture className="h-10 w-10 text-primary stroke-[1.5px]" />
        <h2 className="text-[1.6rem] font-sans-serif2 font-semibold text-primary">
          {" "}
          Imgram{" "}
        </h2>
      </Link>
      <div className="flex items-center gap-x-8">
        {authenticatedUser && (
          <NotificationMenu
            
            InitialNotifications={
              notifications.length == 0 ? undefined : notifications
            }
            userId={authenticatedUser.id.toString()}
          />
        )}

        <Button
          onClick={logout}
          size={"sm"}
          className="  bg-secondary px-5 hover:bg-[#2e3142] "
        >
          <LogOut className="h-5 w-5" />
          <span className="font-sans ml-2 hidden sm:inline">Log out</span>
        </Button>
      </div>
    </div>
  );
};
