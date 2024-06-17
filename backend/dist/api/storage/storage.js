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
exports.uploadPostImage = exports.uploadProfileImage = exports.upload = void 0;
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
exports.upload = multer({ storage: multer.memoryStorage() });
//------------------------------upload functions
const uploadProfileImage = (imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFormat = imageFile.mimetype.split("/")[1] || "jpeg";
        const base64Image = `data:image/${imageFormat};base64,${imageFile.buffer.toString("base64")}`;
        const result = yield cloudinary.uploader.upload(base64Image, {
            folder: "UserImages",
            format: "webp",
        });
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Failed to upload image");
    }
});
exports.uploadProfileImage = uploadProfileImage;
const uploadPostImage = (imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFormat = imageFile.mimetype.split("/")[1] || "jpeg";
        const base64Image = `data:image/${imageFormat};base64,${imageFile.buffer.toString("base64")}`;
        const result = yield cloudinary.uploader.upload(base64Image, {
            folder: "PostImages",
            format: "webp",
        });
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Failed to upload image");
    }
});
exports.uploadPostImage = uploadPostImage;
