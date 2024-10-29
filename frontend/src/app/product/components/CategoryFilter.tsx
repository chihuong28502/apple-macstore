"use client";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space } from "antd";
import Link from "next/link";
import React from "react";

import { type ProductPage } from "@/type/product.page.type";

export const CategoryFilter: React.FC<ProductPage.CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  loading,
}) => {
  if (loading) {
    return (
      <Button loading className="mb-8">
        Loading...
      </Button>
    );
  }

  // Hàm để tìm danh mục con
  const getChildrenCategories = (parentId: string | null) => {
    return categories.filter(
      (category) => category.parentCategoryId === parentId
    );
  };

  // Hàm để tạo menu dropdown cho danh mục cha
  const renderDropdownMenu: any = (parentId: string | null) => {
    return getChildrenCategories(parentId).map(
      (category: ProductPage.Category) => {
        const children = getChildrenCategories(category._id);

        if (children.length > 0) {
          return {
            label: category.name,
            key: category._id,
            children: renderDropdownMenu(category._id), // Đệ quy để hiển thị danh mục con
          };
        }

        return {
          label: (
            <button
              onClick={() => onCategoryChange(category._id)}
              className={`block w-full text-left px-2 py-1 transition-all duration-200  ${
                selectedCategory === category._id
                  ? "bg-green-500 text-white"
                  : "text-gray-700"
              }`}
              type="button"
            >
              <Link href={`/product?categoryId=${category._id}`}>
                {category.name}
              </Link>
            </button>
          ),
          key: category._id,
        };
      }
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Danh mục sản phẩm</h3>
      <Space direction="vertical" size="middle" className="flex flex-row">
        {categories
          .filter((category) => category.parentCategoryId === null)
          .map((category) => {
            return (
              <Dropdown
                key={category._id}
                overlay={<Menu items={renderDropdownMenu(category._id)} />}
                trigger={["click"]}
              >
                <Button className="flex items-center"
                >
                  {category.name} <DownOutlined className="ml-2" />
                </Button>
              </Dropdown>
            );
          })}
      </Space>
    </div>
  );
};
