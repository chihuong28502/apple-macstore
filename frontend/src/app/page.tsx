"use client";

import CategoryCard from "@/components/CategoryCard/CategoryCard";
import TripleSlider from "@/components/Slider/Slider";
import TopCard from "@/components/TopicCard/TopCard";
import { useState } from "react";
import { HiInboxStack } from "react-icons/hi2";

const listTopic = [
  { _id: 1, title: "Nội dung nổi bật" },
  { _id: 2, title: "Ca nhạc" },
  { _id: 3, title: "Điện thoại" },
  { _id: 4, title: "Trò chơi" },
  { _id: 5, title: "Truyện tranh" },
];

const listCategoryCard = [
  {
    _id: 1,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 2,
    title: "Danh mục",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 3,
    title: "Danh mục",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 4,
    title: "Danh mục",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 5,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 6,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 7,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 8,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 9,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
  {
    _id: 10,
    title: "Abc",
    description: "Lorem Ipsum is simply dummy te...",
    icon: <HiInboxStack />,
  },
];

const slides = [
  {
    _id: 1,
    image:
      "https://i.pinimg.com/564x/0f/71/f4/0f71f451c8e21f20da8e0a0a352f1251.jpg",
    title: "abc",
  },
  {
    _id: 2,
    image:
      "https://i.pinimg.com/564x/0f/71/f4/0f71f451c8e21f20da8e0a0a352f1251.jpg",
    title: "abc",
  },
  {
    _id: 3,
    image:
      "https://i.pinimg.com/564x/0f/71/f4/0f71f451c8e21f20da8e0a0a352f1251.jpg",
    title: "abc",
  },
];

export default function Home() {
  // const t = useTranslations("HomePage");
  const [selectTopCard, setSelectTopcard] = useState(null);
  const [selectCategoryCard, setSelectCategoryCard] = useState(null);

  return (
    <></>
    // <div className="bg-mainLayout rounded-xl p-8">
    //   {/* Slider */}
    //   <div className="w-full">
    //     <TripleSlider slides={slides} />
    //   </div>
    //   {/* List Topic Card */}
    //   <div className="mb-8 flex flex-wrap gap-x-2 gap-y-2">
    //     {listTopic.map((item: any, index: number) => (
    //       <TopCard
    //         key={index}
    //         item={item}
    //         onSelect={setSelectTopcard}
    //         isSelect={selectTopCard}
    //       />
    //     ))}
    //   </div>

    //   {/* List Category Card */}
    //   <div className="grid grid-cols-5 gap-6">
    //     {listCategoryCard.map((item: any, index: number) => (
    //       <CategoryCard
    //         key={index}
    //         item={item}
    //         onSelect={setSelectCategoryCard}
    //         isSelect={selectCategoryCard}
    //       />
    //     ))}
    //   </div>
    // </div>
  );
}
