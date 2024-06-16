import React from "react";

import ProfileStats from "./components/ProfileStats";
import ProfileInfos from "./components/ProfileInfos";
import ProfilePosts from "./components/ProfilePosts";
import ProfileHeader from "./components/ProfileHeader";
import { getServerSideUser } from "@/lib/api/serverSideRequests";
import { TUser } from "@/lib/types/user";
import ProfileContainer from "./components/ProfileContainer";
import { auth } from "@clerk/nextjs";

const ProfilePage = async({params:{profileId}}:{params:{profileId:string}}) => {
  const {getToken}=auth()
  const token=await getToken()

  const user:TUser=await getServerSideUser(profileId,token);
  

  return (
   <ProfileContainer  userId={profileId} user={user}/>
  );
};

export default ProfilePage;
