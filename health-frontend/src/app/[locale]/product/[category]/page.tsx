"use client";
import Product from "@/components/Product/Product";
import VARIABLE from "@/constants/constVar";
import { usePathname } from "@/i18n/routing";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Pagination, Slider, InputNumber } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const categoryName = pathname.replace("/product/", "");
  const totalProduct = useSelector(ProductSelectors.totalProducts);
  const allCategory = useSelector(ProductSelectors.categories);
  const allProducts = useSelector(ProductSelectors.productList);

  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [initialLoading, setInitialLoading] = useState(true);

  const filterByCategory = (categoryName: string) => {
    const category = allCategory?.find((cat: any) => cat.name === categoryName);
    return category ? category._id : null;
  };

  const debouncedFetchProducts = useCallback(
    debounce((page, pageSize, categoryId, priceRange) => {
      dispatch(
        ProductActions.fetchPaginatedProducts({
          page,
          limit: pageSize,
          categoryId,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        })
      );
    }, 500), [dispatch]
  );

  useEffect(() => {
    const categoryId = filterByCategory(categoryName);

    if (categoryId) {
      debouncedFetchProducts(currentPage, pageSize, categoryId, priceRange);
    }
  }, [currentPage, pageSize, categoryName, allCategory, priceRange, debouncedFetchProducts]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const onPriceChange = (value: number[]) => {
    setPriceRange(value); // Cập nhật khoảng giá khi người dùng thay đổi trên slider
  };

  return (
    <>
      <div className="flex justify-center items-center mb-4">
        <span className="mr-4">Filter by Price:</span>
        <Slider
          range
          min={0}
          max={5000000}
          step={100000}
          value={priceRange} 
          onChange={onPriceChange} 
          style={{ width: 200 }}
        />
        <InputNumber
          min={0}
          max={5000000}
          value={priceRange[0]}
          onChange={(value) => onPriceChange([value || 0, priceRange[1]])}
          style={{ margin: "0 16px" }}
        />
        <InputNumber
          min={0}
          max={5000000}
          value={priceRange[1]}
          onChange={(value) =>
            onPriceChange([priceRange[0], value || 5000000])
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-12">
        {allProducts?.map((product: any, index: any) => (
          <Product key={index} product={product} />
        ))}
      </div>
      <div className="flex justify-center my-3">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalProduct}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
}
