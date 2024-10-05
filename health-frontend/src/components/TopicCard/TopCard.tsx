import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  item: {
    title: string;
    isSelect: boolean;
  };
}

const TopCard: React.FC<Props> = ({ item }) => {
  const { title, isSelect } = item;
  return (
    <span
      className={cn(
        "px-[10px] py-[6px] rounded-sm mr-2 cursor-pointer",
        isSelect ? "bg-white" : "text-white bg-white-20"
      )}
    >
      {title}
    </span>
  );
};

export default TopCard;
