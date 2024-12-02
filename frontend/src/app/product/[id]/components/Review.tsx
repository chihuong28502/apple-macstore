import { AuthSelectors } from '@/modules/auth/slice';
import { ReviewActions, ReviewSelectors } from '@/modules/review/slice';
import { Button, Form, Input, Modal, Progress, Rate } from 'antd';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';

const Reviews: React.FC<any> = ({ productId }) => {
  const dispatch = useDispatch();
  const reviewsByProductId = useSelector(ReviewSelectors.reviewByProductId);
  const isLoadingByProductId = useSelector(ReviewSelectors.isLoadingReviewByProductId);
  const auth = useSelector(AuthSelectors.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  // Fetch reviews when productId changes
  useEffect(() => {
    dispatch(ReviewActions.fetchReviewByProductId(productId));
  }, [dispatch, productId]);

  // Hàm mở modal xem tất cả review
  const showAllReviews = () => setIsModalVisible(true);

  // Hàm đóng modal xem tất cả review
  const handleCancel = () => setIsModalVisible(false);

  // Hàm mở modal chỉnh sửa review
  const showEditModal = (review: any) => {
    setEditingReview(review);
    setIsEditModalVisible(true);
  };

  // Hàm đóng modal chỉnh sửa review
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingReview(null);
  };

  // Hàm xử lý chỉnh sửa review
  const handleEdit = (values: any) => {
    if (editingReview) {
      dispatch(ReviewActions.editReview({
        id: editingReview._id,
        productId,
        ...values
      }));
      setIsEditModalVisible(false);
      setEditingReview(null);
    }
  };

  // Hàm xử lý xóa review
  const handleDelete = (reviewId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        dispatch(ReviewActions.deleteReview({ productId, reviewId }));
      },
    });
  };

  // Tính toán tỷ lệ phần trăm các đánh giá
  const calculateRatingPercentages = () => {
    const ratingCounts: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsByProductId?.forEach((review: any) => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });
    const totalReviews = reviewsByProductId?.length || 0;
    return Object.entries(ratingCounts).map(([rating, count]: any) => ({
      rating: Number(rating),
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
    }));
  };

  const ratingPercentages = calculateRatingPercentages();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800">Reviews ({reviewsByProductId?.length})</h3>
      {isLoadingByProductId ? (
        <section className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          ))}
        </section>
      ) : (
        <>
          <div className="space-y-3 mt-4">
            {ratingPercentages.map(({ rating, percentage }) => (
              <div className="flex items-center p-0 m-0" key={rating}>
                <p className="text-sm text-gray-800 font-bold my-0">{rating}.0</p>
                <svg className="w-5 fill-orange-400 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <Progress percent={percentage} status="normal" showInfo={false} strokeColor="#FFA500" className="w-full ml-3" />
                <p className="text-sm text-gray-800 font-bold ml-3 mb-0">{percentage.toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </>
      )
      }
      {/* Hiển thị các review hoặc loading spinner */}
      {isLoadingByProductId ? (
        <section className="grid grid-cols-1 gap-3">
          {Array.from({ length: 1 }).map((_, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="mt-4 flex gap-4">
                  <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        reviewsByProductId?.length > 0 && (
          <div className="flex items-start mt-8">
            <img src="https://readymadeui.com/team-2.webp" className="w-12 h-12 rounded-full border-2 border-white" alt="Reviewer" />
            <div className="ml-3">
              <h4 className="text-sm font-bold">{reviewsByProductId[0]?.user_id?.email}</h4>
              <div className="flex space-x-1 mt-1">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className={`w-4 ${index < reviewsByProductId[0]?.rating ? 'fill-orange-400' : 'fill-[#CED5D8]'}`} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs mt-4">{reviewsByProductId[0]?.review_text}</p>
            </div>
          </div>
        )
      )}

      <Button className="w-full mt-8 px-4 py-2.5 bg-transparent border border-orange-400 text-gray-800 font-semibold rounded-lg" onClick={showAllReviews}>
        Read all reviews
      </Button>

      {/* Modal hiển thị tất cả các review */}
      <Modal title="All Reviews" visible={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
        <div className="space-y-1">
          {isLoadingByProductId ? (
            <section className="grid grid-cols-1 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
                    <div className="mt-4 flex gap-4">
                      <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            reviewsByProductId?.map((review: any) => (
              <div key={review._id} className="flex items-start">
                <img
                  src="https://readymadeui.com/team-2.webp"
                  alt={`Reviewer ${review.user_id.email}`}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div className="ml-3 flex-grow">
                  {auth?._id && (
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold">{review.user_id.email}</h4>
                      {auth._id === review.user_id._id && (
                        <div>
                          <Button type="link" onClick={() => showEditModal(review)}><FaEdit /></Button>
                          <Button type="link" danger onClick={() => handleDelete(review._id)}><FaTrashAlt /></Button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex space-x-1 mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 ${index < review.rating ? 'fill-orange-400' : 'fill-[#CED5D8]'}`}
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs mt-4">{review.review_text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal chỉnh sửa review */}
      <Modal
        title="Edit Review"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={800}
      >
        <Form initialValues={editingReview} onFinish={handleEdit}>
          <Form.Item
            name="review_text"
            rules={[{ required: true, message: 'Please enter your review' }]}
          >
            <Input.TextArea placeholder="Your review" />
          </Form.Item>
          <Form.Item name="rating" rules={[{ required: true, message: 'Please rate the product' }]}>
            <Rate />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Reviews;
