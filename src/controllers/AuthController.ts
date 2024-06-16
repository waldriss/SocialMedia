import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { RegisterRequest, SigInOrSignUpGoogleRequest } from "../types/auth";
import { customclerkClient } from "..";

const prisma = new PrismaClient();

export const registerUser = async (req: RegisterRequest, res: Response) => {
  try {
    const { email, name, username, password } = req.body;

    const userWithEmail = await prisma.user.findUnique({ where: { email: email } });
    if (userWithEmail) {
     
      return res.status(401).json({ message: "Email already in use. Please choose another." });
    } 
    const userWithUserName = await prisma.user.findUnique({ where: { username: username } });
    if (userWithUserName) {
     
      return res.status(401).json({ message: "username already in use. Please choose another." });
    } 

      const createduser = await prisma.user.create({
        data: { name: name, username: username, email: email },
      });
      if (createduser) {
        const clerkCreatedUser = await customclerkClient.users.createUser({
          externalId: createduser.id.toString(),
          emailAddress: [email],
          password: password,
          username: username,
          firstName: name,
        });
      }

   
      return res.status(200).json({ message: "user created" });
    
  } catch (err: any) {
    console.log(err);

    return res.status(500).json({ message: err.message });
  }
};

export const SigInOrSignUpGoogle = async (req: SigInOrSignUpGoogleRequest, res: Response) => {
  try {
    const { email, name,userId } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: {
          name: name,
        },
      });

      return res.status(200).json({ message: "user updated" });
    } else {
      
        const timestamp = Date.now().toString(36); 
        const randomStr = Math.random().toString(36).substring(2, 8);
        const username= timestamp + randomStr;

        const createduser = await prisma.user.create({
          data: { name: name, username: username, email: email },
        });
        const clerkUser=await customclerkClient.users.updateUser(userId,{externalId:createduser.id.toString()})
        return res.status(200).json({ message: "user created" });

      
      
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
