
import { Plus } from "lucide-react";
import { Image as ImgIcon, Home, Send } from "lucide-react";
import Link from "next/link";
import { UseAuthenticatedUser } from "@/lib/store/store";
import { usePathname } from "next/navigation";
import Image from "next/image";
import profilesvg from "@public/svgs/profile.svg";
const BottomNav = () => {
  const {authenticatedUser,setauthenticatedUser}=UseAuthenticatedUser();
  const pathname = usePathname();

  return (
    <div className=" md:hidden bottom-6 flex items-center  justify-center w-full h-20 bg-transparent fixed z-10">
      <div className=" relative w-[90%] sm:w-4/5 glassBottomNav h-[70px] sm:h-20 rounded-xl">
        <div className="pointer-events-none absolute h-24 flex items-center justify-center w-full top-0 -translate-y-1/2 ">
          <div className=" pointer-events-auto  z-[11] flex justify-center items-center luminousShadow bg-primary w-14 h-14 sm:w-16 sm:h-16  mx-auto   rotate-45 rounded-lg absolute cursor-pointer">
            <Link href={"/postDetails"}>
              <Plus className="text-whiteShade w-12 h-12 sm:h-14 sm:w-14 stroke-1 -rotate-45" />
            </Link>
          </div>
        </div>

        <div className="w-full h-full flex items-center  justify-between">
          <div className="flex w-1/2 justify-evenly pr-5 sm:pr-6">
            <Link href={"/"}>
              <Home className={` h-8 w-8 sm:h-9 sm:w-9 ${pathname==="/"?'text-primary textLuminousShadow':"text-whiteShade"} stroke-[1.5]`} />
            </Link>
            <Link href={"/posts"}>
              <ImgIcon className={` h-8 w-8 sm:h-9 sm:w-9 ${pathname==="/posts"?'text-primary textLuminousShadow':"text-whiteShade"} stroke-[1.5]`} />
            </Link>
          </div>
          <div className="flex w-1/2 justify-evenly pl-5 sm:pl-6">
            <Link href={"/"}>
              <Send className={` h-8 w-8 sm:h-9 sm:w-9 ${pathname==="/messages"?'text-primary textLuminousShadow':"text-whiteShade"} stroke-[1.5]`} />
            </Link>

            <Link href={"/profiles/"+authenticatedUser?.id}>
              <Image height={32} width={32} src={authenticatedUser?.userImage||profilesvg.src} alt="" className={`${!authenticatedUser?.userImage&&'p-1'} rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-secondary`}/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
