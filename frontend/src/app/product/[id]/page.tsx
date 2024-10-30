"use client";
import { extractColorCode, extractColorName } from "@/lib/utils";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomizationOptions from "../components/CustomizationOptions";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const productId = params.id;
  const productById = useSelector(ProductSelectors.product);

  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedRam, setSelectedRam] = useState<string | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);
  const [isFirstSelection, setIsFirstSelection] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productFromLocalStorageString = localStorage.getItem('productById');
    if (productFromLocalStorageString) {
      const productFromLocalStorage: any = JSON.parse(productFromLocalStorageString);
      if (productId === productFromLocalStorage._id) {
        dispatch(ProductActions.setProduct(productFromLocalStorage));
        return;
      }
    }
    dispatch(ProductActions.fetchProductById(productId));
  }, [dispatch, productId]);


  useEffect(() => {
    if (productById?.images?.length) {
      setMainImage(productById.images[0].image);
    }
  }, [productById]);

  const handleImageClick = (imageUrl: string) => setMainImage(imageUrl);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    if (isFirstSelection) {
      resetSelections();
      setIsFirstSelection(false);
    }
    setQuantity(1); // Reset quantity về 1 khi thay đổi màu sắc
  };

  const handleRamClick = (ram: string) => {
    setSelectedRam(ram);
    setQuantity(1); // Reset quantity về 1 khi thay đổi RAM
  };

  const handleStorageClick = (storage: string) => {
    setSelectedStorage(storage);
    setQuantity(1); // Reset quantity về 1 khi thay đổi dung lượng lưu trữ
  };


  const resetSelections = () => {
    setSelectedRam(undefined);
    setSelectedStorage(undefined);
  };

  const getStockForSelectedOptions = () => {
    return selectedColor && selectedRam && selectedStorage
      ? productById?.stock?.[selectedColor]?.[selectedRam]?.[selectedStorage] || {}
      : {};
  };

  const availableRamsForSelectedColor = () => {
    return selectedColor ? productById?.specifications?.ramOptions || [] : [];
  };

  const availableStorageForSelectedRamAndColor = () => {
    return selectedColor && selectedRam
      ? Object.keys(productById?.stock?.[selectedColor]?.[selectedRam] || {})
      : [];
  };

  useEffect(() => {
    const colors = productById?.specifications?.colors || [];
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
      const rams = availableRamsForSelectedColor();
      if (rams.length > 0) setSelectedRam(rams[0]);
      const storages = availableStorageForSelectedRamAndColor();
      if (storages.length > 0) setSelectedStorage(storages[0]);
    }
  }, [productById]);

  useEffect(() => {
    if (selectedColor) {
      const rams = availableRamsForSelectedColor();
      if (rams.length > 0 && selectedRam === undefined) {
        setSelectedRam(rams[0]);
      }
    }
  }, [selectedColor]);

  useEffect(() => {
    if (selectedColor && selectedRam) {
      const storages = availableStorageForSelectedRamAndColor();
      if (storages.length > 0 && selectedStorage === undefined) {
        setSelectedStorage(storages[0]);
      }
    }
  }, [selectedColor, selectedRam]);

  const handleAddToCart = () => {
    const selectedStock = getStockForSelectedOptions();
    if (selectedStock && selectedStock.price) {
      const productToAdd = {
        id: productId,
        color: selectedColor,
        ram: selectedRam,
        storage: selectedStorage,
        price: selectedStock.price,
        quantity: quantity > selectedStock.quantity ? selectedStock.quantity : quantity, // Giới hạn số lượng
      };
      console.log("🚀 ~ productToAdd:", productToAdd)
      // dispatch(ProductActions.addToCart(productToAdd)); // Dispatch action thêm vào giỏ hàng
    }
  };

  const handleIncreaseQuantity = () => {
    const selectedStock = getStockForSelectedOptions();
    if (quantity < (selectedStock?.quantity || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="font-sans p-4 max-w-6xl max-md:max-w-xl mx-auto">
      <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-6">
        <div className="lg:sticky top-0 flex gap-3 w-full">
          <img
            src={mainImage}
            alt={productById?.name}
            className="w-3/4 rounded-lg object-cover shadow-lg"
          />
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
          <h2 className="text-2xl font-bold text-fontColor">{productById?.name}</h2>
          <p className="text-[#d02525]">{productById?.description}</p>
          <div className="mt-5 flex items-center gap-3">
            <h3 className="text-xl font-bold text-fontColor">Colors:</h3>
            <div className="flex flex-wrap gap-2">
              {productById?.specifications?.colors?.map((color: string) => {
                const colorCode: any = extractColorCode(color);
                return (
                  <Tooltip title={extractColorName(color)} key={color}>
                    <button
                      style={{ backgroundColor: colorCode }}
                      type="button"
                      onClick={() => handleColorClick(color)}
                      className={`rounded-full p-3 !text-black border-2 transition-all duration-300 ${selectedColor === color ? "border-white" : ""}`}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {selectedColor && (
            <CustomizationOptions
              label="Available RAM"
              options={availableRamsForSelectedColor()}
              handleClick={handleRamClick}
              selectedOption={selectedRam}
            />
          )}

          {selectedColor && selectedRam && (
            <CustomizationOptions
              label="Available Storage"
              options={availableStorageForSelectedRamAndColor()}
              handleClick={handleStorageClick}
              selectedOption={selectedStorage}
            />
          )}

          {selectedColor && selectedRam && selectedStorage && (
            <div className="mt-5">
              {(() => {
                const selectedStock = getStockForSelectedOptions();
                return selectedStock && selectedStock.price ? (
                  <>
                    <p className="text-lg font-bold !text-black">
                      Giá: {selectedStock.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p className="text-[#999]">Tồn kho: {selectedStock.quantity} sản phẩm</p>
                  </>
                ) : null;
              })()}
            </div>
          )}

          <div className="mt-5 flex items-center gap-4">
            <button onClick={handleDecreaseQuantity} className="px-3 py-2 bg-gray-200 rounded">-</button>
            <span className="text-lg font-bold">{quantity}</span>
            <button onClick={handleIncreaseQuantity} className="px-3 py-2 bg-gray-200 rounded">+</button>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
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
