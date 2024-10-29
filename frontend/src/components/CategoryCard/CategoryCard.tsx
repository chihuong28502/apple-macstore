import React from "react";
import { HiInboxStack } from "react-icons/hi2";

import { cn } from "@/lib/utils";

interface Props {
  item: { _id: number; title: string; description: string; icon: any };
  onSelect: any;
  isSelect: any;
}

const CategoryCard = ({ item, onSelect, isSelect }: Props) => {
  const { _id, title, description } = item;

  return (
    <div
      onClick={() => onSelect(_id)}
      className={cn(
        "p-6 flex gap-6 flex-row justify-between items-center box-content rounded-3xl cursor-pointer",
        isSelect === _id
          ? "bg-bgCategoryCardSelect text-textCategoryCardSelect"
          : "bg-bgCategoryCardWithoutSelect text-textCategoryCardWithoutSelect shadow-bgComponentSelect"
      )}
    >
      <div className="flex-shrink-0">
        <HiInboxStack className="w-10 h-10" />
      </div>
      <div className="flex-grow min-w-0 overflow-hidden">
        <div
          className={cn(
            "text-[1.1rem] font-bold leading-5",
            isSelect === _id
              ? "text-textCategoryCardSelect"
              : "text-textCategoryCardWithoutSelect"
          )}
        >
          {title}
        </div>
        <div
          className={cn(
            "text-[12px] font-normal leading-5 tracking-[0.6px] truncate",
            isSelect === _id
              ? "text-textCategoryCardSelect"
              : "text-textCategoryCardWithoutSelect"
          )}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
