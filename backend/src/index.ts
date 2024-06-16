// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Clerk } from "@clerk/clerk-sdk-node";
import http from "http";
import { Socket } from "socket.io";
import { TFNotification } from "./types/FrontNotifications";
dotenv.config();
const cors = require("cors");
const path = require("path");
const routes = require("../routes");
const socketIo = require("socket.io");

export const customclerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});



const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors({ credentials: true }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", routes);

const server = http.createServer(app);
export const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000","https://smapp-h03d.onrender.com" ],// Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("login", ({ userId }: { userId: string }) => {
    socket.join(userId); // Join the user to a room based on their user ID
  });
  
  socket.on("send_notification", ({ notification,userId }: { notification: TFNotification,userId:string }) => {
    
    io.to(userId).emit('notification', { notification: notification });
    
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
