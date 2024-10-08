import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import React from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const updateCursor = (e: MouseEvent) => {
      if (cursor) {
        const { clientX: x, clientY: y } = e;
        gsap.to(cursor, {
          x: x - cursor.clientWidth / 2,
          y: y - cursor.clientHeight / 2,
          duration: 0.1,
          ease: "power1.out",
        });
      }
    };

    document.addEventListener("mousemove", updateCursor);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none w-auto h-auto p-[10px] text-2xl font-[Open Sans,sans-serif] font-black flex justify-center items-center rounded z-[9999] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_right,#333,#007bff,#e83e8c)] bg-clip-text text-transparent uppercase"
    >
      TOPCLICK
    </div>
  );
};

export default CustomCursor;
