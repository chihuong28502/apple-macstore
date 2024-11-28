"use client";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { type ProductPage } from "@/type/product.page.type";
import { Pagination, Skeleton } from "antd";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { CategoryFilter } from "./components/CategoryFilter";
import { PriceFilter } from "./components/PriceFilter";
import { ProductGrid } from "./components/ProductGrid";

const ProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const categoryId: any = searchParams.get("categoryId");
  const allProducts = useSelector(
    ProductSelectors.productList
  ) as ProductPage.Product[];
  const totalProducts = useSelector(ProductSelectors.totalProducts) as number;
  const categories = useSelector(
    ProductSelectors.categories
  ) as ProductPage.Category[];
  const loadingCategories = useSelector(ProductSelectors.isLoadingCategories) as boolean;
  const loadingProducts = useSelector(ProductSelectors.isLoadingProducts) as boolean;
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000000]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRangeId, setSelectedRangeId] = useState<number>(0);
  const isFromCategoryChange = useRef<boolean>(false);

  const priceRanges: ProductPage.PriceRange[] = [
    { id: 0, label: "Mặc định", min: 0, max: 10000000000 },
    { id: 1, label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { id: 2, label: "10 - 20 triệu", min: 10000000, max: 20000000 },
    { id: 3, label: "20 - 30 triệu", min: 20000000, max: 30000000 },
    { id: 4, label: "30 - 40 triệu", min: 30000000, max: 40000000 },
    { id: 5, label: "Trên 40 triệu", min: 40000000, max: 100000000 },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(ProductActions.fetchCategories());
    };
    fetchCategories();
  }, [dispatch]);

  const fetchProducts = useCallback(
    (params: ProductPage.FetchProductsParams) => {
      dispatch(ProductActions.fetchPaginatedProducts(params));
    },
    [dispatch]
  );

  const debouncedFetchProducts = useCallback(
    debounce((params: ProductPage.FetchProductsParams) => {
      fetchProducts(params);
    }, 500),
    [fetchProducts]
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    isFromCategoryChange.current = true;
    fetchProducts({
      page: 1,
      limit: pageSize,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categoryId: categoryId !== "all" ? categoryId : undefined,
    });
  };

  useEffect(() => {
    if (isFromCategoryChange.current) {
      isFromCategoryChange.current = false;
      return;
    }
    debouncedFetchProducts({
      page: currentPage,
      limit: pageSize,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
    });
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [
    priceRange,
    currentPage,
    pageSize,
    selectedCategory,
    debouncedFetchProducts,
  ]);

  const handlePriceRangeChange = (range: ProductPage.PriceRange) => {
    setSelectedRangeId(range.id);
    setPriceRange([range.min, range.max]);
  };
  useEffect(() => {
    setSelectedCategory(categoryId)
  }, [searchParams])
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {loadingCategories ? (
          <Skeleton active />
        ) : (
          <BreadcrumbNav
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
            categories={categories}
            loading={loadingCategories}
          />
        )}

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          loading={loadingCategories}
        />

        <PriceFilter
          priceRanges={priceRanges}
          selectedRangeId={selectedRangeId}
          onPriceChange={handlePriceRangeChange}
          loading={loadingCategories}
        />

        {loadingProducts ? (
          <Skeleton active />
        ) : (
          <>
            <ProductGrid products={allProducts} loading={loadingProducts} />
            {totalProducts > pageSize && allProducts?.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalProducts}
                  onChange={(page: number, size: number) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  className="bg-white p-4 rounded-lg shadow-md"
                />
              </div>
            )}</>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
