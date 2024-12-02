'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'

const tvShows = [
  {
    title: "Miễn Trừ Trách Nhiệm",
    subtitle: "Giật gân - Mọi chuyện đều chỉ là trùng hợp.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/iUZiuKb8A9o5jIx0hJSvjw/980x551.jpg"
  },
  {
    title: "Tâm Ý",
    subtitle: "Tất cả chúng ta đều có can đảm để thay đổi số phận.",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Tu3M0fknOkn-cPuWZrjA1A/980x551.jpg"
  },
]

export function TVCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<Slider>(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <div className="relative overflow-hidden">
      <Slider ref={sliderRef} {...settings} className="tv-carousel">
        {tvShows.map((show, index) => (
          <div key={index} className="outline-none">
            <div className="relative h-[600px]">
              <img
                src={show.image}
                alt={show.title}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                loading={index === 0 ? "eager" : "lazy"} 
                width="600"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 text-white">
                <h3 className="text-4xl font-semibold mb-2">{show.title}</h3>
                <p className="text-xl mb-4">{show.subtitle}</p>
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors">
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
