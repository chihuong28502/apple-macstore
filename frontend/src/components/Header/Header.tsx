"use client";

import { CustomIcon } from "@/asset/svg";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import Cart from "./Cart";
import Order from "./Order";
import User from "./User";
import { useState } from "react";  // Import useState for managing mobile menu
import BtnAuth from "../headerBtnAuth/BtnAuth";
import SearchComponent from "../Search/Search";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle mobile menu visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to handle search input visibility
  const auth = useAppSelector(AuthSelectors.user);

  return (
    <div className="px-6 z-20 !bg-transparent">
      <div className="flex justify-between items-center w-full">
        {/* Left Section: Custom Icon */}
        <div className="flex items-center space-x-4">
          <Link href={"/"} className="flex items-center mr-11">
            <CustomIcon />
          </Link>
        </div>

        {/* Right Section: Cart, Order, User, Notification */}

        {/* Links that appear only on larger screens */}
        <div className="hidden md:flex justify-between items-center w-full">
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>

        </div>
        <div className="flex justify-end">

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
            <div className="pl-2">
              {auth && <User />}
            </div>
            <div className="flex items-center ml-auto">
              <CiSearch onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-fontColor text-2xl cursor-pointer" />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}  // Toggle mobile menu
                className=" pl-2 text-fontColor text-2xl md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="md:block hidden">
              {!auth && <BtnAuth title={"Đăng nhập"} icon={FaRegUserCircle} />}
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-white shadow-lg p-4 w-48 rounded-lg z-30">
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/products"} className="flex items-center mr-11 text-fontColor text-sm group relative">
            <p>Products</p>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-fontColor transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="flex items-center gap-1">
            {!auth && <BtnAuth title={"Đăng nhập"} icon={FaRegUserCircle} />}
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className=" transform translate-y-4 scale-95 absolute top-10 left-0 right-0 bg-white p-2 z-30 shadow-lg transition-all ease-linear duration-300 rounded-lg">
          <SearchComponent />
        </div>
      )}
    </div>
  );
};

export default Header;
