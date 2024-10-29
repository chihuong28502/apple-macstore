"use client";
import { AnimatePresence,motion } from "framer-motion";
import React, { useEffect,useRef, useState } from "react";
import { FaCheck,FaChevronDown, FaTimes } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface Option {
  _id: number;
  name: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  className?: string;
  selectedOptions: number[];
  toggleOption: (id: number) => void;
  clearSelection: () => void;
  getSelectedOptionsText: () => string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  className,
  selectedOptions,
  toggleOption,
  clearSelection,
  getSelectedOptionsText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn(className ? className : "relative w-1/2")}
      ref={dropdownRef}
    >
      <div
        className="w-full flex items-center px-4 py-2 bg-transparent text-sm font-medium text-iconBlur focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate flex-grow text-left pr-2">
          {getSelectedOptionsText()}
        </span>
        <div className="flex items-center gap-2">
          <FaChevronDown className="flex-shrink-0 size-2 lg:size-4" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="p-1 rounded-full text-iconBlur"
          >
            <FaTimes className="size-2.5 lg:size-4" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-full rounded-md shadow-lg bg-inputBackground focus:outline-none z-10"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((option) => (
                <div
                  key={option._id}
                  className="px-4 py-2 text-sm text-fontColor bg-transparent cursor-pointer flex justify-between items-center"
                  onClick={() => toggleOption(option._id)}
                >
                  <span className="truncate flex-grow pr-2">{option.name}</span>
                  {selectedOptions.includes(option._id) && (
                    <FaCheck className="text-blue-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelectDropdown;
