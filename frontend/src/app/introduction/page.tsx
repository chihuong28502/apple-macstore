'use client'
import { Button } from 'antd'
import { ProductSection } from './product-section'
import { ProductGrid } from './ProductGrid'
import { TVCarousel } from './tv-carousel'
import Slider from 'react-slick'

function Page() {
  const sliderSettings = {
    dots: true, // Hiển thị điểm đánh dấu
    infinite: true, // Lặp lại slider
    speed: 500, // Tốc độ chuyển đổi
    slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
    slidesToScroll: 1, // Chuyển 1 ảnh mỗi lần
    autoplay: true, // Tự động chuyển đổi
    autoplaySpeed: 5000,
    customPaging: (i: any) => (
      <div className="w-2.5 h-2.5 mx-2 bg-white rounded-full cursor-pointer">
      </div>
    ),
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

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative flex justify-center">
            {/* Hình ảnh */}
            <img
              src={slide.image}
              alt={slide.title}
              className="object-contain"
            />
            {/* Lớp phủ màu với nội dung */}
            <div className="absolute inset-0 flex flex-col justify-end items-center text-black bottom-6">
              <h1 className="text-5xl leading-[1.07143] font-semibold tracking-[-0.005em] mb-4">
                {slide.title}
              </h1>
              <p className="text-[28px] leading-[1.10722] font-normal mb-6">
                {slide.subtitle}
              </p>
              <Button
                type="primary"
                href="#"
                className="h-[36px] px-[17px] bg-[#0071e3] hover:bg-[#0077ED] rounded-[980px] text-[17px] leading-[1.17648] font-normal"
              >
                Mua sắm quà tặng
              </Button>
            </div>
          </div>
        ))}
      </Slider>

      <div className="grid grid-cols-1 gap-3">
        <ProductSection
          title="iPhone 16 Pro"
          subtitle="Chuyên nghiệp. Mạnh mẽ. Đột phá."
          background="https://www.apple.com/v/home/bv/images/promos/macbook-pro/promo_macbookpro_announce__gdf98j6tj2ie_large.jpg"
          textColor="light"
          className="bg-black"
        />

        <ProductSection
          title="iPhone 16"
          subtitle="Thần kỳ, đa màu sắc, ấn tượng."
          background="https://www.apple.com/vn/home/images/heroes/iphone-16/hero_iphone16_avail__euwzls69btea_largetall.jpg"
          textColor="dark"
          className="bg-[#fafafa]"
        />
        <ProductGrid />
        <TVCarousel />
      </div>
    </div>
  )
}
export default Page