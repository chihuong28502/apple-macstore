import Link from 'next/link';

const products = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
  { id: 3, name: 'Product 3' }
];

export default function ProductPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-2">
            <Link href={`/product/${product.id}`}>
              <span className="text-blue-500 hover:underline">{product.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
