import Image from "next/image";
import { useState } from "react";
import Slider from "react-slick";

interface Props {
  slides: any[];
}

const TripleSlider = ({ slides }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideClick = (clickedIndex: number) => {
    setCurrentIndex(clickedIndex);
  };

  const settings = {
    infinite: true,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    focusOnSelect: true,
    afterChange: (index: number) => setCurrentIndex(index),
    nextArrow: (
      <div className="slick-next absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
      </div>
    ),
    prevArrow: (
      <div className="slick-prev absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="relative w-full h-full mb-20">
      <Slider {...settings}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide._id}
              className={`w-full ${!isActive ? "grayscale" : ""} relative`}
              onClick={() => handleSlideClick(index)}
            >
              <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  priority
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-lg font-bold truncate">
                    {slide.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default TripleSlider;
