import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import UnitedStatesIcon from "./images/UnitedStates.webp";
import VietNamIcon from "./images/VietNam.webp";

const dataList = [
  {
    value: "vi",
    title: "Việt Nam",
    rate: "VND",
    image: VietNamIcon,
  },
  {
    value: "en",
    title: "English",
    rate: "USD",
    image: UnitedStatesIcon,
  },
];

export default function SelectLanguage({ textColor }: { textColor?: string }) {
  const [current, setCurrent] = useState("vi");
  const [dropDown, setDropDown] = useState(false);
  const btnRef: any = useRef();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const lang = pathname.split("/")[1];
    if (dataList.some((item) => item.value === lang)) {
      setCurrent(lang);
    } else {
      setCurrent("vi");
    }
  }, [pathname, dataList]);

  const handleDropDown = () => {
    setDropDown((_prev) => !_prev);
  };

  const handlePickLanguage = (data: any) => {
    if (data.value !== current) {
      setDropDown(false);
      setCurrent(data.value);
      router.replace(`/${data.value}`);
    }
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (!btnRef.current?.contains(e.target)) {
        setDropDown(false);
      }
    });
  }, []);

  return (
    <div className="flex justify-center items-center flex-col z-1 relative ml-6 ">
      <div>
        {dataList.map((item: any, index: number) => {
          if (current === item.value) {
            return (
              <div
                ref={btnRef}
                key={index}
                className={`flex justify-center items-center gap-0.5 md:gap-2 text-[${
                  textColor ? textColor : "#FF8900"
                }] cursor-pointer text-base`}
                onClick={handleDropDown}
              >
                <Image
                  alt={item?.title}
                  width={32}
                  // height={32}
                  src={item?.image}
                  className="object-cover"
                />
                <p className="text-xs md:text-base font-bold text-fontColor m-0 text-nowrap">
                  {item?.title}
                </p>
                <MdKeyboardArrowDown width={12} className="text-fontColor" />
              </div>
            );
          }
        })}
      </div>
      <div className="flex justify-center">
        {dropDown && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-[150px] flex p-[12px] px-1 absolute right-0 top-full mt-2 flex-col border-solid border-1 shadow-2xl z-100 rounded-md gap-[8px] bg-popupLanguage"
            >
              {dataList.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="grid hover:bg-[#e5e5e5] place-items-center grid-cols-5 cursor-pointer gap-[2px] text-[16px]  py-0.5 rounded px-1.5"
                    onClick={() => handlePickLanguage(item)}
                  >
                    <Image
                      alt={item?.title}
                      width={32}
                      // height={32}
                      src={item?.image}
                      className="object-cover col-span-2 self-center"
                    />
                    <p className="text-fontColor text-nowrap col-span-3">
                      {item?.title}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
