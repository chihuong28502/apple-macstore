import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  item: {
    _id: number,
    title: string;
    
  };
  onSelect: any,
  isSelect: any
}

const TopCard: React.FC<Props> = ({ item, onSelect, isSelect }) => {
  const { title, _id } = item;
  return (
    <p
      onClick={() => onSelect(_id)}
      className={cn(
        "p-2 rounded-sm mr-2 cursor-pointer",
        isSelect === _id
          ? "bg-bgTopicCardSelected text-textTopicCardSelected"
          : "text-textTopicCardWithoutSelect bg-bgTopicCardWithoutSelect shadow-bgComponentSelect "
      )}
    >
      {title}
    </p>
  );
};

export default TopCard;
