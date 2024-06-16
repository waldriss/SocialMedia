import { NextFunction, Request, Response } from "express";
import { customclerkClient } from "..";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const getAuthenticatedUserIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const userId = req.auth.sessionClaims.userId;
  
    req.AuthentifiedUserId = parseInt(userId);
  

  next();
};

export const clerkAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path !== "/signin" && req.path !== "/register"&& req.path !=="/SigInOrSignUpGoogle") {
    return ClerkExpressRequireAuth()(req, res, next);
  }

  next();
};

export const getUserIdAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path !== "/signin" && req.path !== "/register"&& req.path !=="/SigInOrSignUpGoogle") {
    return getAuthenticatedUserIdMiddleware(req, res, next);
  }

  next();
};
