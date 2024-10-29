"use client";
import { Card, Skeleton } from "antd";

import { type ProductPage } from "@/type/product.page.type";

export const PriceFilter: React.FC<ProductPage.PriceFilterProps> = ({
  priceRanges,
  selectedRangeId,
  onPriceChange,
  loading,
}) => {
  if (loading) {
    return (
      <Card className="mb-8">
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }
  return (
    <Card className="mb-8 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Mức giá</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {priceRanges.map((range) => (
          <label
            key={range.id}
            className={`
              px-5 py-2 rounded-full cursor-pointer border transition-all duration-200
              hover:shadow-lg hover:scale-105
              ${
                selectedRangeId === range.id
                  ? "bg-green-500 text-white shadow-green-200 shadow-lg"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
              }
            `}
          >
            <input
              type="radio"
              name="priceRange"
              className="hidden"
              checked={selectedRangeId === range.id}
              onChange={() => onPriceChange(range)}
            />
            <span className="text-sm font-medium">{range.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
};
