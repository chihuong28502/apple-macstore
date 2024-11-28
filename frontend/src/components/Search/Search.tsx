import React, { useState } from "react";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className=" items-center container rounded-2xl w-96">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Nhập sản phẩm tìm kiếm ..."
          className="w-full text-sm lg:text-sm  text-iconBlur focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default SearchComponent;
