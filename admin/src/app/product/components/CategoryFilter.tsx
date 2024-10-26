"use client";
import SkeletonGrid from "@/components/loadingComp";
import type { ProductPage } from "@/type/product.page.type";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";

export const CategoryFilter: React.FC<ProductPage.CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCategory,
  loading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

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

  const handleSubmit = async (values: any) => {
    try {
      if (onAddCategory) {
        await onAddCategory({
          name: values.name,
          description: values.description,
          parentCategoryId: values.parentCategoryId || null,
        });
        message.success("Thêm danh mục thành công");
        form.resetFields();
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm danh mục");
    }
  };

  const renderDropdownMenu: any = (parentId: string | null) => {
    return getChildrenCategories(parentId).map(
      (category: ProductPage.Category) => {
        const children = getChildrenCategories(category._id);

        if (children.length > 0) {
          return {
            label: category.name,
            key: category._id,
            children: renderDropdownMenu(category._id),
          };
        }

        return {
          label: (
            <button
              onClick={() => onCategoryChange(category._id)}
              className={`block w-full text-left px-2 py-1 transition-all duration-200 ${
                selectedCategory === category._id
                  ? "bg-[#1890ff] text-white"
                  : "text-gray-700"
              }`}
              type="button"
            >
              <Link href={`product?categoryId=${category._id}`}>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Space direction="vertical" size="middle" className="flex flex-row">
        {categories
          .filter((category) => category.parentCategoryId === null)
          .map((category) => (
            <Dropdown
              key={category._id}
              overlay={<Menu items={renderDropdownMenu(category._id)} />}
              trigger={["click"]}
            >
              <Button className="flex items-center">
                {category.name} <DownOutlined className="ml-2" />
              </Button>
            </Dropdown>
          ))}
      </Space>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Danh mục sản phẩm</h3>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm danh mục
        </Button>

        <Modal
          title="Thêm danh mục mới"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Nhập mô tả danh mục" />
            </Form.Item>

            <Form.Item name="parentCategoryId" label="Danh mục cha">
              <Select placeholder="Chọn danh mục cha" allowClear>
                {/* Render danh mục cha (parentCategoryId = null) */}
                {categories
                  .filter((cat) => cat.parentCategoryId === null)
                  .map((parentCat) => (
                    <Select.OptGroup key={parentCat._id} label={parentCat.name}>
                      {/* Render danh mục con của từng danh mục cha */}
                      <Select.Option key={parentCat._id} value={parentCat._id}>
                        {parentCat.name}
                      </Select.Option>
                      {categories
                        .filter(
                          (childCat) =>
                            childCat.parentCategoryId === parentCat._id
                        )
                        .map((childCat) => (
                          <Select.Option
                            key={childCat._id}
                            value={childCat._id}
                          >
                            {`-- ${childCat.name}`}
                          </Select.Option>
                        ))}
                    </Select.OptGroup>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 flex justify-end">
              <Button onClick={() => setIsModalOpen(false)} className="mr-2">
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm danh mục
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryFilter;
