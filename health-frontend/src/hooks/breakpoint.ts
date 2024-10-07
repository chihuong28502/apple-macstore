'use client'
import { useState, useEffect } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,  // Gán giá trị mặc định ban đầu là 0
    height: 0,
  });

  useEffect(() => {
    // Chỉ chạy hiệu ứng nếu mã đang được thực thi trên client
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Thiết lập kích thước cửa sổ ban đầu
      handleResize();

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
}
