"use client";

import { useEffect, useState } from "react";

import React from "react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import Image from "next/image";
import { IoPlayCircleOutline } from "react-icons/io5";

interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  artist: string;
  views: string;
  uploadTime: string;
}

const MusicVideoSlider: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      imageUrl: "https:img.youtube.com/vi/5TUHfN9oHt0/maxresdefault.jpg",
      title: "MỘT CHẤM MỘ",
      artist: "MYRA TRAN feat BINZ",
      views: "3.1Tr lượt xem",
      uploadTime: "1 ngày trước",
    },
    {
      id: 2,
      imageUrl: "https:img.youtube.com/vi/abPmZCZZrFA/maxresdefault.jpg",
      title: "ĐỪNG LÀM TRÁI TIM ANH ĐAU",
      artist: "SƠN TÙNG M-TP",
      views: "28Tr lượt xem",
      uploadTime: "8 ngày trước",
    },
    {
      id: 3,
      imageUrl: "https:img.youtube.com/vi/0xAW6MAT_Wo/maxresdefault.jpg",
      title: "TRỜI ĐỂ NÓI CHIA TAY",
      artist: "Unknown",
      views: "2Tr lượt xem",
      uploadTime: "3 ngày trước",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-transparent">
      <Swiper
        effect="effect"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.5}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1.5,
          slideShadows: false,
        }}
        autoplay={{
          disableOnInteraction: false,
          delay: 2000,
        }}
        loop={true}
        modules={[EffectCoverflow, Autoplay]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                width={854}
                height={450}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <IoPlayCircleOutline className="text-white size-10 lg:size-20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-lg lg:text-2xl font-bold mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-sm lg:text-lg mb-1">{slide.artist}</p>
                  <p className=" text-xs lg:text-sm opacity-75">
                    {slide.views} • {slide.uploadTime}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MusicVideoSlider;

// const MusicVideoCarousel = () => {
//   const [activeIndex, setActiveIndex] = useState(1);
//   const slides = [
//     {
//       id: 1,
//       imageUrl: "https:img.youtube.com/vi/5TUHfN9oHt0/maxresdefault.jpg",
//       title: "MỘT CHẤM MỘ",
//       artist: "MYRA TRAN feat BINZ",
//       views: "3.1Tr lượt xem",
//       uploadTime: "1 ngày trước",
//     },
//     {
//       id: 2,
//       imageUrl: "https:img.youtube.com/vi/abPmZCZZrFA/maxresdefault.jpg",
//       title: "ĐỪNG LÀM TRÁI TIM ANH ĐAU",
//       artist: "SƠN TÙNG M-TP",
//       views: "28Tr lượt xem",
//       uploadTime: "8 ngày trước",
//     },
//     {
//       id: 3,
//       imageUrl: "https:img.youtube.com/vi/0xAW6MAT_Wo/maxresdefault.jpg",
//       title: "TRỜI ĐỂ NÓI CHIA TAY",
//       artist: "Unknown",
//       views: "2Tr lượt xem",
//       uploadTime: "3 ngày trước",
//     },
//   ];
//   // useEffect(() => {
//   //   const timer = setInterval(() => {
//   //     setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
//   //   }, 5000);
//   //   return () => clearInterval(timer);
//   // }, []);

//   return (
//     <div className="relative w-full h-[400px] overflow-hidden bg-gray-900">
//       <div className="absolute inset-0 flex items-center justify-center">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute w-2/5 transition-all duration-300 ease-in-out
//                         ${index === activeIndex ? "z-20 top-8" : "z-10 "}
//                         ${
//                           index ===
//                           (activeIndex - 1 + slides.length) % slides.length
//                             ? "-translate-x-[60%]"
//                             : ""
//                         }
//                         ${
//                           index === (activeIndex + 1) % slides.length
//                             ? "translate-x-[60%]"
//                             : ""
//                         }`}
//           >
//             <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
//               <img
//                 src={slide.imageUrl}
//                 alt={slide.title}
//                 className="w-full h-full object-cover"
//               />
//               {index === activeIndex && (
//                 <>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
//                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                     <div className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
//                       <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-black border-b-6 border-b-transparent ml-1"></div>
//                     </div>
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
//                     <h2 className="text-lg font-bold truncate">
//                       {slide.title}
//                     </h2>
//                     <p className="text-sm truncate">{slide.artist}</p>
//                     <p className="text-xs opacity-75 truncate">
//                       {slide.views} • {slide.uploadTime}
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MusicVideoCarousel;
