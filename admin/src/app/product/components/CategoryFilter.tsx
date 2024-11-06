"use client";
import SkeletonGrid from "@/components/loadingComp";
import type { ProductPage } from "@/type/product.page.type";
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, message, Modal, Select, Space } from "antd";
import Link from "next/link";
import React, { useState } from "react";

export const CategoryFilter: React.FC<ProductPage.CategoryFilterProps> = ({
  categories,
  onCategoryChange,
  loading,
}) => {

  if (loading) {
    return (
      <div className="my-5 w-full">
        <SkeletonGrid rows={1} items={1} />
      </div>
    );
  }

  const getChildrenCategories = (parentId: string | null) => {
    return categories.filter(
      (category) => category.parentCategoryId === parentId
    );
  };



  const renderDropdownMenu: any = (parentId: string | null) => {
    return getChildrenCategories(parentId).map(
      (category: ProductPage.Category) => {
        const children = getChildrenCategories(category._id);
        return {
          label: (
            <div className="flex items-center gap-2">
              <Link
                onClick={() => onCategoryChange(category._id)}
                href={`/product?categoryId=${category._id}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                {category.name}
              </Link>
            </div>
          ),
          key: category._id,
          children: children.length > 0 ? renderDropdownMenu(category._id) : null,
        };
      }
    );
  };

  return (
    <div className="flex flex-wrap w-full gap-6 mb-8">
      <Space direction="vertical" size="middle" className="flex flex-row flex-wrap justify-between">
        {categories
          .filter((category) => category.parentCategoryId === null)
          .map((category) => (
            <Dropdown
              key={category._id}
              placement="bottomCenter"
              menu={{ items: renderDropdownMenu(category._id) }}
              trigger={["hover", "click"]}
            >
              <div className="flex items-center justify-between">
                <Button
                  className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {category.name}
                  <DownOutlined />
                </Button>
              </div>
            </Dropdown>
          ))}
      </Space>
    </div>
  );
};

export default CategoryFilter;
