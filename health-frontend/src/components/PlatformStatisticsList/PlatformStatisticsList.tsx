import React from "react";
import UpPlatformIcon from "@/asset/icons/UpPlatformIcon";
import ViewIcon from "@/asset/icons/ViewIcon";
import CommentIcon from "@/asset/icons/CommentIcon";
import LikeIcon from "@/asset/icons/LikeIcon";
import UpIcon from "@/asset/icons/UpIcon";
import DownIcon from "@/asset/icons/DownIcon";
import { SVGDecreaseSmall } from "@/asset/svg";
import Image from "next/image";

const PlatformStatisticsList = ({
  item,
  index,
  imageURL,
  classList,
}: {
  item: any;
  index: number;
  imageURL: string;
  flag: number;
  classList: string;
}) => {
  return (
    <div key={`${index}`} className={classList}>
      <div className="keyword-modal-one-report-header">
        <div>
          <Image
            width={36}
            src={`${imageURL}${item?.platform}.png`}
            alt={item?.platform}
          />
        </div>
        <div className="keyword-modal-one-report-header-name">
          {item?.platform.charAt(0).toUpperCase()}
          {item?.platform.slice(1)}
        </div>
        <div>
          {item?.volumePoint > 0 ? <UpPlatformIcon /> : <SVGDecreaseSmall />}
        </div>
        <div className="keyword-modal-one-report-header-value">
          {Math.abs(item?.volumePoint)}
        </div>
      </div>
      <div className="keyword-modal-one-report-body">
        <table className="w-full">
          <tr>
            <td className="w-full"></td>
            <td>
              <div className="flex items-center  w-[50px] justify-end">
                <div className="keyword-modal-one-report-view">view</div>
                <div>
                  <ViewIcon />
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center  w-[70px] justify-end">
                <div className="keyword-modal-one-report-view">comments</div>
                <div>
                  <CommentIcon />
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center w-[50px] justify-end">
                <div className="keyword-modal-one-report-view">like</div>
                <div>
                  <LikeIcon />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="keyword-modal-one-report-lb">Hôm qua</div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.viewGrowthRate?.yesterday > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.viewGrowthRate?.yesterday)}
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.commentGrowthRate?.yesterday > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.commentGrowthRate?.yesterday)}
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.likeGrowthRate?.yesterday > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.likeGrowthRate?.yesterday)}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="keyword-modal-one-report-lb">Tuần trước</div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.viewGrowthRate?.lastWeek > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.viewGrowthRate?.lastWeek)}
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.commentGrowthRate?.lastWeek > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.commentGrowthRate?.lastWeek)}
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.likeGrowthRate?.lastWeek > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.likeGrowthRate?.lastWeek)}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="keyword-modal-one-report-lb">Tháng trước</div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.viewGrowthRate?.lastMonth > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.viewGrowthRate?.lastMonth || 0)}
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.commentGrowthRate?.lastMonth > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.commentGrowthRate?.lastMonth || 0)}
                </div>
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                <div>
                  {item?.likeGrowthRate?.lastMonth > 0 ? (
                    <UpIcon />
                  ) : (
                    <DownIcon />
                  )}
                </div>
                <div className="keyword-modal-one-report-vl">
                  {Math.abs(item?.likeGrowthRate?.lastMonth || 0)}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default PlatformStatisticsList;
