import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className=" items-center w-full bg-inputBackground rounded">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2  size-3 lg:size-4 text-iconBlur" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Nhập sản phẩm tìm kiếm ..."
          className="w-full py-2 pl-10 pr-8 text-xs lg:text-sm  text-iconBlur focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default SearchComponent;
