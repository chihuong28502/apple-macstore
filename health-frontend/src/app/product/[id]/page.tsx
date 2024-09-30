'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductSelectors, ProductActions } from '@/modules/product/slice';
import { useRouter } from 'next/router';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const productId = params.id;

  // Lấy sản phẩm từ Redux store
  const product = useSelector(ProductSelectors.product);
  console.log("🚀 ~ product:", product)
  const isLoading = useSelector(ProductSelectors.isLoading);

  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(ProductActions.fetchProductById({ 
        id: productId,
        onSuccess: (data) => console.log("Product loaded:", data),
        onFail: (error) => console.error("Failed to load product:", error),
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product {product.name}</h1>
      <p>{product.description}</p>
      <p>ID: {product._id}</p>
    </div>
  );
}
