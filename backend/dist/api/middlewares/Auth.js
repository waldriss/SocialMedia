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
exports.getUserIdAuthMiddleware = exports.clerkAuthMiddleware = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const getAuthenticatedUserIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.sessionClaims.userId;
    req.AuthentifiedUserId = parseInt(userId);
    next();
});
const clerkAuthMiddleware = (req, res, next) => {
    if (req.path !== "/signin" && req.path !== "/register" && req.path !== "/SigInOrSignUpGoogle") {
        return (0, clerk_sdk_node_1.ClerkExpressRequireAuth)()(req, res, next);
    }
    next();
};
exports.clerkAuthMiddleware = clerkAuthMiddleware;
const getUserIdAuthMiddleware = (req, res, next) => {
    if (req.path !== "/signin" && req.path !== "/register" && req.path !== "/SigInOrSignUpGoogle") {
        return getAuthenticatedUserIdMiddleware(req, res, next);
    }
    next();
};
exports.getUserIdAuthMiddleware = getUserIdAuthMiddleware;
