import React, { useState } from "react";
import { FaSearch, FaTimes, FaChevronDown } from "react-icons/fa";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    "Mưa tháng sáu, Tiếng mưa rơi lofi cực chill, ...",
    "Option 2",
    "Option 3",
    // Add more options as needed
  ];

  const handleInputChange = (e:any) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionSelect = (option:any) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedOption("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative flex items-center w-full">
        <FaSearch className="absolute left-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Mưa tháng sáu"
          className="w-full py-2 pl-10 pr-20 text-sm bg-white border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-between items-center w-40 rounded-r-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              onClick={() => setShowOptions(!showOptions)}
            >
              <span className="truncate">{selectedOption || "Chủ đề"}</span>
              <FaChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
          {showOptions && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {options.map((option, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        {(searchTerm || selectedOption) && (
          <button
            onClick={clearSearch}
            className="absolute right-44 p-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
