"use client";
import { HomeIcon, Users } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { UseAnimateHomeHeader } from "@/lib/store/store";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { infiniteQueryData, IPost } from "@/lib/types/Post";

const HomeHeader = ({userId}:{userId:string}) => {
  const { isAnimateHomeHeader, setisAnimateHomeHeader } =
    UseAnimateHomeHeader();
  const layoutDuration = {
    layout: { duration: 0.3 },
  };

  const MotionHomeIcon = motion(HomeIcon);
  const pathname=usePathname();
 useEffect(()=>setisAnimateHomeHeader(false),[pathname])

const queryClient=useQueryClient()
const refresh=()=>{
  
  const scrollablediv=document.getElementById("scrollablediv");
  if(scrollablediv) scrollablediv.scrollTop=0;
  
  queryClient.setQueriesData(
    { queryKey: [QUERY_KEYS.GET_HOME_POSTS,userId] },
    (data:undefined|infiniteQueryData<IPost>) => {
      console.log(data?.pages[1]);
      return {
        pages:data?.pages?data.pages.slice(0, 1):[],
        pageParams:data?.pageParams?data.pageParams.slice(0, 1):[],
      };
    }
  );
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_HOME_POSTS, userId],
  });


}

  return (
    <>
      <motion.div
  
        layout
        transition={layoutDuration}
        className="relative md:min-w-full lg:min-w-[73%] lg:w-[73%] xl:min-w-[70%] xl:w-[70%] flex justify-center items-center"
      >
        <motion.div
          layout
          className={`${
            isAnimateHomeHeader ? "border-2 border-primary h-[70px] glassHome mt-2 lg:-mt-5 " : " border-borderPrimary border h-20 mt-8 "
          }  bg-[#171821]    rounded-2xl md:w-[92%] lg:w-[90%]     flex justify-center items-center relative`}
        >
          <motion.div onClick={refresh} className="rounded-full relative hover:bg-primary hover:text-whiteShade hover:border-primary transition-colors duration-300 cursor-pointer bg-[#1b1c27] border-[#15161e] border-1 p-3 text-primary ">
            <MotionHomeIcon className="relative h-7 w-7" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        layout
        className={`hidden lg:block flex-1  relative ${isAnimateHomeHeader ? "" : ""}`}
      >
        <div
          className={` h-20 bg-[#171821]  mt-8 rounded-2xl w-[90%] mx-auto border  border-borderPrimary flex justify-center items-center`}
        >
          <div className="rounded-full bg-[#1b1c27] border-[#15161e] border-1 p-3 text-primary ">
            <Users className="h-7 w-7" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HomeHeader;
