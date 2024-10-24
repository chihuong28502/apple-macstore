"use client";
import Product from "@/components/Product/Product";
import { type ProductPage } from "@/type/product.page.type";
import { Card, Empty, Skeleton } from "antd";

export const ProductGrid: React.FC<ProductPage.ProductGridProps> = ({
  products,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="w-full">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <Card className="w-full text-center py-12">
        <Empty
          description="Không tìm thấy sản phẩm nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
};
