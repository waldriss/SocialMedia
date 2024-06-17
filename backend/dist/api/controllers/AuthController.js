"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigInOrSignUpGoogle = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const __1 = require("..");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, username, password } = req.body;
        const userWithEmail = yield prisma.user.findUnique({ where: { email: email } });
        if (userWithEmail) {
            return res.status(401).json({ message: "Email already in use. Please choose another." });
        }
        const userWithUserName = yield prisma.user.findUnique({ where: { username: username } });
        if (userWithUserName) {
            return res.status(401).json({ message: "username already in use. Please choose another." });
        }
        const createduser = yield prisma.user.create({
            data: { name: name, username: username, email: email },
        });
        if (createduser) {
            const clerkCreatedUser = yield __1.customclerkClient.users.createUser({
                externalId: createduser.id.toString(),
                emailAddress: [email],
                password: password,
                username: username,
                firstName: name,
            });
        }
        return res.status(200).json({ message: "user created" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});
exports.registerUser = registerUser;
const SigInOrSignUpGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, userId } = req.body;
        const user = yield prisma.user.findUnique({ where: { email: email } });
        if (user) {
            const updatedUser = yield prisma.user.update({
                where: { email: email },
                data: {
                    name: name,
                },
            });
            return res.status(200).json({ message: "user updated" });
        }
        else {
            const timestamp = Date.now().toString(36);
            const randomStr = Math.random().toString(36).substring(2, 8);
            const username = timestamp + randomStr;
            const createduser = yield prisma.user.create({
                data: { name: name, username: username, email: email },
            });
            const clerkUser = yield __1.customclerkClient.users.updateUser(userId, { externalId: createduser.id.toString() });
            return res.status(200).json({ message: "user created" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.SigInOrSignUpGoogle = SigInOrSignUpGoogle;
