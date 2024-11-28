"use client";

import { CustomIcon } from "@/asset/svg";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react"; // Import useState
import Cart from "./Cart";
import Order from "./Order";
import User from "./User";
import BtnAuth from "../headerBtnAuth/BtnAuth";
import { Dropdown, Menu, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { ProductPage } from "@/type/product.page.type";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

const Header = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [filteredData, setFilteredData] = useState<any>([]); // State to store filtered search results
  const [filteredDataProducts, setFilteredDataProducts] = useState<any>([]); // State to store filtered search results
  // Mock data for the search
  const categories = useSelector(ProductSelectors.categories) as ProductPage.Category[];
  const products = useSelector(ProductSelectors.productList);
  // Auth selector to check user authentication
  const auth = useAppSelector(AuthSelectors.user);
  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(ProductActions.fetchCategories());
    };
    fetchCategories();
    const fetchProducts = async () => {
      dispatch(ProductActions.fetchPaginatedProducts({
        page: 1,
        limit: 1,
        minPrice: 0,
        maxPrice: 10000000000,
      }));
    };
    fetchProducts();
  }, [dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchTerm("");
      setFilteredData([]);
      setFilteredDataProducts([]);
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };
  // Function to handle search term input
  const handleSearchChange = useCallback(
    debounce((value: string, categories: any[], products: any[], setFilteredDataProducts: (data: any[]) => void, setFilteredData: (data: any[]) => void) => {
      if (value.trim() === "") {
        setFilteredData([]);
        setFilteredDataProducts([]);
      } else {
        const results = categories.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        const resultsProducts = products.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(results);
        setFilteredDataProducts(resultsProducts)
      }
    }, 1500), // Debounce với thời gian là 1.5 giây
    []
  );
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchChange(value, categories, products, setFilteredDataProducts, setFilteredData);
  };
  const fetchProducts = useCallback(
    (params: ProductPage.FetchProductsParams) => {
      dispatch(ProductActions.fetchPaginatedProducts(params));
    },
    [dispatch]
  );
  const handleCategoryChange = (categoryId: string) => {
    fetchProducts({
      page: 1,
      limit: 1,
      minPrice: 0,
      maxPrice: 100000000000,
      categoryId: categoryId !== "all" ? categoryId : undefined,
    });
  };
  const onClickCategory = (id: any) => {
    handleCategoryChange(id)
  }

  // Menu for search input with filtered data
  const searchMenu = (
    <Menu className="py-2 px-2 relative">
      <div className="md:w-80 w-52">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={onSearchInputChange}
          autoFocus
        />
        <ul>
          {filteredData?.length > 0 && (
            <>
              <div className="text-sm text-gray-700 font-medium py-1">-- Category --</div>
              {filteredData?.map((item: any) => (
                <Menu.Item key={item._id} className="hover:bg-gray-200 transition duration-200">
                  <Link
                    onClick={(e) => onClickCategory(item?._id)}
                    href={`/product?categoryId=${item._id}`}
                    className="block cursor-pointer py-0.5 rounded-md"
                  >
                    {item.name}
                  </Link>
                </Menu.Item>
              ))}
            </>
          )}
  
          {filteredDataProducts?.length > 0 && (
            <>
              <div className="text-sm text-gray-700 font-medium py-1">-- Product --</div>
              {filteredDataProducts?.map((item: any) => (
                <Menu.Item key={item._id} className="hover:bg-gray-200 transition duration-200">
                  <Link
                    href={`/product/${item._id}`}
                    className="block cursor-pointer py-0.5 rounded-md"
                  >
                    {item.name}
                  </Link>
                </Menu.Item>
              ))}
            </>
          )}
  
          {/* Hiển thị thông báo khi không có kết quả tìm kiếm */}
          {filteredData.length === 0 && filteredDataProducts.length === 0 && (
            <Menu.Item className="text-gray-500">No results found</Menu.Item>
          )}
        </ul>
      </div>
    </Menu>
  );
  

  return (
    <div className="fixed w-full px-4 z-20 shadow-lg backdrop-blur-sm bg-white/50">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <CustomIcon />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-700 text-sm font-medium">
          <Link href="/product" className="group relative">
            <span>Products</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/faq" className="group relative">
            <span>FAQ</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/shipping" className="group relative">
            <span>Shipping</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contacts" className="group relative">
            <span>Contacts</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex items-center">
          <div className="px-2">
            {auth && <Order />}
          </div>
          <div className="px-2">
            {auth && <Cart />}
          </div>
          <div className="px-2">
            {auth && <NotificationPopover />}
          </div>
          <div className="px-2">
            {auth && <User />}
          </div>
          <div className="pl-2">
            <Dropdown overlay={searchMenu} trigger={['click']}>
              <CiSearch className="text-gray-700 text-2xl cursor-pointer" onClick={toggleSearch} />
            </Dropdown>
          </div>
          <div className="pl-2 md:block hidden">
            {!auth && <BtnAuth title={"Đăng nhập"} icon={FaRegUserCircle} />}
          </div>

          <button onClick={toggleMenu} className="text-gray-700 text-2xl md:hidden ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="shadow-lg backdrop-blur-md bg-white/90 absolute top-12 right-0 p-4 w-56 rounded-xl z-30">
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/product" className="block text-gray-800 text-base font-medium group relative">
                <span>Products</span>
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/faq" className="block text-gray-800 text-base font-medium group relative">
                <span>FAQ</span>
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="block text-gray-800 text-base font-medium group relative">
                <span>Shipping</span>
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="block text-gray-800 text-base font-medium group relative">
                <span>Contacts</span>
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></span>
              </Link>
            </li>
            {!auth && (
              <li>
                <BtnAuth title={"Đăng nhập"} icon={FaRegUserCircle} />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
