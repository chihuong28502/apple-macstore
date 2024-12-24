'use client'
import { Button } from 'antd'

import Slider from 'react-slick'
import { TVCarousel } from './components/tv-carousel';
import { ProductGrid } from './components/ProductGrid';
import { ProductSection } from './components/product-section';

function Page() {
  const sliderSettings = {
    infinite: true, // Lặp lại slider
    speed: 500, // Tốc độ chuyển đổi
    slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
    slidesToScroll: 1, // Chuyển 1 ảnh mỗi lần
    autoplay: true, // Tự động chuyển đổi
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };
  const slides = [
    {
      image:
        'https://www.apple.com/v/home/bv/images/heroes/holiday-2024/hero_holiday_2024_startframe__kdegyfjrojm2_mediumtall.jpg',
      title: 'Tặng món quà diệu kỳ.',
      subtitle: 'Hãy biến điều ước ngày lễ của người ấy thành hiện thực.',
    },
    {
      image:
        'https://www.apple.com/v/home/bv/images/heroes/holiday-2024/hero_holiday_2024_startframe__kdegyfjrojm2_mediumtall.jpg',
      title: 'Sức mạnh công nghệ.',
      subtitle: 'Đưa những sáng tạo của bạn lên tầm cao mới.',
    },
  ];

  const productData = [
    {
      title: "Macbook Pro M4",
      subtitle: "Chuyên nghiệp. Mạnh mẽ. Đột phá.",
      background: "https://www.apple.com/v/home/bv/images/promos/macbook-pro/promo_macbookpro_announce__gdf98j6tj2ie_large.jpg",
      textColor: "light",
      className: "bg-black",
    },
    {
      title: "iPhone 16",
      subtitle: "Thần kỳ, đa màu sắc, ấn tượng.",
      background: "https://www.apple.com/vn/home/images/heroes/iphone-16/hero_iphone16_avail__euwzls69btea_largetall.jpg",
      textColor: "dark",
      className: "bg-[#fafafa]",
    },
  ];

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative flex justify-center">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-auto object-cover md:object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center text-black bottom-6 px-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.07143] font-semibold tracking-[-0.005em] mb-2 md:mb-4 text-center">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl lg:text-[28px] leading-snug md:leading-[1.10722] font-normal mb-4 md:mb-6 text-center">
                {slide.subtitle}
              </p>
              <Button
                type="primary"
                href="#"
                className="h-[36px] px-4 md:px-[17px] bg-[#0071e3] hover:bg-[#0077ED] rounded-[980px] text-base md:text-[17px] leading-[1.17648] font-normal"
              >
                Mua sắm quà tặng
              </Button>
            </div>
          </div>
        ))}
      </Slider>

      <div className="grid grid-cols-1 gap-3">
        {productData.map((product, index) => (
          <ProductSection
            key={index}
            title={product.title}
            subtitle={product.subtitle}
            background={product.background}
            textColor={product.textColor as any}
            className={product.className}
          />
        ))}
        <ProductGrid />
        <TVCarousel />
      </div>
    </div>
  )
}
export default Page