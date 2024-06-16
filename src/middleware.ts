import { authMiddleware } from "@clerk/nextjs";

 
export default authMiddleware({
    publicRoutes: ["/auth","/ssocallback","/googleAuthLoader"],
  });

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  };