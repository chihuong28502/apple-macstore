'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductSelectors, ProductActions } from '@/modules/product/slice';
import Image from 'next/image';

interface ProductDetailPageProps {
  params: { id: string };
}

interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  price: number;
  images: string[];
  tags: string[];
  customizations: {
    colors: string[];
    sizes: number[];
    materials: string[];
    personalizationOptions: {
      addName: boolean;
      addLogo: boolean;
    };
  };
  stock: { [key: number]: number };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const dispatch = useDispatch();
  const productId = params.id;
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  // Lấy sản phẩm từ Redux store
  const product = useSelector(ProductSelectors.product) as Product | null;
  const isLoading = useSelector(ProductSelectors.isLoading);

  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(ProductActions.fetchProductById({ 
        id: productId,
        onSuccess: (data: Product) => console.log("Product loaded:", data),
        onFail: (error: Error) => console.error("Failed to load product:", error),
      }));
    }
  }, [dispatch, productId, product]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="font-sans">
      <div className="p-4 lg:max-w-5xl max-w-lg mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-6 max-lg:gap-12">
          {/* Product Images */}
          <div className="w-full lg:sticky top-0 sm:flex gap-2">
            <div className="sm:space-y-3 w-16 max-sm:w-12 max-sm:flex max-sm:mb-4 max-sm:gap-4">
              {product.images.map((img, index) => (
                <Image 
                  key={index}
                  src={img}
                  alt={`Product ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full cursor-pointer rounded-md"
                />
              ))}
            </div>
            {product.images.length > 0 && (
              <Image 
                src={product.images[0]}
                alt="Product"
                width={320}
                height={400}
                className="w-4/5 rounded-md object-cover"
              />
            )}
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <p className="text-gray-800 text-xl font-bold">${(product.price / 1000).toFixed(3)}</p>
              <p className="text-gray-400 text-xl">
                <span>${(product.basePrice / 1000).toFixed(3)}</span> 
                <span className="text-sm ml-1.5">Tax included</span>
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Colors */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Colors</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {product.customizations.colors.map((color) => (
                  <button 
                    key={color}
                    type="button" 
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Sizes</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {product.customizations.sizes.map((size) => (
                  <button 
                    key={size}
                    type="button" 
                    className={`px-4 py-2 border-2 ${selectedSize === size ? 'border-blue-600' : 'border-gray-300'} font-semibold text-sm rounded-md flex flex-col items-center justify-center`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span>{size}</span>
                    <span className="text-xs text-gray-500">({product.stock[size] || 0} left)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Options */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Personalization</h3>
              <div className="mt-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={product.customizations.personalizationOptions.addName} readOnly className="mr-2" />
                  Add Name
                </label>
                <label className="flex items-center mt-2">
                  <input type="checkbox" checked={product.customizations.personalizationOptions.addLogo} readOnly className="mr-2" />
                  Add Logo
                </label>
              </div>
            </div>

            <button type="button" className="w-full mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md">
              Add to cart
            </button>

            {/* About the item */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">About the item</h3>
              <p className="mt-4 text-sm text-gray-800">{product.description}</p>
            </div>

            {/* Materials */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Materials</h3>
              <ul className="list-disc pl-5 mt-4">
                {product.customizations.materials.map((material, index) => (
                  <li key={index} className="text-sm text-gray-800">{material}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}