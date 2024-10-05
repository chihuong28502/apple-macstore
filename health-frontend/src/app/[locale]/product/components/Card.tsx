import React, { FC } from "react";

interface ICard {
  name: string;
  description: string;
  basePrice: number;
  price: number;
  images: string[];
  tags: string[];
  customizations: any;
  stock: Record<string, number>;
}

const Card: FC<ICard> = ({
  name,
  description,
  basePrice,
  price,
  images,
  tags,
  customizations,
  stock,
}) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
      <img
        className="w-full h-48 object-cover"
        src={images[0]}
        alt={name}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-gray-500 text-sm">Base Price: {formatter.format(basePrice)}</p>
        <p className="text-gray-900 font-bold mt-2">
          Sale Price: {formatter.format(price)}
        </p>

        <div className="mt-4">
          <p className="text-gray-700 font-medium">Customizations:</p>
          {customizations.colors && (
            <p className="text-sm text-gray-500">Colors: {customizations.colors.join(", ")}</p>
          )}
          {customizations.sizes && (
            <p className="text-sm text-gray-500">Sizes: {customizations.sizes.join(", ")}</p>
          )}
          {customizations.flavors && (
            <p className="text-sm text-gray-500">Flavors: {customizations.flavors.join(", ")}</p>
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-700 font-medium">Tags:</p>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 font-medium">Stock Availability:</p>
          {Object.keys(stock).map((size) => (
            <p key={size} className="text-sm text-gray-500">
              Size {size}: {stock[size]} units available
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
