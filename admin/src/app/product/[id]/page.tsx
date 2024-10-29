"use client";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Space, Upload } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProductActions, ProductSelectors } from "@/modules/product/slice";

const { TextArea } = Input;

interface IStock {
  [key: string]: any;
}

interface IImage {
  image: string;
  publicId: string;
  _id?: string;
}

interface IStockItem {
  key: string;
  quantity: number;
  price: number; // Thêm thuộc tính price vào stock item
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  price: number;
  categoryId: string;
  images: IImage[];
  tags: string[];
  specifications: {
    [key: string]: string | number;
  };
  reviewsCount: number;
  averageRating: number;
  stock: IStockItem[];
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const productById = useSelector(ProductSelectors.product);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helpers
  const transformStock = (stockData: IStock) => {
    const transformedStock: IStockItem[] = [];
    for (const color in stockData) {
      for (const model in stockData[color]) {
        transformedStock.push({
          key: `${color}-${model}`,
          quantity: stockData[color][model].quantity,
          price: stockData[color][model].price || 0, // Lấy giá từ stock
        });
      }
    }
    return transformedStock;
  };

  const transformImages = (images: IImage[]) => {
    return images.map(img => img.image);
  };

  const processUpdatedImages = (values: IProduct): IImage[] => {
    return (values.images as IImage[]).map((imgData: IImage, index: number) => ({
      image: typeof imgData === 'string' ? imgData : imgData.image,
      publicId: productById?.images[index]?.publicId || "",
      _id: productById?.images[index]?._id || "",
    }));
  };

  const processUpdatedStock = (stockItems: IStockItem[]): IStock => {
    const updatedStock: IStock = {};

    stockItems.forEach((item) => {
      const [color, model] = item.key.split("-");
      if (!updatedStock[color]) {
        updatedStock[color] = {};
      }
      updatedStock[color][model] = {
        quantity: item.quantity,
        price: item.price, // Lưu giá vào stock
      };
    });

    return updatedStock;
  };

  // Event Handlers
  const handleImageChange = (info: any) => {
    const fileList = info.fileList.map((file: any) => file.originFileObj);
    form.setFieldsValue({ images: fileList });
  };

  const handleSubmit = async (values: IProduct) => {
    setIsSubmitting(true);
    try {
      const updatedImages = processUpdatedImages(values);
      const updatedStock = processUpdatedStock(values.stock);

      await dispatch(
        ProductActions.updateProduct({
          id: params.id,
          data: {
            ...values,
            images: updatedImages,
            stock: updatedStock,
          },
        })
      );
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    dispatch(ProductActions.fetchProductById(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (productById) {
      const transformedStock = transformStock(productById.stock as IStock);
      form.setFieldsValue({
        ...productById,
        images: transformImages(productById.images),
        stock: transformedStock,
      });
    }
  }, [productById, form]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-mainContent rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="category1">Category 1</Select.Option>
                  <Select.Option value="category2">Category 2</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="basePrice"
                label="Base Price"
                rules={[{ required: true, message: "Please enter base price" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  placeholder="Enter base price"
                />
              </Form.Item>

              <Form.Item
                name="price"
                label="Sale Price"
                rules={[{ required: true, message: "Please enter sale price" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  placeholder="Enter sale price"
                />
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Enter tags" />
              </Form.Item>
            </div>

            {/* Right Column */}
            <div>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Enter product description" />
              </Form.Item>

              <Form.Item name="images" label="Images">
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                >
                  <Button>Select Images</Button>
                </Upload>
                {productById?.images?.map((item:any, index:number) => {
                  return (

                    <img key={index} src={item?.image} alt={item._id} />
                  )
                })}
              </Form.Item>

              <Form.Item
                name={["specifications", "models"]}
                label="Product Models"
              >
                <Select mode="tags" placeholder="Enter product models" />
              </Form.Item>

              <Form.Item
                name={["specifications", "storageOptions"]}
                label="Storage Options"
              >
                <Select mode="tags" placeholder="Enter storage options" />
              </Form.Item>

              <Form.Item
                name={["specifications", "colors"]}
                label="Colors"
              >
                <Select mode="tags" placeholder="Enter colors" />
              </Form.Item>

              <Form.List name="stock">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} align="baseline" className="w-full">
                        <Form.Item
                          {...restField}
                          name={[name, "key"]}
                          fieldKey={[fieldKey as any, "key"]}
                          label="Variant"
                          rules={[{ required: true, message: "Please enter stock variant" }]}
                          className=""
                        >
                          <Input placeholder="Variant (e.g., Color-RAM-Storage)" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          fieldKey={[fieldKey as any, "quantity"]}
                          label="Quantity"
                          rules={[{ required: true, message: "Please enter quantity" }]}
                          className=""
                        >
                          <InputNumber
                            placeholder="Quantity"
                            min={0}
                            className="w-full"
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          fieldKey={[fieldKey as any, "price"]}
                          label="Price"
                          rules={[{ required: true, message: "Please enter price" }]}
                          className=""
                        >
                          <InputNumber
                            placeholder="Price"
                            min={0}
                            className="w-full"
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                          />
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Stock
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
