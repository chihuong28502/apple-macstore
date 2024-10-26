"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Skeleton, message } from "antd";
import { debounce } from "lodash";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { CategoryFilter } from "./components/CategoryFilter";
import { PriceFilter } from "./components/PriceFilter";
import { ProductGrid } from "./components/ProductGrid";
import SkeletonGrid from "@/components/loadingComp";

// Type definitions
interface PriceRange {
  id: number;
  label: string;
  min: number;
  max: number;
}

interface FetchProductsParams {
  page: number;
  limit: number;
  minPrice: number;
  maxPrice: number;
  categoryId?: string;
}

const DEFAULT_PAGE_SIZE = 8;
const DEBOUNCE_DELAY = 500;

const ProductPage: React.FC = () => {
  const dispatch = useDispatch();

  // Selectors
  const allProducts = useSelector(ProductSelectors.productList);
  const totalProducts = useSelector(ProductSelectors.totalProducts);
  const categories = useSelector(ProductSelectors.categories);
  const loading = useSelector(ProductSelectors.isLoading);

  // State
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 10000000000,
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRangeId, setSelectedRangeId] = useState(0);

  // Refs
  const isFromCategoryChange = useRef(false);

  // Constants
  const priceRanges: PriceRange[] = [
    { id: 0, label: "All Prices", min: 0, max: 10000000000 },
    { id: 1, label: "Under 10M", min: 0, max: 10000000 },
    { id: 2, label: "10M - 20M", min: 10000000, max: 20000000 },
    { id: 3, label: "20M - 30M", min: 20000000, max: 30000000 },
    { id: 4, label: "30M - 40M", min: 30000000, max: 40000000 },
    { id: 5, label: "Over 40M", min: 40000000, max: 100000000 },
  ];

  // Fetch initial data
  useEffect(() => {
    dispatch(ProductActions.fetchCategories());
  }, [dispatch]);

  // Product fetching logic
  const fetchProducts = useCallback(
    (params: FetchProductsParams) => {
      dispatch(ProductActions.fetchPaginatedProducts(params));
    },
    [dispatch]
  );

  const debouncedFetchProducts = useCallback(
    debounce((params: FetchProductsParams) => {
      fetchProducts(params);
    }, DEBOUNCE_DELAY),
    [fetchProducts]
  );

  // Handlers
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
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
    },
    [fetchProducts, pageSize, priceRange]
  );

  const handleAddCategory = async (newCategory: {
    name: string;
    description: string;
    parentCategoryId: string | null;
  }) => {
    try {
      // await dispatch(ProductActions.createCategory(newCategory));
      message.success("Category added successfully");
      dispatch(ProductActions.fetchCategories());
    } catch (error) {
      message.error("Failed to add category");
      console.error("Error adding category:", error);
    }
  };

  const handlePriceRangeChange = useCallback((range: PriceRange) => {
    setSelectedRangeId(range.id);
    setPriceRange([range.min, range.max]);
  }, []);

  const handleAddProduct = async (productData: {
    name: string;
    description: string;
    categoryId: string;
    price: number;
    originalPrice: number;
    stock: number;
    image: string;
  }) => {
    try {
      // await dispatch(ProductActions.createProduct(productData));
      console.log("🚀 ~ productData:", productData);

      message.success("Product added successfully");

      fetchProducts({
        page: currentPage,
        limit: pageSize,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
      });
    } catch (error) {
      message.error("Failed to add product");
      console.error("Error adding product:", error);
    }
  };

  // Effect for fetching products
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

  // Pagination handler
  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-6">
          <>
            <BreadcrumbNav
              onCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
              categories={categories}
              loading={loading}
            />

              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onAddCategory={handleAddCategory}
                loading={loading}
              />
            <PriceFilter
              priceRanges={priceRanges}
              selectedRangeId={selectedRangeId}
              onPriceChange={handlePriceRangeChange}
              loading={loading}
            />

            <ProductGrid
              items={pageSize}
              products={allProducts}
              loading={loading}
              categories={categories}
              onAddProduct={handleAddProduct}
            />

            {totalProducts > pageSize && allProducts?.length > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalProducts}
                  onChange={handlePaginationChange}
                  className="bg-white p-4 rounded-lg shadow-sm"
                  showSizeChanger
                  showQuickJumper
                />
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
