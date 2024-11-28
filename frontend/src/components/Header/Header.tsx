"use client";

import { CustomIcon } from "@/asset/svg";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useState } from "react"; // Import useState
import Cart from "./Cart";
import Order from "./Order";
import User from "./User";
import BtnAuth from "../headerBtnAuth/BtnAuth";
import { Dropdown, Menu, Input } from "antd";

const Header = () => {
  // State to handle the visibility of mobile menu and search
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [filteredData, setFilteredData] = useState([]); // State to store filtered search results
  // Mock data for the search
  const mockData = [
    { id: 1, name: "MacBook Pro 14-inch" },
    { id: 2, name: "MacBook Air M2" },
    { id: 3, name: "iMac 24-inch" },
    { id: 4, name: "AirPods Pro" },
    { id: 5, name: "iPhone 15" },
  ];

  // Auth selector to check user authentication
  const auth = useAppSelector(AuthSelectors.user);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchTerm("");
      setFilteredData([]);
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };
  // Function to handle search term input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Filter the mock data based on the search term
    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const results: any = mockData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(results);
    }
  };

  // Menu for search input with filtered data
  const searchMenu = (
    <Menu className="py-2 px-2 relative">
      <div className="md:w-80 w-52">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
        />
        <ul>
          {filteredData.map((item: any) => (
            <Menu.Item key={item.id}>
              <Link href={`/product/${item.id}`} className="block">
                {item.name}
              </Link>
            </Menu.Item>
          ))}
          {filteredData.length === 0 && (
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
