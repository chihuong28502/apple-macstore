"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  price: number;
  categoryId: string;
  images: string[];
  tags: string[];
  specifications: {
    [key: string]: string | number;
  };
  reviewsCount: number;
  averageRating: number;
  stock: {
    [key: string]: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useDispatch();
  const productById = useSelector(ProductSelectors.product);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<IProduct>({
    _id: "",
    name: "",
    description: "",
    basePrice: 0,
    price: 0,
    categoryId: "",
    images: [],
    tags: [],
    specifications: {},
    reviewsCount: 0,
    averageRating: 0,
    stock: {},
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    dispatch(ProductActions.fetchProductById(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (productById) {
      setFormData(productById);
    }
  }, [productById]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle price changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // Handle stock changes
  const handleStockChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [key]: Number(value),
      },
    }));
  };

  // Handle specifications changes
  const handleSpecificationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  // Handle tags
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(
        ProductActions.updateProduct({
          id: params.id,
          data: formData,
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
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-mainContent rounded-lg shadow-lg p-6 ">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-fontColor mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fontColor mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-fontColor mb-1">
                        Base Price
                      </label>
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handlePriceChange}
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-fontColor mb-1">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handlePriceChange}
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Management */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Stock Management</h2>

                <div className="space-y-4">
                  {Object.entries(formData.stock).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-4">
                      <span className="w-24 text-sm font-medium">{key}:</span>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleStockChange(key, e.target.value)}
                        className="w-24 rounded-md border px-3 py-1"
                      />
                    </div>
                  ))}

                  {/* Add new stock item */}
                  <button
                    type="button"
                    onClick={() => {
                      /* Add logic to add new stock item */
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Stock Item
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Specifications */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Specifications</h2>

                <div className="space-y-4">
                  {Object.entries(formData.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-4">
                        <span className="text-sm font-medium">{key}:</span>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleSpecificationChange(key, e.target.value)
                          }
                          className="col-span-2 rounded-md border px-3 py-1"
                        />
                      </div>
                    )
                  )}

                  {/* Add new specification */}
                  <button
                    type="button"
                    onClick={() => {
                      /* Add logic to add new specification */
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Specification
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={handleTagChange}
                  placeholder="Enter tags separated by commas"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              {/* Images */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Product Images</h2>

                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => () => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-fontColor rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mt-4"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => history.back()}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-fontColor rounded-lg ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
