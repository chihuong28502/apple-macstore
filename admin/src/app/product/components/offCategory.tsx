"use client";
import { type ProductPage } from "@/type/product.page.type";
import { Card, Skeleton, Collapse } from "antd";
import Link from "next/link";
import React from "react";
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

export const CategoryFilter: React.FC<ProductPage.CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  loading,
}) => {
  if (loading) {
    return (
      <Card className="mb-8">
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }

  // Hàm để tìm danh mục con
  const getChildrenCategories = (parentId: string | null) => {
    return categories.filter(
      (category) => category.parentCategoryId === parentId
    );
  };

  // Hàm đệ quy để hiển thị danh mục theo cấp bậc dạng dropdown
  const renderCategories = (parentId: string | null): JSX.Element[] => {
    return getChildrenCategories(parentId).map((category) => {
      const children = getChildrenCategories(category._id);

      if (children.length > 0) {
        return (
          <Panel
            header={
              <span
                className={`font-medium transition-all duration-200 ${
                  selectedCategory === category._id
                    ? "text-green-600"
                    : "text-gray-700"
                }`}
              >
                {category.name}
              </span>
            }
            key={category._id}
            showArrow={true}
          >
            {/* Gọi đệ quy để hiển thị danh mục con */}
            <Collapse
              accordion
              bordered={false}
              expandIconPosition="right"
              expandIcon={({ isActive }) =>
                isActive ? <DownOutlined /> : <RightOutlined />
              }
              className="bg-white border-none"
            >
              {renderCategories(category._id)}
            </Collapse>
          </Panel>
        );
      }

      // Nếu không có danh mục con, chỉ hiển thị nút danh mục
      return (
        <div key={category._id} className="mb-2">
          <Link href={`/product?categoryId=${category._id}`}>
            <button
              onClick={() => onCategoryChange(category._id)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200
              hover:bg-green-50
              ${
                selectedCategory === category._id
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border hover:border-green-400"
              }`}
              type="button"
            >
              {category.name}
            </button>
          </Link>
        </div>
      );
    });
  };

  return (
    <Card className="mb-8 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Danh mục sản phẩm</h3>
      <div>
        {/* Nút Tất cả sản phẩm */}
        <button
          onClick={() => onCategoryChange("all")}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg font-medium transition-all duration-200
            hover:bg-green-50 hover:shadow-lg
            ${
              selectedCategory === "all"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white text-gray-700 border hover:border-green-400"
            }`}
          type="button"
        >
          Tất cả sản phẩm
        </button>

        <Collapse
          accordion
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) =>
            isActive ? <DownOutlined /> : <RightOutlined />
          }
          className="bg-white border-none"
        >
          {renderCategories(null)}
        </Collapse>
      </div>
    </Card>
  );
};
