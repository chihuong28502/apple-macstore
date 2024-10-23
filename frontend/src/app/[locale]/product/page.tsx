"use client";
import Product from "@/components/Product/Product";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Dropdown, InputNumber, Menu, Pagination, Slider, Tabs } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductPage = () => {
  const dispatch = useDispatch();

  const allProducts = useSelector(ProductSelectors.productList);
  const totalProducts = useSelector(ProductSelectors.totalProducts);
  const categories = useSelector(ProductSelectors.categories);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    dispatch(ProductActions.fetchCategories());
  }, [dispatch]);

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

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const onPriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const parentCategories = categories.filter(
    (category: any) => !category.parentId
  );
  const childCategories = categories.filter(
    (category: any) => category.parentId
  );

  const getChildCategories = (parentId: string) => {
    return childCategories.filter((cat: any) => cat.parentId === parentId);
  };

  const renderSubCategories = (parentId: string) => {
    const subCategories = getChildCategories(parentId);
    if (subCategories.length === 0) return <></>;

    return (
      <>
        <Menu>
          {subCategories.map((subCategory: any) => (
            <Menu.Item
              key={subCategory._id}
              onClick={() => {
                setActiveTab(subCategory._id);
                setCurrentPage(1);
              }}
            >
              {subCategory.name}
            </Menu.Item>
          ))}
        </Menu>
      </>
    );
  };

  const tabItems = [
    {
      key: "1",
      label: "All",
      children: (
        <div>
          <div className="mb-6 flex justify-start items-center">
            <span className="mr-4">Filter by Price:</span>
            <Slider
              range={true}
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

          {allProducts?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-6 gap-12">
              {allProducts.map(
                (
                  product: any,
                  index: number 
                ) => (
                  <Product product={product} key={index} />
                )
              )}
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={handlePageChange}
            />
          </div>
        </div>
      ),
    },
    ...parentCategories.map((category: any) => ({
      key: category._id,
      label: (
        <Dropdown
          overlay={renderSubCategories(category._id)}
          trigger={["hover"]}
        >
          <span>{category.name}</span>
        </Dropdown>
      ),
      children: (
        <div>
          <div className="mb-6 flex justify-start items-center">
            <span className="mr-4">Filter by Price:</span>
            <Slider
              range={true}
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
          {allProducts?.length > 0 && ( // Kiểm tra xem mảng có chứa phần tử hay không
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-6 gap-12">
              {allProducts.map(
                (
                  product: any,
                  index: number // Không cần sử dụng `?.` ở đây vì đã kiểm tra length
                ) => (
                  <Product product={product} key={index} />
                )
              )}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={handlePageChange}
            />
          </div>
        </div>
      ),
    })),
  ];

  return (
    <div className="p-8">
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
