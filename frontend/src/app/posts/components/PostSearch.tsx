"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PostSearch = ({ search }: { search?: string }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search ? search : "");
  useEffect(() => {
    setSearchValue(search?search:"");
  },[search]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push(`/posts${searchValue != "" ? "?search=" + searchValue : ""}`, {
      scroll: false,
    });
  };

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="rounded-xl mt-14 font-sans-serif2 ">
      <form onSubmit={handleSubmit}>
        <div className="relative flex justify-center items-center gap-x-8">
          <Search className="absolute left-4  h-6 w-6 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Search"
            className="pl-12 py-6 pr-36 text-base rounded-xl bg-backgroundgrad2 text-whiteShade border-[#2e3142]"
          />
          <Button
            type="submit"
            className="py-6 font-sans px-8 rounded-r-xl rounded-l-none text-base absolute right-0 border-1 border-solid border-[#2e3142]"
          >
            submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostSearch;
