"use client";
import Loading from "@/core/components/Loading";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Pagination, Tabs } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductPage = () => {
  const translations = useTranslations("filter");
  const dispatch = useDispatch();

  // Select data from Redux store
  const allProducts = useSelector(ProductSelectors.productList);
  const loading = useSelector(ProductSelectors.isLoading);
  const totalProducts = useSelector(ProductSelectors.totalProducts);
  const categories = useSelector(ProductSelectors.categories);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState("1");
  const [initialLoading, setInitialLoading] = useState(true); // Quản lý loading lần đầu

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await dispatch(ProductActions.fetchCategories());
      setInitialLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const categoryId = activeTab === "1" ? undefined : activeTab;
    dispatch(
      ProductActions.fetchPaginatedProducts({
        page: currentPage,
        limit: pageSize,
        categoryId,
      })
    );
  }, [dispatch, currentPage, pageSize, activeTab]);

  // Filter sản phẩm theo danh mục
  const filterByCategory = (categoryId: string) =>
    allProducts?.filter(
      (product: any) => product.categoryId._id === categoryId
    );
  // Tạo các tab cho mỗi danh mục
  const tabItems = [
    {
      key: "1",
      label: translations("all"),
      children: (
        <div className="font-sans py-4 mx-auto lg:max-w-6xl md:max-w-4xl max-sm:max-w-md">
          <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          {translations("title")}
          </h2>
          {loading || initialLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-12">
              {allProducts?.map((product: any, index: any) => (
                <div
                  key={product._id}
                  className="bg-gray-100 p-3 rounded-lg group overflow-hidden cursor-pointer relative z-10 hover:before:bg-black before:absolute before:inset-0 before:opacity-20 before:transition-all"
                >
                  <div className="w-full h-[300px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="absolute mx-auto left-0 right-0 -bottom-80 group-hover:bottom-2 bg-white w-11/12 p-3 rounded-lg transition-all duration-300">
                    <div className="text-center">
                      <h3 className="text-base font-bold text-gray-800">
                        {product.name}
                      </h3>
                      <h4 className="text-lg text-blue-600 font-bold mt-2">
                        ${product.price}
                      </h4>
                    </div>

                    <div className="flex justify-center space-x-1 mt-4">
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
              ))}
            </div>
          )}
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
    ...categories.map((category: any) => ({
      key: category._id,
      label: category.name,
      children: (
        <div className="font-sans py-4 mx-auto lg:max-w-6xl md:max-w-4xl max-sm:max-w-md">
          <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          {category.name} Products
          </h2>
          {loading || initialLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-12">
              {filterByCategory(category._id).map(
                (product: any, index: number) => (
                  <div
                    key={product._id}
                    className="bg-gray-100 p-3 rounded-lg group overflow-hidden cursor-pointer relative z-50 hover:before:bg-black before:absolute before:inset-0 before:opacity-20 before:transition-all"
                  >
                    <div className="w-full h-[300px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="absolute mx-auto left-0 right-0 -bottom-80 group-hover:bottom-2 bg-white w-11/12 p-3 rounded-lg transition-all duration-300">
                      <div className="text-center">
                        <h3 className="text-base font-bold text-gray-800">
                          {product.name}
                        </h3>
                        <h4 className="text-lg text-blue-600 font-bold mt-2">
                          ${product.price}
                        </h4>
                      </div>

                      <div className="flex justify-center space-x-1 mt-4">
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
                )
              )}
            </div>
          )}
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
