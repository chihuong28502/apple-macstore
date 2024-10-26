"use client";
import SkeletonGrid from "@/components/loadingComp";
import SkeletonOne from "@/components/loadingOne";
import { type ProductPage } from "@/type/product.page.type";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useState } from "react";
import Product from "./ProductCard";
import { StockInput } from "./StockInput";

export const ProductGrid: React.FC<ProductPage.ProductGridProps> = ({
  products,
  items,
  loading,
  categories,
  onAddProduct,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [specifications, setSpecifications] = useState({
    colors: [],
    storageOptions: [],
    ramOptions: [],
  });

  const handleSubmit = async (values: any) => {
    try {
      if (onAddProduct) {
        const stockMap = values.stock || new Map();

        const productData = {
          ...values,
          basePrice: Number(values.basePrice),
          price: Number(values.price),
          images: values.images || [],
          tags: values.tags || [],
          specifications: {
            models: values.specifications?.models || [],
            storageOptions: values.specifications?.storageOptions || [],
            ramOptions: values.specifications?.ramOptions || [],
            colors: values.specifications?.colors || [],
          },
          stock: stockMap,
          reviewsCount: 0,
          averageRating: 0,
        };

        await onAddProduct(productData);
        message.success("Thêm sản phẩm thành công");
        form.resetFields();
        setImageUrl("");
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  const renderForm = () => (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              placeholder="Chọn danh mục"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {categories
                ?.filter(
                  (cat) =>
                    !categories.some(
                      (child) => child.parentCategoryId === cat._id
                    )
                )
                .map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="basePrice"
            label="Giá gốc"
            rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
          >
            <InputNumber
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="Nhập giá gốc"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán"
            rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
          >
            <InputNumber
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="Nhập giá bán"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="images"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
          >
            <Select
              mode="tags"
              placeholder="Nhập URL hình ảnh"
              onChange={(value) => setImageUrl(value[value.length - 1])}
            />
          </Form.Item>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-2 max-w-full h-40 object-contain"
            />
          )}
        </div>

        <div>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Nhập tags cho sản phẩm" />
          </Form.Item>

          <Form.Item name={["specifications", "models"]} label="Dòng sản phẩm">
            <Select mode="tags" placeholder="Nhập dòng sản phẩm" />
          </Form.Item>

          <Form.Item
            name={["specifications", "storageOptions"]}
            label="Tùy chọn dung lượng"
          >
            <Select
              mode="tags"
              placeholder="Nhập các tùy chọn dung lượng"
              onChange={(value) =>
                setSpecifications((prev) => ({
                  ...prev,
                  storageOptions: value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            name={["specifications", "ramOptions"]}
            label="Tùy chọn RAM"
          >
            <Select
              mode="tags"
              placeholder="Nhập các tùy chọn RAM"
              onChange={(value) =>
                setSpecifications((prev) => ({
                  ...prev,
                  ramOptions: value,
                }))
              }
            />
          </Form.Item>

          <Form.Item name={["specifications", "colors"]} label="Màu sắc">
            <Select
              mode="tags"
              placeholder="Nhập các màu sắc"
              onChange={(value) =>
                setSpecifications((prev) => ({
                  ...prev,
                  colors: value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
        </div>
      </div>

      {specifications.colors.length > 0 &&
        specifications.ramOptions.length > 0 &&
        specifications.storageOptions.length > 0 && (
          <Form.Item name="stock" label="Số lượng tồn kho">
            <StockInput
              specifications={specifications}
              onChange={(value) => form.setFieldsValue({ stock: value })}
            />
          </Form.Item>
        )}

      <Form.Item className="mb-0 flex justify-end">
        <Button onClick={() => setIsModalOpen(false)} className="mr-2">
          Hủy
        </Button>
        <Button type="primary" htmlType="submit">
          Thêm sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <>
      {loading ? (
        <div className="w-full">
          <SkeletonOne rows={1} items={1} />
        </div>
      ) : (
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>
      )}

      {loading ? (
        <SkeletonGrid items={items} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}

      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
        className="overflow-y-auto"
      >
        {renderForm()}
      </Modal>
    </>
  );
};

export default ProductGrid;
