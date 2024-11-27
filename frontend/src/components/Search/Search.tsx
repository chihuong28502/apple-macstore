import React, { useState } from "react";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className=" items-center w-full bg-inputBackground rounded-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Nhập sản phẩm tìm kiếm ..."
          className="w-full text-xs lg:text-sm  text-iconBlur focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default SearchComponent;
