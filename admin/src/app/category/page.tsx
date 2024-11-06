"use client";
import { CategoryActions, CategorySelectors } from "@/modules/category/slice";
import { CategoryType } from "@/modules/category/type";
import { ProductSelectors } from "@/modules/product/slice";
import { App, Form, Input, Modal, Select, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Categories from "./Categories";

const page: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(CategorySelectors.categories);
  const loading = useSelector(ProductSelectors.isLoading);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryType | null | any>(null);
  const [filter, setFilter] = useState<string>(""); // New state for filter
  useEffect(() => {
    dispatch(CategoryActions.fetchCategories());
  }, [dispatch]);

  // Filter categories based on the filter string
  const filteredCategories = categories.filter((category: any) =>
    category.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddCategory = async (newCategory: CategoryType) => {
    await dispatch(CategoryActions.createCategory({ data: newCategory }));
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditButtonClick = async (category: any) => {
    // Join breadcrumbs as a string
    const breadcrumbsString = category.breadcrumbs.join(" > ");
    form.setFieldsValue({
      name: category.name,
      breadcrumbs: breadcrumbsString,
      parentCategoryId: category.parentCategoryId,
    });

    setEditCategory(category);
    setIsModalVisible(true);
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
          await dispatch(CategoryActions.deleteCategory({ id: categoryId }));
          dispatch(CategoryActions.fetchCategories());
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa danh mục");
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const breadcrumbsArray = values.breadcrumbs.split(" > ");
      const categoryData = { ...values, breadcrumbs: breadcrumbsArray };
  
      if (editCategory) {
        // Update category
        await dispatch(
          CategoryActions.updateCategory({
            id: editCategory._id,
            data: categoryData,
          })
        );
      } else {
        await handleAddCategory(categoryData);
      }
      handleCancel();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form when modal is closed
    setEditCategory(null); // Clear edit category state
  };

  // Handle filter input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto p-8">
        <div className="space-y-6">
          <App>
            {/* Filter Input */}
            <Input
              placeholder="Search Categories"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: 300, marginBottom: "20px" }}
            />

            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
            >
              Add Category
            </Button>

            {Array.isArray(filteredCategories) && filteredCategories.length > 0 ? (
              <Categories
                categories={filteredCategories} // Pass filtered categories
                loading={loading}
                onEdit={handleEditButtonClick}
                onDelete={handleDeleteCategory}
              />
            ) : (
              <div>No categories found or error loading categories.</div>
            )}
          </App>
        </div>
      </div>

      {/* Modal for adding or editing category */}
      <Modal
        title={editCategory ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editCategory ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input the category name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category Breadcrumb"
            name="breadcrumbs"
            rules={[{ required: true, message: "Please input the category breadcrumbs!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="parentCategoryId" label="Danh mục cha">
            <Select placeholder="Chọn danh mục cha" allowClear>
              {categories
                .filter((cat: any) => cat.parentCategoryId === null)
                .map((parentCat: any) => (
                  <Select.OptGroup key={`parent-${parentCat._id}`} label={parentCat.name}>
                    <Select.Option key={`opt-${parentCat._id}`} value={parentCat._id}>
                      {parentCat.name}
                    </Select.Option>
                    {categories
                      .filter((childCat: any) => childCat.parentCategoryId === parentCat._id)
                      .map((childCat: any) => (
                        <Select.Option key={childCat._id} value={childCat._id}>
                          {`-- ${childCat.name}`}
                        </Select.Option>
                      ))}
                  </Select.OptGroup>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default page;
