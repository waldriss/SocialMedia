import { IFile } from "../types/globalTypes";

const multer = require("multer");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const upload = multer({ storage: multer.memoryStorage() });

//------------------------------upload functions

export const uploadProfileImage = async (imageFile: IFile):Promise<string> => {
  try {
    const imageFormat = imageFile.mimetype.split("/")[1] || "jpeg";
    const base64Image = `data:image/${imageFormat};base64,${imageFile.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "UserImages",
      format: "webp",
    });
    return result.secure_url;

  } catch (error) {
    throw new Error("Failed to upload image");
   
  }
};

export const uploadPostImage = async (imageFile: IFile):Promise<string> => {
  try {
    const imageFormat = imageFile.mimetype.split("/")[1] || "jpeg";
    const base64Image = `data:image/${imageFormat};base64,${imageFile.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "PostImages",
      format: "webp",
    });
    return result.secure_url;
  } catch (error) {
   
    throw new Error("Failed to upload image");
  }
};
