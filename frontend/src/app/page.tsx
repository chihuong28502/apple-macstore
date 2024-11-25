"use client";

import TripleSlider from "@/components/Slider/Slider";
import { IntroductionActions, IntroductionSelectors } from "@/modules/introduction/slice";
import { Button } from "antd";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function Home() {
  const dispatch = useDispatch();
  
  const ads = useSelector(IntroductionSelectors.introductionByAds) || [];
  const banner = useSelector(IntroductionSelectors.introductionByBanner) || [];

  useEffect(() => {
    dispatch(IntroductionActions.fetchIntroductionByAds());
    dispatch(IntroductionActions.fetchIntroductionByBanner());
  }, [dispatch]);

  return (
    <div className="bg-mainLayout rounded-xl p-4">
      {/* Kiểm tra và hiển thị banner nếu có */}
      {banner.length > 0 ? (
        <div className="w-full h-full">
          <TripleSlider slides={banner} />
        </div>
      ) : (
        <p>Loading banner...</p>
      )}

      {/* Kiểm tra và hiển thị quảng cáo nếu có */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {ads.length > 0 ? (
          ads.map((promo) => (
            <div
              key={promo._id}
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Image
                width={300}
                height={300}
                src={promo.images?.image || "/placeholder.png"}
                alt={promo.images?.publicId || "placeholder"}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800">{promo.name}</h3>
                <p className="mt-2 text-gray-600">{promo.description}</p>

                <div className="mt-4 flex gap-4">
                  <Button type="primary" className="flex-1">
                    Learn More
                  </Button>
                  <Button type="default" className="flex-1">
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No promotions available.</p>
        )}
      </section>
    </div>
  );
}
