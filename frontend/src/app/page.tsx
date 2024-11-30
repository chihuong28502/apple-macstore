"use client";
import TripleSlider from "@/components/Slider/Slider";
import { IntroductionActions, IntroductionSelectors } from "@/modules/introduction/slice";
import { Button, Skeleton } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  const ads = useSelector(IntroductionSelectors.introductionByAds) || [];
  const banner = useSelector(IntroductionSelectors.introductionByBanner) || [];

  useEffect(() => {
    dispatch(IntroductionActions.fetchIntroductionByAds());
    dispatch(IntroductionActions.fetchIntroductionByBanner());
  }, [dispatch]);

  return (
    <div className="bg-mainLayout rounded-xl p-4 mx-4 ">
      {banner.length > 0 ? (
        <div className="w-full h-full">
          <TripleSlider slides={banner} />
        </div>
      ) : (
        <div className="bg-mainLayout rounded-xl p-4">
          <div className="w-full h-full">
            <Skeleton.Image className="w-full h-64" active={true} />
            <div className="mt-4 flex gap-4">
              <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-8">
        {ads.length > 0 ? (
          ads.map((promo) => (
            <div
              key={promo._id}
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                loading="lazy"
                width={300}
                height={300}
                src={promo.images?.image || "/placeholder.png"}
                alt={promo.images?.publicId || "placeholder"}
                className="w-full h-56 object-contain"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800">{promo.name}</h3>
                <p className="mt-2 text-gray-600">{promo.description}</p>

                <div className="mt-4 flex gap-4">
                  <Button type="primary" className="flex-1">
                    Learn More
                  </Button>
                  <Button type="default" className="flex-1">
                    Buy ngay bây giờ
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden m-1"
            >
              {/* Skeleton cho hình ảnh */}
              <div className="w-full h-56 bg-gray-300 animate-pulse"></div>

              {/* Skeleton cho nội dung */}
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded-md animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="mt-4 flex gap-4">
                  <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
