"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.customclerkClient = void 0;
// src/index.js
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const cors = require("cors");
const path = require("path");
const routes = require("../routes");
const socketIo = require("socket.io");
exports.customclerkClient = (0, clerk_sdk_node_1.Clerk)({
    secretKey: process.env.CLERK_SECRET_KEY,
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(cors({ credentials: true }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use("/", routes);
const server = http_1.default.createServer(app);
exports.io = socketIo(server, {
    cors: {
        origin: ["http://localhost:3000", "https://smapp-h03d.onrender.com", "0.0.0.0:3000","https://social-media-iota-sand.vercel.app"], // Replace with your frontend URL
        methods: ["GET", "POST"],
    },
});
exports.io.on("connection", (socket) => {
    socket.on("login", ({ userId }) => {
        socket.join(userId); // Join the user to a room based on their user ID
    });
    socket.on("send_notification", ({ notification, userId }) => {
        exports.io.to(userId).emit('notification', { notification: notification });
    });
});
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
