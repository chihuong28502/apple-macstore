import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useState } from "react";

interface Props {
  slides: any[];
}

const TripleSlider = ({ slides }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideClick = useCallback((clickedIndex: number) => {
    setCurrentIndex(clickedIndex);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[1200px] h-[300px] flex items-center justify-center perspective-1000">
        {slides.map((slide, index) => {
          const offset = (index - currentIndex + slides.length) % slides.length;
          const isActive = offset === 0;
          const isPrev = offset === slides.length - 1; // Kiểm tra nếu slide trước đó là slide cuối cùng

          return (
            <motion.div
              key={slide._id}
              className="absolute w-[45%] h-0 pb-[20%] cursor-pointer mt-12"
              initial={false}
              animate={{
                x: isActive ? 0 : isPrev ? "-80%" : "80%",
                y: isActive ? "-70px" : "0px",
                z: isActive ? 50 : -100,
                rotateY: isActive ? 0 : isPrev ? 15 : -15,
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1.1 : 1,
              }}
              style={{
                zIndex: isActive ? 10 : 1,
              }}
              transition={{ duration: 0.5 }}
              onClick={() => handleSlideClick(index)}
            >
              <div
                className={`absolute inset-0 ${
                  !isActive ? "grayscale" : ""
                } overflow-hidden rounded-lg shadow-lg`}
              >
                <Image
                  fill
                  priority 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-lg font-bold truncate">
                    {slide.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TripleSlider;
