"use client";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Tabs, Pagination, Menu, Dropdown, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./components/Card";

const ProductPage = () => {
  const dispatch = useDispatch();

  // Select data from Redux store
  const allProducts = useSelector(ProductSelectors.productList);
  const totalProducts = useSelector(ProductSelectors.totalProducts);
  const categories = useSelector(ProductSelectors.categories);

  const [currentPage, setCurrentPage] = useState(1); // Manage current page
  const [pageSize, setPageSize] = useState(2); // Manage page size
  const [activeTab, setActiveTab] = useState("1"); // Manage active tab
  const [loadingTab, setLoadingTab] = useState(false); // Loading state for each tab

  useEffect(() => {
    dispatch(ProductActions.fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Fetch products for the active tab (All or by category)
    const categoryId = activeTab === "1" ? undefined : activeTab;
    setLoadingTab(true); // Set loading state when fetching new data
    dispatch(
      ProductActions.fetchPaginatedProducts({
        page: currentPage,
        limit: pageSize,
        categoryId,
      })
    );
  }, [dispatch, currentPage, pageSize, activeTab]);

  // Phân loại danh mục cha và con
  const parentCategories = categories.filter(
    (category: any) => !category.parentId
  );
  const childCategories = categories.filter(
    (category: any) => category.parentId
  );

  // Lấy các danh mục con theo parentId
  const getChildCategories = (parentId: string) => {
    return childCategories.filter((cat:any) => cat.parentId === parentId);
  };

  // Filter products by category
  const filterByCategory = (categoryId: string) =>
    allProducts?.filter((product: any) => product.categoryId._id === categoryId);

  // Tạo menu con
  const renderSubCategories = (parentId: string) => {
    const subCategories = getChildCategories(parentId);
    if (subCategories.length === 0) return <></>;

    return (
      <Menu>
        {subCategories.map((subCategory: any) => (
          <Menu.Item
            key={subCategory._id}
            onClick={() => {
              setActiveTab(subCategory._id); // Set the subcategory as active
              setCurrentPage(1); // Reset page
            }}
          >
            {subCategory.name}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  // Generate tab items based on parent categories
  const tabItems = [
    {
      key: "1",
      label: "All",
      children: (
        <div>
          <div className="p-8 flex flex-wrap justify-center gap-8 mx-auto mt-8 max-w-6xl">
            {allProducts?.map((product:any, index:any) => (
              <Card
                key={index}
                name={product.name}
                description={product.description}
                basePrice={product.basePrice}
                price={product.price}
                images={product.images}
                tags={product.tags}
                customizations={product.customizations}
                stock={product.stock}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
            />
          </div>
        </div>
      ),
    },
    // Generate tabs for each parent category
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
          <div className="p-8 flex flex-wrap justify-center gap-8 mx-auto mt-8 max-w-6xl">
            {filterByCategory(category._id).map(
              (product: any, index: number) => (
                <Card
                  key={index}
                  name={product.name}
                  description={product.description}
                  basePrice={product.basePrice}
                  price={product.price}
                  images={product.images}
                  tags={product.tags}
                  customizations={product.customizations}
                  stock={product.stock}
                />
              )
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
            />
          </div>
        </div>
      ),
    })),
  ];

  return (
    <div className="p-8">
      <Tabs
        activeKey={activeTab} // Set activeKey to manage tab switching
        items={tabItems}
        onChange={(key) => {
          setActiveTab(key); // Update active tab
          setCurrentPage(1); // Reset page when switching tabs
        }}
      />
    </div>
  );
};

export default ProductPage;
