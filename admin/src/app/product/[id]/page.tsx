"use client";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Space, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { TextArea } = Input;

interface IStock {
  [key: string]: any;
}

interface IImage {
  image: string;
  publicId?: string;
  _id?: string;
}

interface IStockItem {
  key: string;
  quantity: number;
  price: number;
  basePrice: number;
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Helpers
  const transformStock = (stockData: IStock) => {
    const transformedStock: IStockItem[] = [];
    for (const color in stockData) {
      for (const model in stockData[color]) {
        for (const size in stockData[color][model]) {
          transformedStock.push({
            key: `${color}-${model}-${size}`,
            quantity: stockData[color][model][size].quantity,
            price: stockData[color][model][size].price || 0,
            basePrice: stockData[color][model][size].basePrice || 0,
          });
        }
      }
    }
    return transformedStock;
  };

  const transformImages = (images: IImage[]) => {
    return images.map((img) => img.image);
  };

  const processUpdatedImages = (values: IProduct): IImage[] => {
    return (values.images as IImage[]).map((imgData: IImage) => ({
      image: typeof imgData === "string" ? imgData : imgData.image,
    }));
  };

  const processUpdatedStock = (stockItems: IStockItem[]): IStock => {
    const updatedStock: IStock = {};

    stockItems.forEach((item) => {
      // Tách key thành color, storage và size
      const [color, storage, size] = item.key.split("-");

      // Kiểm tra tồn tại color trong updatedStock
      if (!updatedStock[color]) {
        updatedStock[color] = {};
      }

      // Kiểm tra tồn tại storage trong updatedStock[color]
      if (!updatedStock[color][storage]) {
        updatedStock[color][storage] = {};
      }

      // Thêm quantity và price vào updatedStock[color][storage][size]
      updatedStock[color][storage][size] = {
        quantity: item.quantity,
        price: item.price,
        basePrice:item.basePrice,
      };
    });

    return updatedStock;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Event Handlers
  const handleImageChange = async ({ fileList: newFileList }: any) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file: UploadFile) => {
        if (file.originFileObj) {
          const base64Image = await convertToBase64(file.originFileObj);
          return {
            ...file,
            url: base64Image,
            thumbUrl: base64Image,
          };
        }
        return file;
      })
    );
    setFileList(updatedFileList);
    form.setFieldsValue({ images: updatedFileList.map((file) => file.url) });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...fileList];
    updatedImages.splice(index, 1);
    setFileList(updatedImages);
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
    if (productById?.images) {
      const initialFileList = productById.images.map((img: IImage, index: number) => ({
        uid: String(index),
        name: `image-${index}`,
        status: "done",
        url: img.image,
        thumbUrl: img.image,
        originFileObj: null,
      }));
      setFileList(initialFileList);
    }
  }, [productById]);

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
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-6">
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
                  <Select.Option value="671e3c778a8054ab857d90fa">Category 1</Select.Option>
                  <Select.Option value="category2">Category 2</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Sale Price"
                rules={[{ required: true, message: "Please enter sale price" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  placeholder="Enter sale price"
                />
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Enter tags" />
              </Form.Item>
            </div>

            <div>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Enter product description" />
              </Form.Item>

              <Form.Item name="images" label="Images">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                  onRemove={(file) => handleRemoveImage(fileList.indexOf(file))}
                >
                  {fileList.length < 8 && <Button>Select Images</Button>}
                </Upload>
              </Form.Item>

              <Form.Item name={["specifications", "models"]} label="models">
                <Select mode="tags" placeholder="Enter models" />
              </Form.Item>
              <Form.Item name={["specifications", "storageOptions"]} label="storageOptions">
                <Select mode="tags" placeholder="Enter storageOptions" />
              </Form.Item>
              <Form.Item name={["specifications", "ramOptions"]} label="ramOptions">
                <Select mode="tags" placeholder="Enter ramOptions" />
              </Form.Item>
              <Form.Item name={["specifications", "colors"]} label="colors">
                <Select mode="tags" placeholder="Enter colors" />
              </Form.Item>
            </div>
          </div>

          <Form.List name="stock">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      fieldKey={[fieldKey as any, "key"]}
                      rules={[{ required: true, message: "Missing stock item" }]}
                    >
                      <Input placeholder="Color-Model-Size" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      fieldKey={[fieldKey as any, "quantity"]}
                      rules={[{ required: true, message: "Missing quantity" }]}
                    >
                      <InputNumber placeholder="Quantity" min={0} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      fieldKey={[fieldKey as any, "price"]}
                      rules={[{ required: true, message: "Missing price" }]}
                    >
                      <InputNumber placeholder="Price" min={0} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "basePrice"]}
                      fieldKey={[fieldKey as any, "basePrice"]}
                      rules={[{ required: true, message: "Missing basePrice" }]}
                    >
                      <InputNumber placeholder="basePrice" min={0} />
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
                    Add Stock Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
