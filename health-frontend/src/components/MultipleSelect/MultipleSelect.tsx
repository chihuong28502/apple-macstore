import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  data: { name: string; _id: number }[];
  className?: string;
}

const MultipleSelect: React.FC<Props> = ({ data, className }) => {
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

  return (
    <div className={className}>
      {data && (
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
          className="bg-white shadow-bgComponentSelect rounded-xl absolute top-10 right-0 w-full"
        >
          {data?.map((item: { name: string; _id: number }, index: number) => (
            <li
              key={index}
              className={`hover:bg-slate-300 py-2 px-4 flex justify-between items-center cursor-pointer 
              ${index === 0 ? 'rounded-t-xl' : ''} ${index === data.length - 1 ? 'rounded-b-xl' : ''}`}
            >
              <div>{item?.name}</div>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default MultipleSelect;
