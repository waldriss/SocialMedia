"use client"
import { Select, SelectItem } from "@nextui-org/select";

const SelectExplorePosts = () => {
    const selectElements=["opt1","opt2","opt3"];
  return (
   
    <Select 
      variant={"bordered"}
      label="jsppppp" 
      className="max-w-28 bg-backgroundgrad2 rounded-xl" 
    >
      {selectElements.map((selectElement) => (
        <SelectItem key={selectElement} value={selectElement}>
          {selectElement}
        </SelectItem>
      ))}
    </Select>
    
  
  );
};

export default SelectExplorePosts;
