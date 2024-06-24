import { UserAuthForm } from "./components/UserAuthForm";
import imagelogin from "@public/images/bglogin.webp";
import { Aperture } from "lucide-react";
import Image from "next/image";

const AuthPage = () => {
  return (
    <>
      <div className="container relative  min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div
            className="absolute inset-0 bg-center bg-cover bg-bgShade1 "
           
          />
          <div className="h-full w-full top-0 left-0 absolute">
            <Image src={imagelogin.src} height={1000} width={1500} quality={100}  alt=""  className="h-full w-full object-cover object-center" />
          </div>
          
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div  className={` w-full flex items-center gap-x-2`}>
              <Aperture className="h-10 w-10 text-primary stroke-[1.5px]" />
              <h2 className="text-[1.6rem] font-sans tracking-wider font-normal text-primary">
                {" "}
                Imgram{" "}
              </h2>
            </div>
          </div>
          <div className="relative z-20 mt-auto"></div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
