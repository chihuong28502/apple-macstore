"use client";

import TripleSlider from "@/components/Slider/Slider";
import { Button, Tag } from 'antd';
import Image from "next/image";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const promoData = [
  {
    id: 'ipad-air',
    title: 'Mac Mini',
    subtitle: 'Two sizes. Faster chip. Does it all.',
    description: 'Learn more about the iPad Air features.',
    imageUrl: 'https://images.unsplash.com/photo-1604404439625-976a22785855?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/ipad-air',
    buyLink: '/buy-ipad-air',
    status: 'available',
  },
  {
    id: 'airpods-pro-2',
    title: 'AirPods Pro',
    subtitle: 'Advanced features for better sound quality.',
    description: 'Buy the latest AirPods Pro 2.',
    imageUrl: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/airpods-pro-2',
    buyLink: '/buy-airpods-pro-2',
    status: 'available',
  }, {
    id: 'MacBook Pro',
    title: 'Macbook',
    subtitle: 'Advanced features for better sound quality.',
    description: 'Buy the latest AirPods Pro 2.',
    imageUrl: 'https://images.unsplash.com/photo-1710905219584-8521769e3678?q=80&w=1910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/airpods-pro-2',
    buyLink: '/buy-airpods-pro-2',
    status: 'available',
  }, {
    id: 'MacBook Pro123',
    title: 'Macbook Pro',
    subtitle: 'Advanced features for better sound quality.',
    description: 'Buy the latest AirPods Pro 2.',
    imageUrl: 'https://via.placeholder.com/300',
    link: '/airpods-pro-2',
    buyLink: '/buy-airpods-pro-2',
    status: 'available',
  },
  // Thêm các sản phẩm khác vào đây
];

const slides = [
  {
    _id: 1,
    image:
      "https://images.unsplash.com/photo-1710905219584-8521769e3678?q=80&w=1910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Macbook",
  },
  {
    _id: 2,
    image:
      "https://images.unsplash.com/photo-1604404439625-976a22785855?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "airpods",
  },
  {
    _id: 3,
    image:
      "https://images.unsplash.com/photo-1710905219584-8521769e3678?q=80&w=1910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Mac Mini",
  },
];

export default function Home() {
  // const t = useTranslations("HomePage");
  const [selectTopCard, setSelectTopcard] = useState(null);
  const [selectCategoryCard, setSelectCategoryCard] = useState(null);

  return (
    <div className="bg-mainLayout rounded-xl p-4">
      <div className="w-full h-full">
        <TripleSlider slides={slides} />
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {promoData.map((promo) => (
          <div
            key={promo.id}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <a href={promo.link} className="relative block">
              <Image
                width={300}
                height={300}
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-56 object-cover"
              />
            </a>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-gray-800">{promo.title}</h3>
              <p className="mt-2 text-gray-600">{promo.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Tag color="blue">New</Tag>
                {promo.status === 'available' && (
                  <Tag color="green">In Stock</Tag>
                )}
              </div>

              <div className="mt-4 flex gap-4">
                <Button
                  type="primary"
                  href={promo.link}
                  className="flex-1"
                >
                  Learn More
                </Button>
                <Button
                  type="default"
                  href={promo.buyLink}
                  className="flex-1"
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
