import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

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
  const divRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (divRef.current && !divRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
      <div ref={divRef} className="flex items-center justify-between ">
        <div
          className=" max-w-[90%] truncate cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
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
            className="w-4 h-4 text-[#FFBD70] cursor-pointer "
          />
        </div>
      </div>

      {/* Hiện list danh sách chọn */}
      {isOpen && (
        <motion.ul
          initial={{
            y: -50,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{ duration: 0.5 }}
          className="p-3 w-80 bg-white shadow-bgComponentSelect rounded-xl absolute top-10 -right-6"
        >
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
        </motion.ul>
      )}
    </div>
  );
};

export default MultipleSelect;
