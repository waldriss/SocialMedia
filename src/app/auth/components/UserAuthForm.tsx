"use client";

import Link from "next/link";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import { useState } from "react";
import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";
export function UserAuthForm() {
  const [signIn, setsignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <LoadingSvg className={`${!isLoading&&'hidden'}`} />

      <div className={`${isLoading?'hidden':'flex'} flex-col space-y-2 text-center`}>
        <h1 className="text-2xl font-semibold font-sans tracking-tight text-whiteShade">
          {signIn ? "Sign in with your account" : "Create an account"}
        </h1>
        <p className="font-sans-serif2 text-sm text-muted-foreground">
          {signIn
            ? "Enter your email and password to sign in"
            : "Enter your details to sign up"}
        </p>
      </div>
      {signIn ? (
        <SigninForm isLoading={isLoading} setIsLoading={setIsLoading} />
      ) : (
        <SignupForm setsignIn={setsignIn} isLoading={isLoading} setIsLoading={setIsLoading} />
      )}
      { !isLoading&&(signIn ? (
        <p className="px-8 font-sans-serif2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="#"
            className="font-sans underline underline-offset-4 hover:text-primary"
            onClick={() => setsignIn((prev) => !prev)}
          >
            Sign Up
          </Link>{" "}
          .
        </p>
      ) : (
        <p className="px-8 font-sans-serif2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="#"
            className="underline font-sans underline-offset-4 hover:text-primary"
            onClick={() => setsignIn((prev) => !prev)}
          >
            Sign In
          </Link>{" "}
          .
        </p>
      ))}
    </>
  );
}
