"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useDispatch();
  const productId = params.id;
  const productById = useSelector(ProductSelectors.product);

  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(ProductActions.fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productById?.images?.length) {
      setMainImage(productById.images[0]);
    }
  }, [productById]);

  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(undefined); // Reset lại size khi chọn màu khác
  };

  const getStockForSelectedColorAndSize = () => {
    if (selectedColor && selectedSize) {
      return productById?.stock?.[selectedColor]?.[selectedSize] || 0;
    }
    return 0;
  };

  const availableSizesForSelectedColor = () => {
    if (selectedColor) {
      return Object.keys(productById?.stock?.[selectedColor] || {});
    }
    return [];
  };

  // Hàm render các tùy chỉnh chung (màu sắc và kích cỡ)
  const renderCustomizations = () => {
    // Kiểm tra nếu có customizations.colors, nếu không có thì kiểm tra trong stock
    const colors = productById?.customizations?.colors?.length
      ? productById?.customizations.colors
      : Object.keys(productById?.stock || {});

    return (
      <>
        {/* Màu sắc của sản phẩm */}
        {colors?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Flavors/Colors</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {colors.map((color: string) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorClick(color)}
                  className={`w-12 h-11 border-2 ${
                    selectedColor === color
                      ? "border-gray-800" // Thêm viền khi màu được chọn
                      : "border-white"
                  } hover:border-gray-800 rounded-lg`}
                >
                  1123
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kích cỡ của sản phẩm dựa trên màu đã chọn */}
        {selectedColor && availableSizesForSelectedColor()?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Available Sizes</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {availableSizesForSelectedColor().map((size: string) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeClick(size)}
                  className={`w-12 h-11 border-2 ${
                    selectedSize === size
                      ? "border-gray-800" // Thêm viền khi size được chọn
                      : "border-gray-300"
                  } hover:border-gray-800 font-semibold text-xs text-gray-800 rounded-lg flex items-center justify-center`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Hiển thị tồn kho cho kích cỡ đã chọn */}
            {selectedSize && (
              <p className="mt-2 text-gray-600">
                Stock available: {getStockForSelectedColorAndSize()}
              </p>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="font-sans p-4 max-w-6xl max-md:max-w-xl mx-auto">
      <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full lg:sticky top-0 flex gap-3">
          {/* Hình ảnh chính của sản phẩm */}
          <img
            src={mainImage}
            alt={productById?.name}
            className="w-3/4 rounded-lg object-cover"
          />

          {/* Hình ảnh nhỏ (thumbnail) */}
          <div className="w-20 flex flex-col gap-3">
            {productById?.images?.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index}`}
                className="w-full cursor-pointer rounded-lg"
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>

        <div>
          {/* Tên sản phẩm */}
          <h2 className="text-2xl font-bold text-gray-800">
            {productById?.name}
          </h2>

          {/* Mô tả sản phẩm */}
          <p className="mt-2 text-gray-600">{productById?.description}</p>

          {/* Giá của sản phẩm */}
          <h3 className="text-gray-800 text-4xl mt-8 font-bold">
            {productById?.price?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </h3>

          {/* Render chung các tùy chọn sản phẩm */}
          {renderCustomizations()}

          {/* Nút thêm vào giỏ hàng */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              className="flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white border border-gray-800 text-base rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
