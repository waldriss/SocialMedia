import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";
import { SigInOrSignUpGoogleInDB } from "@/lib/api/AuthRequests";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const page = async () => {

  const user = await currentUser();

  if (user) {
    try {
      const resp = await SigInOrSignUpGoogleInDB(user.emailAddresses[0].emailAddress,`${user.firstName} ${user.lastName}`,user.id);
      
    } catch (error) {
      console.log(error);
    }
    finally{
      redirect("/");
    }
  } else {
  }

  return (
    <div className="h-screen">
      <LoadingSvg className="mt-32 h-40 w-40" />
    </div>
  );
};

export default page;
