"use client";
import SkeletonGrid from "@/components/loadingComp";
import type { ProductPage } from "@/type/product.page.type";
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select, Space } from "antd";
import Link from "next/link";
import React, { useState } from "react";

export const CategoryFilter: React.FC<ProductPage.CategoryFilterProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onCategoryChange,
  onDeleteCategory,
  loading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductPage.Category | null>(null);
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

  const handleEditCategory = (category: ProductPage.Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      parentCategoryId: category.parentCategoryId,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await onDeleteCategory(categoryId);
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa danh mục");
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const categoryData = {
        name: values.name,
        parentCategoryId: values.parentCategoryId || null,
      };

      if (isEditMode && editingCategory) {
        await onEditCategory({ id: editingCategory._id, data: categoryData });
      } else {
        await onAddCategory(categoryData);
      }

      form.resetFields();
      setIsModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu danh mục");
    }
  };

  const renderDropdownMenu: any = (parentId: string | null) => {
    return getChildrenCategories(parentId).map(
      (category: ProductPage.Category) => {
        const children = getChildrenCategories(category._id);
        return {
          label: (
            <div className="flex gap-3 items-center">
              <Link
                onClick={() => onCategoryChange(category._id)}
                href={`/product?categoryId=${category._id}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                {category.name}
              </Link>
              <Space className="flex items-center bg-slate-300 rounded-md shadow-sm">
                <button
                  className="flex items-center py-1 text-green-600 hover:bg-green-100 rounded-md transition"
                  onClick={() => handleEditCategory(category)}
                >
                  <EditOutlined className="mr-1" />
                  Sửa
                </button>
                <button
                  className="flex items-center py-1 text-red-600 hover:bg-red-100 rounded-md transition"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <DeleteOutlined className="mr-1" />
                  Xóa
                </button>
              </Space>
            </div>
          ),
          key: category._id,
          children: children.length > 0 ? renderDropdownMenu(category._id) : null,
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
              trigger={["hover", "click"]}
            >
              <div className="flex items-center">
                <Button
                  onClick={() => onCategoryChange(category._id)}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {category.name} <DownOutlined className="ml-2" />
                </Button>
                <Space className="bg-slate-500 rounded-md">
                  <button
                    className="flex items-center text-green-600 hover:bg-green-100 rounded-md px-2 py-1  transition"
                    onClick={() => handleEditCategory(category)}
                  >
                    <EditOutlined  />
                    Sửa
                  </button>
                  <button
                    className="flex items-center text-red-600 hover:bg-red-100 rounded-md px-2 py-1 transition"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <DeleteOutlined  />
                    Xóa
                  </button>
                </Space>
              </div>
            </Dropdown>
          ))}
      </Space>
      <div className="flex justify-end items-center mb-5">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>

        <Modal
          title={isEditMode ? "Sửa danh mục" : "Thêm danh mục mới"}
          open={isModalOpen}
          onCancel={() => {
            form.resetFields();
            setIsModalOpen(false);
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
            <Form.Item name="parentCategoryId" label="Danh mục cha">
              <Select placeholder="Chọn danh mục cha" allowClear>
                {categories
                  .filter((cat) => cat.parentCategoryId === null)
                  .map((parentCat) => (
                    <Select.OptGroup key={`parent-${parentCat._id}`} label={parentCat.name}>
                      <Select.Option key={`opt-${parentCat._id}`} value={parentCat._id}>
                        {parentCat.name}
                      </Select.Option>
                      {categories
                        .filter((childCat) => childCat.parentCategoryId === parentCat._id)
                        .map((childCat) => (
                          <Select.Option key={childCat._id} value={childCat._id}>
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
                {isEditMode ? "Cập nhật" : "Thêm danh mục"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryFilter;
