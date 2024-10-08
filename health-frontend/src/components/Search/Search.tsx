import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import MultiSelectDropdown from "../MultipleSelect/MultipleSelectDropDown";
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const options = [
    { _id: 1, name: "Mưa tháng sáu" },
    { _id: 2, name: "Tiếng mưa rơi lofi cực chill" },
    { _id: 3, name: "Mưa tháng sáu Văn Mai Hương" },
    { _id: 4, name: "Video mưa đẹp" },
    { _id: 5, name: "Cảnh mưa tâm trạng" },
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleOption = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const clearSelection = () => {
    setSelectedOptions([]);
  };

  const getSelectedOptionsText = () => {
    const selectedNames = options
      .filter((option) => selectedOptions.includes(option._id))
      .map((option) => option.name);

    if (selectedNames.length === 0) return "Chủ đề";
    return selectedNames.join(", ");
  };

  return (
    <div className="flex items-center w-full bg-inputBackground rounded">
      <div className="relative w-1/2">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2  size-3 lg:size-5 text-iconBlur" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Mưa tháng sáu"
          className="w-full py-2 pl-10 pr-8 text-xs lg:text-sm  text-iconBlur focus:outline-none bg-transparent border-r-2 border-iconBlur"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-iconBlur"
          >
            <FaTimes className="size-4 text-iconBlur" />
          </button>
        )}
      </div>
      <MultiSelectDropdown
        options={options}
        selectedOptions={selectedOptions}
        toggleOption={toggleOption}
        clearSelection={clearSelection}
        getSelectedOptionsText={getSelectedOptionsText}
      />
    </div>
  );
};

export default SearchComponent;
