"use client";
import { App, Pagination } from "antd";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CategoryActions, CategorySelectors } from "@/modules/category/slice";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";

import { useRouter } from "next/navigation";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { CategoryFilter } from "./components/CategoryFilter";
import { PriceFilter } from "./components/PriceFilter";
import { ProductGrid } from "./components/ProductGrid";

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
  const allProducts = useSelector(ProductSelectors.productList);
  const totalProducts = useSelector(ProductSelectors.totalProducts);
  const categories = useSelector(CategorySelectors.categories);
  const loading = useSelector(ProductSelectors.isLoading);

  // State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRangeId, setSelectedRangeId] = useState(0);

  // Refs
  const isFromCategoryChange = useRef(false);

  const priceRanges: PriceRange[] = [
    { id: 0, label: "All Prices", min: 0, max: 10000000000 },
    { id: 1, label: "Under 10M", min: 0, max: 10000000 },
    { id: 2, label: "10M - 20M", min: 10000000, max: 20000000 },
    { id: 3, label: "20M - 30M", min: 20000000, max: 30000000 },
    { id: 4, label: "30M - 40M", min: 30000000, max: 40000000 },
    { id: 5, label: "Over 40M", min: 40000000, max: 100000000 },
  ];

  useEffect(() => {
    dispatch(CategoryActions.fetchCategories());
  }, [dispatch]);

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

  const handlePriceRangeChange = useCallback((range: PriceRange) => {
    setSelectedRangeId(range.id);
    setPriceRange([range.min, range.max]);
  }, []);

  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

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
  }, [priceRange, currentPage, pageSize, selectedCategory, debouncedFetchProducts]);
  const handleAddProduct = async (productData: any) => {
    try {
      dispatch(ProductActions.createProduct({ data: productData }));
      fetchProducts({
        page: currentPage,
        limit: pageSize,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-6">
          <BreadcrumbNav
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
            categories={categories}
            loading={loading} />

          {Array.isArray(categories) ? (
            <App>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                loading={loading}
              />
            </App>
          ) : (
            <div>Error loading categories.</div>
          )}


          <PriceFilter priceRanges={priceRanges} selectedRangeId={selectedRangeId} onPriceChange={handlePriceRangeChange} loading={loading} />
          {Array.isArray(allProducts) ? (
            <App>
              <ProductGrid onAddProduct={handleAddProduct} items={pageSize} products={allProducts} loading={loading} categories={categories} />
            </App>
          ) : (
            <div>Error loading products.</div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
