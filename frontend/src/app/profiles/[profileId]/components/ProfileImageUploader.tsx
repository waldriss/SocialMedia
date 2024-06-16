"use client";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Plus } from "lucide-react";
import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string | undefined;
  isUpdatingUser?:boolean
};
const convertFileToUrl = (file: File) => URL.createObjectURL(file);

const ProfileImageUploader = ({ fieldChange, mediaUrl,isUpdatingUser }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string | undefined>(mediaUrl);
  const [fileChanged, setfileChanged] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
      if (fileChanged == false) setfileChanged(true);
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });
  //${fileChanged?'bg-[rgb(63,67,90,0.8)]':''}
  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer  w-full h-full rounded-full absolute top-0 border-1 border-solid border-whiteShade`}
    >
      <input
        {...getInputProps()}
        type="file"
        className="bg-white h-full w-full opacity-0"
      />
      <div className="absolute z-50 bg-primary bottom-0 right-6 rounded-full p-1">
        {!isUpdatingUser?<Plus className="text-whiteShade h-10 w-10" />:<LoadingSvg isWhite className=" h-10 w-10"/>}
      </div>
      {fileUrl && (
        <Image
          alt="OM"
          className="w-full h-full rounded-full"
          width={800}
          height={800}
          src={fileUrl}
        />
      )}
    </div>
  );
};

export default ProfileImageUploader;
