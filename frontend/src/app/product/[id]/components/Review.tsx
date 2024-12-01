'use client'

import { Button, Modal, Slider, Progress } from 'antd';
import { useState } from 'react';

const Reviews = ({ showModal }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showAllReviews = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800">Reviews(10)</h3>
      <div className="space-y-3 mt-4">
        {[5.0, 4.0, 3.0, 2.0, 1.0].map((rating, index) => {
          const percentage = (5 - index) * 20;
          return (
            <div className="flex items-center p-0 m-0" key={index}>
              <p className="text-sm text-gray-800 font-bold my-0">{rating}</p>
              <svg className="w-5 fill-orange-400 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>

              <Progress
                percent={percentage}
                status="normal"
                showInfo={false}
                strokeColor="#FFA500" 
                className="w-full ml-3"
              />
              <p className="text-sm text-gray-800 font-bold ml-3 mb-0">{percentage}%</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-start mt-8">
        <img src="https://readymadeui.com/team-2.webp" className="w-12 h-12 rounded-full border-2 border-white" alt="John Doe" />
        <div className="ml-3">
          <h4 className="text-sm font-bold">John Doe</h4>
          <div className="flex space-x-1 mt-1">
            {[...Array(3)].map((_, index) => (
              <svg key={index} className="w-4 fill-orange-400" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
            ))}
            {[...Array(2)].map((_, index) => (
              <svg key={index} className="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
            ))}
            <p className="text-xs !ml-2 font-semibold">2 mins ago</p>
          </div>
          <p className="text-xs mt-4">The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.</p>
        </div>
      </div>
      <Button
        className="w-full mt-8 px-4 py-2.5 bg-transparent border border-orange-400 text-gray-800 font-semibold rounded-lg"
        onClick={showAllReviews}
      >
        Read all reviews
      </Button>

      <Modal
        title="All Reviews"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((reviewIndex) => (
            <div key={reviewIndex} className="flex items-start">
              <img
                src="https://readymadeui.com/team-2.webp"
                alt={`Reviewer ${reviewIndex}`}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="ml-3">
                <h4 className="text-sm font-bold">John Doe</h4>
                <div className="flex space-x-1 mt-1">
                  {[...Array(3)].map((_, index) => (
                    <svg key={index} className="w-4 fill-orange-400" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                  ))}
                  {[...Array(2)].map((_, index) => (
                    <svg key={index} className="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                  ))}
                  <p className="text-xs !ml-2 font-semibold">2 mins ago</p>
                </div>
                <p className="text-xs mt-4">
                  The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Reviews;
