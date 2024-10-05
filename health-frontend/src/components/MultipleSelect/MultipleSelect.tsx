import React from "react";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Props {
  data: { name: string; _id: number }[];
  selected: number[];
  title: string;
  className?: string;
}

const MultipleSelect: React.FC<Props> = ({
  data,
  selected,
  title,
  className,
}) => {
  const [selectedList, setSelectedList] = useState(selected);
  const [isOpen, setIsOpen] = useState(false);

  const onSelect = (item: { name: string; _id: number }) => {
    const selected = selectedList.find((element) => element === item._id);
    if (!selected) {
      setSelectedList((prev) => [...prev, item._id]);
    } else {
      setSelectedList((prev) => prev.filter((element) => element !== item._id));
    }
  };

  const getFilteredNames = useCallback(
    (data: { name: string; _id: number }[], selectedList: number[]) => {
      return data
        .filter((item: { name: string; _id: number }) =>
          selectedList.includes(item._id)
        )
        .map((item: { name: string; _id: number }) => item.name)
        .join(", ");
    },
    []
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className=" max-w-[90%] truncate">
          {getFilteredNames(data, selectedList) || title}
        </div>
        <div className="flex">
          <MdOutlineKeyboardArrowLeft
            className={cn(
              "cursor-pointer",
              "transition-transform",
              "duration-300",
              {
                "transform rotate-[-90deg]": isOpen,
              }
            )}
            onClick={() => setIsOpen(!isOpen)}
          />
          <IoIosCloseCircle
            onClick={() => setSelectedList([])}
            className="w-[18px] h-[18px] text-[#FFBD70] cursor-pointer"
          />
        </div>
      </div>

      {/* Hiện list danh sách chọn */}
      {isOpen && (
        <ul className="p-3 w-[304px] bg-inputBackground shadow-bgComponentSelect rounded-xl absolute top-10 -right-6">
          {data.map((item: { name: string; _id: number }, index: number) => (
            <li
              onClick={() => onSelect(item)}
              key={index}
              className="py-2 px-4 flex justify-between items-center cursor-pointer"
            >
              <div>{item.name}</div>
              <div>{selectedList.includes(item._id) && <FaCheck />}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultipleSelect;
