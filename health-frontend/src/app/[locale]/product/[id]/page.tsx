import { useRouter } from 'next/router';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  // Dữ liệu giả lập cho sản phẩm (trong thực tế sẽ lấy từ API hoặc database)
  const product = {
    id: productId,
    name: `Product ${productId}`,
    description: `This is the detail of Product ${productId}`
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product {product.name}</h1>
      <p>{product.description}</p>
      <p>ID: {product.id}</p>
    </div>
  );
}
