"use client";
import Product from "@/components/Product/Product";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Dropdown, Menu, Pagination, Tabs } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductPage = () => {
  const dispatch = useDispatch();

  const allProducts = useSelector(ProductSelectors.productList);
  const totalProducts = useSelector(ProductSelectors.totalProducts);
  const categories = useSelector(ProductSelectors.categories);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedRangeId, setSelectedRangeId] = useState<number | null>(0); // Default to Mặc định

  useEffect(() => {
    dispatch(ProductActions.fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Set default price range and selected range ID when the component mounts
    setSelectedRangeId(0); // Mặc định
    setPriceRange([0, 10000000000]); // Mức giá mặc định
  }, []);

  const debouncedFetchProducts = useCallback(
    debounce((priceRange, categoryId) => {
      dispatch(
        ProductActions.fetchPaginatedProducts({
          page: currentPage,
          limit: pageSize,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          categoryId: categoryId !== "1" ? categoryId : undefined,
        })
      );
    }, 500),
    [dispatch, currentPage, pageSize]
  );

  useEffect(() => {
    debouncedFetchProducts(priceRange, activeTab);
  }, [priceRange, activeTab, debouncedFetchProducts]);

  const parentCategories = categories.filter(
    (category: any) => !category.parentCategoryId
  );
  const childCategories = categories.filter(
    (category: any) => category.parentCategoryId
  );

  const getChildCategories = (parentId: string) => {
    return categories.filter((cat: any) => cat.parentCategoryId === parentId);
  };

  const buildMenuItems = (category: any): any => {
    const children = getChildCategories(category._id);

    return {
      key: category._id,
      label: (
        <div className="flex justify-between items-center w-full py-2 px-4">
          <span>{category.name}</span>
          {children.length > 0 && <span className="text-gray-400">›</span>}
        </div>
      ),
      children:
        children.length > 0
          ? children.map((child) => buildMenuItems(child))
          : null,
      onClick: () => {
        setActiveTab(category._id);
        setCurrentPage(1);
      },
    };
  };

  const priceRanges = [
    { id: 0, label: "Mặc định", min: 0, max: 10000000000 },
    { id: 1, label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { id: 2, label: "10 - 20 triệu", min: 10000000, max: 20000000 },
    { id: 3, label: "20 - 30 triệu", min: 20000000, max: 30000000 },
    { id: 4, label: "30 - 40 triệu", min: 30000000, max: 40000000 },
    { id: 5, label: "Trên 40 triệu", min: 40000000, max: 100000000 },
  ];

  const handlePriceRangeChange = (range: (typeof priceRanges)[0]) => {
    setSelectedRangeId(range.id);
    setPriceRange([range.min, range.max]);
  };

  const renderPriceFilter = () => (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="mr-1">Mức giá:</span>
        {priceRanges.map((range) => (
          <label
            key={range.id}
            className={`hover:bg-green-300 hover:text-white shadow-xl
              px-4 rounded-full cursor-pointer border
              transition-colors duration-200
              ${
                selectedRangeId === range.id
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
              }
            `}
          >
            <input
              type="radio"
              name="priceRange"
              className="hidden"
              checked={selectedRangeId === range.id}
              onChange={() => handlePriceRangeChange(range)}
            />
            <span className="text-xs">{range.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderProductGrid = () => (
    <>
      {allProducts?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-12">
          {allProducts.map((product: any, index: number) => (
            <Product product={product} key={index} />
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalProducts}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>
    </>
  );

  const tabItems = [
    {
      key: "1",
      label: "All",
      children: (
        <div>
          {renderPriceFilter()}
          {renderProductGrid()}
        </div>
      ),
    },
    ...parentCategories.map((category: any) => ({
      key: category._id,
      label: (
        <Dropdown
          overlay={
            <Menu
              mode="vertical"
              items={getChildCategories(category._id).map((child) =>
                buildMenuItems(child)
              )}
              className="category-dropdown"
            />
          }
          trigger={["hover"]}
        >
          <span className="px-4 py-2">{category.name}</span>
        </Dropdown>
      ),
      children: (
        <div>
          {renderPriceFilter()}
          {renderProductGrid()}
        </div>
      ),
    })),
  ];

  return (
    <div className="p-8">
      <style jsx global>{`
        .category-dropdown .ant-dropdown-menu-item {
          padding: 8px 12px;
        }
        .category-dropdown .ant-dropdown-menu-submenu-title {
          padding-right: 24px;
        }
      `}</style>
      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={(key) => {
          setActiveTab(key);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default ProductPage;
