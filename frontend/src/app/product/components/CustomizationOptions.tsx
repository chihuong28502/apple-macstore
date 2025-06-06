import React from "react";

const CustomizationOptions = React.memo(
  ({ options, handleClick, selectedOption, label }: any) => (
    <div className="mt-5">
      <h3 className="text-xl font-bold text-fontColor">{label}</h3>
      {options.map((option: string) => (
        <button
          key={option}
          type="button"
          onClick={() => handleClick(option)}
          className={`px-3 py-1 !text-black rounded-lg transition-all duration-300 mr-2 mt-2 ${
            selectedOption === option ? "border-gray-800 bg-[#999]" : "border-gray-300 bg-[#fff]"
          } hover:border-gray-800 hover:bg-[#086508]`}
        >
          {option} GB
        </button>
      ))}
    </div>
  )
);

CustomizationOptions.displayName = "CustomizationOptions";

export default CustomizationOptions;
