'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SearchOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const menuItems = [
  { label: 'Cửa hàng', href: '#' },
  { label: 'Mac', href: '#' },
  { label: 'iPad', href: '#' },
  { label: 'iPhone', href: '#' },
  { label: 'Watch', href: '#' },
  { label: 'AirPods', href: '#' },
  { label: 'TV & Nhà', href: '#' },
  { label: 'Giải Trí', href: '#' },
  { label: 'Phụ Kiện', href: '#' },
  { label: 'Hỗ Trợ', href: '#' },
]

export function Navigation() {
  return (
    <nav className="fixed top-[36px] left-0 right-0 z-40 bg-[rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="max-w-[1024px] mx-auto">
        <div className="flex items-center justify-between h-[44px] px-4">
          <div className="flex items-center space-x-9">
            <Link href="/" className="py-2">
              <Image 
                src="/images/apple-logo.svg"
                alt="Apple"
                width={14}
                height={14}
                className="w-[14px] h-[14px] brightness-[100]"
              />
            </Link>
            
            <div className="hidden lg:flex items-center space-x-9">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[12px] leading-[1.33337] text-[#f5f5f7] opacity-80 hover:opacity-100 transition-opacity"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Button 
              type="text" 
              icon={<SearchOutlined className="text-[#f5f5f7] text-[13px] opacity-80 hover:opacity-100" />}
              className="w-[14px] h-[14px] flex items-center justify-center p-0"
            />
            <Button 
              type="text" 
              icon={<ShoppingOutlined className="text-[#f5f5f7] text-[13px] opacity-80 hover:opacity-100" />}
              className="w-[14px] h-[14px] flex items-center justify-center p-0"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

