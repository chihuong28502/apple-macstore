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
  console.log("🚀 ~ productById:", productById);

  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedRam, setSelectedRam] = useState<string | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(ProductActions.fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productById?.images?.length) {
      setMainImage(productById.images[0].image);
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
    setSelectedRam(undefined); // Reset RAM khi chọn màu khác
    setSelectedStorage(undefined); // Reset dung lượng khi chọn màu khác
  };

  const handleRamClick = (ram: string) => {
    setSelectedRam(ram);
  };

  const handleStorageClick = (storage: string) => {
    setSelectedStorage(storage);
  };

  const getStockForSelectedOptions = () => {
    if (selectedColor && selectedRam && selectedStorage) {
      return productById?.stock?.[selectedColor]?.[selectedRam]?.[selectedStorage] || {};
    }
    return {};
  };

  const availableSizesForSelectedColor = () => {
    if (selectedColor) {
      return Object.keys(productById?.stock?.[selectedColor] || {});
    }
    return [];
  };

  const availableRamsForSelectedColor = () => {
    if (selectedColor) {
      return productById?.specifications?.ramOptions || [];
    }
    return [];
  };

  const availableStorageForSelectedRamAndColor = () => {
    if (selectedColor && selectedRam) {
      return Object.keys(productById?.stock?.[selectedColor]?.[selectedRam] || {});
    }
    return [];
  };

  // Hàm render các tùy chỉnh chung (màu sắc, kích cỡ, RAM và dung lượng)
  const renderCustomizations = () => {
    const colors = productById?.specifications?.colors || [];

    return (
      <>
        {/* Màu sắc của sản phẩm */}
        {colors.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-fontColor">Colors</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {colors.map((color: string) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorClick(color)}
                  className={`w-12 h-11 border-2 rounded-lg transition-all duration-300 ${selectedColor === color
                      ? "border-gray-800 bg-gray-200"
                      : "border-white bg-white"
                    } hover:border-gray-800 hover:bg-gray-100`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RAM của sản phẩm dựa trên màu đã chọn */}
        {selectedColor && availableRamsForSelectedColor().length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-fontColor">Available RAM</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {availableRamsForSelectedColor().map((ram: string) => (
                <button
                  key={ram}
                  type="button"
                  onClick={() => handleRamClick(ram)}
                  className={`w-12 h-11 border-2 rounded-lg transition-all duration-300 ${selectedRam === ram
                      ? "border-gray-800 bg-gray-200"
                      : "border-gray-300 bg-white"
                    } hover:border-gray-800 hover:bg-gray-100 font-semibold text-xs text-fontColor flex items-center justify-center`}
                >
                  {ram} GB
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dung lượng lưu trữ của sản phẩm dựa trên màu và RAM đã chọn */}
        {selectedColor && selectedRam && availableStorageForSelectedRamAndColor().length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-fontColor">Available Storage</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {availableStorageForSelectedRamAndColor().map((storage: string) => (
                <button
                  key={storage}
                  type="button"
                  onClick={() => handleStorageClick(storage)}
                  className={`w-12 h-11 border-2 rounded-lg transition-all duration-300 ${selectedStorage === storage
                      ? "border-gray-800 bg-gray-200"
                      : "border-gray-300 bg-white"
                    } hover:border-gray-800 hover:bg-gray-100 font-semibold text-xs text-fontColor flex items-center justify-center`}
                >
                  {storage} GB
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị giá cho tùy chọn đã chọn */}
        {selectedColor && selectedRam && selectedStorage && (
          <div className="mt-4">
            {(() => {
              const selectedStock = getStockForSelectedOptions();
              return (
                selectedStock && selectedStock.price && (
                  <>
                    <p className="text-lg font-bold">
                      Giá: {selectedStock.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p className="text-[#999]">
                      Tồn kho: {selectedStock.quantity} sản phẩm
                    </p>
                  </>
                )
              );
            })()}
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
            className="w-3/4 rounded-lg object-cover shadow-lg"
          />

          {/* Hình ảnh nhỏ (thumbnail) */}
          <div className="w-20 flex flex-col gap-3">
            {productById?.images?.map((image: { image: string }, index: number) => (
              <img
                key={index}
                src={image.image}
                alt={`Product Image ${index}`}
                className="w-full cursor-pointer rounded-lg hover:opacity-75 transition-opacity"
                onClick={() => handleImageClick(image.image)}
              />
            ))}
          </div>
        </div>

        <div>
          {/* Tên sản phẩm */}
          <h2 className="text-2xl font-bold text-fontColor">
            {productById?.name}
          </h2>

          <p className="mt-2 text-fontColor">{productById?.description}</p>

          {/* Giá của sản phẩm */}
          <h3 className="text-fontColor text-4xl mt-8 font-bold">
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
              className="flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white border border-gray-800 text-base rounded-lg shadow-md transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
