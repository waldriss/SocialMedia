import { z } from "zod";

export const PostValidation = z.object({
  caption: z
    .string()
    .max(80, { message: "Maximum 80 caracters" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(20, { message: "Maximum 20 characters." }),
  tags: z
    .string()
    .regex(/^(\w+)(,\w+)*$|^$/, {
      message: "Tags must be separated by commas without spaces or be empty",
    }),
}).refine(({file})=>!(!file || Array.isArray(file)&&file.length===0),{message:"File is required",path:["file"]});
