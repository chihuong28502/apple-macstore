"use client";
import { getCache } from "@/cache/cacheLocal";
import { AuthSelectors } from "@/modules/auth/slice";
import { CartActions } from "@/modules/cart/slice";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomizationOptions from "../components/CustomizationOptions";

interface Variant {
  color: string;
  colorCode: string;
  ram: string;
  ssd: string;
  price: number;
  availableStock: number;
  stock: number;
  _id: string;
}

interface Image {
  image: string;
}

interface Product {
  name: string;
  description: string;
  images: Image[];
  variants: Variant[];
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const productId = params.id;
  const productById: Product | undefined = useSelector(ProductSelectors.product);
  const auth = useSelector(AuthSelectors.user);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedRam, setSelectedRam] = useState<string | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    // const cachedProduct = getCache("productById");
    // if (cachedProduct && cachedProduct._id === productId) {
    //   dispatch(ProductActions.setProduct(cachedProduct));
    //   return;
    // }
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
    resetSelections();
    setQuantity(0);
  };

  const handleRamClick = (ram: string) => {
    setSelectedRam(ram);
    setQuantity(0);
  };

  const handleStorageClick = (storage: string) => {
    setSelectedStorage(storage);
    setQuantity(0);
  };

  const resetSelections = () => {
    setSelectedRam(undefined);
    setSelectedStorage(undefined);
  };

  const getVariantsForSelectedColor = () => {
    return productById?.variants?.filter((variant: Variant) => variant.color === selectedColor) || [];
  };

  const availableRamsForSelectedColor = () => {
    const variants = getVariantsForSelectedColor();
    const rams = Array.from(new Set(variants.map((variant: Variant) => variant.ram)));
    return rams;
  };

  const availableStorageForSelectedRamAndColor = () => {
    const variants = getVariantsForSelectedColor();
    const storages = Array.from(
      new Set(variants.filter((variant: Variant) => variant.ram === selectedRam).map((variant: Variant) => variant.ssd))
    );
    return storages;
  };

  const getStockForSelectedOptions = () => {
    return getVariantsForSelectedColor().find(
      (variant: Variant) => variant.ram === selectedRam && variant.ssd === selectedStorage
    );
  };

  const handleAddToCart = () => {
    // Kiểm tra nếu đã chọn đầy đủ màu sắc, RAM và lưu trữ
    if (!selectedColor || !selectedRam || !selectedStorage) {
      return;
    }

    // Tìm variant tương ứng với các lựa chọn
    const selectedStock = getStockForSelectedOptions();

    if (selectedStock) {
      // Tạo sản phẩm cần thêm vào giỏ hàng với chỉ productId, variantId và quantity
      const productToAdd = {
        productId: productId, // ID sản phẩm
        variantId: selectedStock._id, // ID variant (stockId)
        quantity: quantity > selectedStock.stock ? selectedStock.stock : quantity, // Số lượng, giới hạn với số tồn kho
      };

      dispatch(
        CartActions.addProductToCart({
          id: auth._id, // ID người dùng
          item: productToAdd, // Sản phẩm cần thêm
        })
      );
    } else {
    }
  };

  const handleIncreaseQuantity = () => {
    const selectedStock = getStockForSelectedOptions();
    if (selectedStock?.availableStock === 0) {
      setQuantity(0)
    }
    if (quantity < (selectedStock?.availableStock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity >= 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div
      style={{ minHeight: 'calc(100vh - 97px)' }}
      className="font-sans p-4 max-w-6xl max-md:max-w-xl mx-auto">
      <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-6">
        <div className="lg:sticky top-0 flex gap-3 w-full">
          <img
            src={mainImage}
            alt={productById?.name}
            className="w-3/4 rounded-lg object-cover shadow-lg"
          />
          <div className="w-20 flex flex-col gap-3">
            {productById?.images?.map((image: Image, index: number) => (
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
          <div className="flex flex-wrap gap-2">
            <h3 className="text-xl font-bold text-fontColor">Colors: </h3>
            {Array.from(
              new Map(
                productById?.variants?.map((variant: Variant) => [variant.color, variant.colorCode])
              )
            ).map(([color, colorCode]) => (
              <Tooltip title={color} key={color}>
                <button
                  type="button"
                  onClick={() => handleColorClick(color)}
                  className={`rounded-full p-3 border-2 transition-all duration-300 ${selectedColor === color ? "border-fontColor" : ""}`}
                  style={{ backgroundColor: colorCode }}
                />
              </Tooltip>
            ))}
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
                    <p className="text-[#999]">Tồn kho: {selectedStock.availableStock} sản phẩm</p>
                  </>
                ) : null;
              })()}
            </div>
          )}

          <div className="mt-5 flex items-center gap-4">
            <button onClick={handleDecreaseQuantity} className="px-3 bg-layout rounded text-fontColor font-bold">-</button>
            <span className="text-lg font-bold text-fontColor">{quantity}</span>
            <button onClick={handleIncreaseQuantity} className="px-3 bg-layout rounded text-fontColor font-bold">+</button>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              disabled={(quantity == 0)}
              type="button"
              className={`${quantity === 0 ? "disabled opacity-70 cursor-not-allowed" : "hover:bg-gray-900"} flex items-center justify-center px-8 py-4 bg-gray-800  text-white border border-gray-800 text-base rounded-lg shadow-md transition duration-300`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
