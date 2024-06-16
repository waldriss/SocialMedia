"use client";
import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileInfos from "./ProfileInfos";
import ProfilePosts from "./ProfilePosts";
import { TUser } from "@/lib/types/user";
import UserForm from "./UserForm";
import { useAuth, useUser } from "@clerk/nextjs";
import { useGetUser } from "@/lib/react-query/queries";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

const ProfileContainer = ({ user,userId}: { user: TUser,userId:string }) => {
  const { getToken } = useAuth();

  const {data:userData}=useGetUser(userId,user,getToken) as {data:TUser}
  const [isEdit, setisEdit] = useState(false);
  const { isLoaded, isSignedIn, user:AuthenticatedUser } = useUser();
  const queryClient = useQueryClient()
  /*useEffect(()=>{
      
    queryClient.setQueryData([QUERY_KEYS.GET_USER,userId],user );
  },[user])*/

const isProfileOfAuth=AuthenticatedUser?.externalId?AuthenticatedUser.externalId==userData.id.toString():undefined


  return (
    <article className="pb-14 bggradient">
      {(!isEdit||!isProfileOfAuth) ? (
        <>
          <ProfileHeader
            followedBy={userData.followedBy}
            profileId={userData.id}
            isProfileOfAuth={isProfileOfAuth}
            isEdit={isEdit}
            setisEdit={setisEdit}
            userImage={userData?.userImage}
            AuthId={AuthenticatedUser?.externalId}
          />
          <ProfileStats isProfileOfAuth={isProfileOfAuth} postsNb={userData.posts.length}  profileId={userData.id} followers={userData.followedBy} following={userData.following} />
          <ProfileInfos
            isEdit={isEdit}
            name={userData.name}
            userName={userData.username}
            bio={userData.bio}
          />
        </>
      ) : (
        <UserForm  isAuth={isProfileOfAuth} user={userData} isEdit={isEdit} setisEdit={setisEdit} followers={userData.followedBy} following={userData.following} />
      )}

      <ProfilePosts userPosts={userData.posts} userSharedPosts={user.shares.map((share)=>share.shared_post)} />
    </article>
  );
};

export default ProfileContainer;
