"use client";
import { type ProductPage } from "@/type/product.page.type";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Skeleton } from "antd";
import Link from "next/link";
import React from "react";

export const BreadcrumbNav: React.FC<ProductPage.BreadcrumbNavProps> = ({
  selectedCategory,
  categories,
  loading,
  onCategoryChange,
}) => {
  if (loading) {
    return (
      <Card className="mb-4">
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }

  // Tìm đường dẫn từ danh mục con lên danh mục cha
  const findCategoryPath = (categoryId: string): ProductPage.Category[] => {
    const path: ProductPage.Category[] = [];
    let currentCategory: any = categories.find(
      (cat) => cat._id === categoryId
    );

    while (currentCategory) {
      path.unshift(currentCategory); // Thêm vào đầu để giữ thứ tự cha -> con
      if (currentCategory.parentCategoryId) {
        currentCategory = categories.find(
          (cat) => cat._id === currentCategory.parentCategoryId
        );
      } else {
        currentCategory = undefined;
      }
    }
    return path;
  };

  const categoryPath =
    selectedCategory !== "all" ? findCategoryPath(selectedCategory) : [];

  // Tạo danh sách items cho Breadcrumb
  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className="flex items-center hover:text-green-500 transition-colors"
        >
          <HomeOutlined className="mr-1" />
          Trang chủ
        </Link>
      ),
    },
    {
      title: (
        <Link
          href="/product"
          className="hover:text-green-500 transition-colors"
        >
          Sản phẩm
        </Link>
      ),
      onClick: () => onCategoryChange(""),
    },
    ...categoryPath.map((category) => ({
      title: (
        <Link
          href={`/product?categoryId=${category._id}`}
          className="hover:text-green-500 transition-colors"
        >
          {category.name}
        </Link>
      ),
      onClick: () => onCategoryChange(category._id),
    })),
  ];

  return (
    <Card className="mb-4 shadow-sm">
      <Breadcrumb items={breadcrumbItems} />
    </Card>
  );
};
