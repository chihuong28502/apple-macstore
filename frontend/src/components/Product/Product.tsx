"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Product({ product }: any) {
  const router = useRouter();
  const handleNextProductDetail = () => {
    router.push(`product/${product._id}`);
  };
  return (
    <div
      key={product?._id}
      onClick={product?.isPublic !== false ? handleNextProductDetail : undefined}
      className={`${product?.isPublic === false
        ? 'cursor-not-allowed opacity-50 bg-gray-300'
        : ''
        } bg-gray-100 shadow-md p-2 rounded-lg group overflow-hidden cursor-pointer relative z-10 hover:bg-gray-200`}>
      <div className="w-full overflow-hidden mx-auto aspect-w-16 aspect-h-8 transition-transform duration-300 ease-in-out transform group-hover:-translate-y-1.5">
        <Image
          width={300}
          height={300}
          src={product?.images[0].image}
          alt={product?.name}
          className="object-contain rounded-lg"
        />
      </div>

      <div className="mx-auto left-0 right-0 -bottom-80 group-hover:bottom-2 py-1 rounded-lg transition-all duration-300">
        <div className="text-center">
          <h3 className="text-base font-bold text-gray-800">{product?.name}</h3>
          <h4 className="text-lg text-[red] font-bold">
            {product?.price.toLocaleString()} VNĐ
          </h4>
        </div>

        <div className="flex justify-center space-x-1 mt-2">
          {[...Array(4)].map((_, i) => (
            <svg
              key={i}
              className="w-4 fill-[#facc15]"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
            </svg>
          ))}
          <svg
            className="w-4 fill-[#CED5D8]"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Product;
