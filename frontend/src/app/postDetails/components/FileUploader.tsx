"use client";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string|undefined;
  resetFile:boolean;
  setResetFile:any
};
const convertFileToUrl = (file: File) => URL.createObjectURL(file);

const FileUploader = ({ fieldChange, mediaUrl,setResetFile,resetFile }: FileUploaderProps) => {
    useEffect(()=>{
      if(resetFile===true){
        setFile([]);
        setFileUrl(undefined);
        setResetFile(false);
      }

    },[resetFile])


  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string|undefined>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[],fileRejections: FileRejection[]) => {
      if(fileRejections.length==0){
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(convertFileToUrl(acceptedFiles[0]));
      }else{
        console.log("file not valid");
      }
      
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [], 
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col  rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <div className="w-full bg-[#15161e] border border-solid border-[#2e3142] rounded-lg ">
          <div className="relative w-full h-[580px]  rounded-lg p-8  ">
            <img
              src={fileUrl}
              alt="image"
              className="w-full h-full rounded-lg"
            />
          </div>

          <Separator className="  w-full bg-[#1d1f2a]" />
          <p className="  text-whiteShade w-full text-center p-3 text-[#3f435a]">
            Click or drag photo to replace
          </p>
        </div>
      ) : (
        <div className="w-full h-[580px] bg-[#15161e] rounded-lg flex flex-col justify-center items-center border border-solid border-[#2e3142] ">
          <ImagePlus className="text-whiteShade h-28 w-28 stroke-[1px]  " />

          <h3 className="font-semibold text-xl text-whiteShade mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-muted-foreground font-semibold text-base mb-6">
            SVG, PNG, JPG
          </p>

          <Button type="button" className="bg-[#262836] font-sans">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
