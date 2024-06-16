"use client";
import * as React from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Generalcomponents/icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl, FormField,
  FormItem, FormMessage
} from "@/components/ui/form";
import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateUniqueId } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "please enter email.",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});
const SigninForm = ({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: any;
}) => {
  const router = useRouter();

  const { signOut } = useClerk();

  const { signIn, setActive } = useSignIn();
  const {user}=useUser();
  const pathname=usePathname();
 React.useEffect(()=>{if(user){  router.push("/");}},[user])
 const queryClient=useQueryClient();
  const toastContent = (message: string, id: string) => (
    <div className="w-full">
      <h4 className="font-sans font-semibold text-whiteShade text-base ">
        Authentification
      </h4>
      <div className="font-sans-serif2 flex items-center justify-between w-full">
        <p className="text-muted-foreground text-[0.95rem]">{message}</p>
        <Button
          className="font-sans"
          onClick={() => toast.dismiss(id)}
          size={"sm"}
        >
          Undo
        </Button>
      </div>
    </div>
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const signedin = await signIn?.create({
        identifier: values.email,
        password: values.password,
      });
      if (signedin) {
        if (setActive) {
          await setActive({ session: signedin.createdSessionId });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_USER,user?.externalId]
          });
          
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_AUTHENTICATED_USER,user?.externalId]
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_NOTIFICATIONS,,user?.externalId],
          });
          router.push("/");
        }
      }
    } catch (e: any) {
      setIsLoading(false);
      const id = generateUniqueId();
      if (e.errors[0].message === "Couldn't find your account.") {
        toast(
          toastContent(
            "the email or password you entered is incorrect. Please try again.",
            id
          ),
          { position: "bottom-center", id: id }
        );
      } else {
        toast(toastContent("Error logging in. Please try again.", id), {
          position: "bottom-center",
          id: id,
        });
      }
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handeSubmitGoogle=async()=>{
    const signedIn=await signIn?.authenticateWithRedirect({redirectUrl:"/ssocallback",strategy:"oauth_google",redirectUrlComplete:"/googleAuthLoader"})
  }
  return (
    <div className={`${isLoading ? "hidden" : "grid"} font-sans-serif2  gap-6`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-transparent text-whiteShade"
                        placeholder="Email"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-3 mb-6">
                    <FormControl>
                      <Input
                        className=" bg-transparent text-whiteShade "
                        placeholder="Password"
                        type="password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="font-sans" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        
        <div className="relative flex justify-center items-center text-xs uppercase">
          <Separator className="flex-grow !w-auto bg-whiteShade " />
          <span className=" whitespace-nowrap px-2 text-muted-foreground">
            Or continue with
          </span>
          <Separator className="flex-grow !w-auto bg-whiteShade " />
        </div>
      </div>
      <Button
        className="text-whiteShade font-sans bg-[transparent]"
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handeSubmitGoogle}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
};

export default SigninForm;
