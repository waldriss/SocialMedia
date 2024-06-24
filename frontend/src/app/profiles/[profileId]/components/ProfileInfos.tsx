import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const ProfileInfos = ({
  name,
  userName,
  isEdit,
  form,
  bio,
  isUpdatingUser
}: {
  name: string;
  userName: string;
  isEdit: boolean;
  form?: any;
  bio?:string;
  isUpdatingUser?:boolean;
}) => {
  return !isEdit ? (
    <section className="pl-4 sm:pl-[52px] pt-2 pr-12">
      <p className="text-2xl sm:text-3xl font-semibold font-sans-serif2 leading-none pb-1 text-whiteShade">
        {name}
      </p>
      <p className="text-base text-muted-foreground font-sans-serif2  ">@{userName}</p>

      <p className="pt-4 font-sans-serif2 text-whiteShade break-words">
        {bio}
        
      </p>
    </section>
  ) : (
    <>
    <LoadingSvg  className={`${isUpdatingUser?'block':'hidden'} mt-4 h-20 w-20`} />
    <section className={`${isUpdatingUser?'hidden':'block'} font-sans pl-4 pr-2 sm:pl-[52px] pt-2 sm:pr-12`}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormControl>
              <Input
                className="text-2xl sm:text-3xl font-semibold  leading-none  rounded-lg bg-transparent border-[#2e3142] text-whiteShade h-14"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormControl>
              <Input
                className="text-base rounded-lg bg-transparent border-[#2e3142] text-whiteShade"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="font-sans-serif2">
            <FormControl>
              <Textarea
                className="rounded-lg bg-transparent border-[#2e3142] text-whiteShade"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </section>
    </>
  );
};

export default ProfileInfos;
