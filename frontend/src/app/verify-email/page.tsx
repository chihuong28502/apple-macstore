// 'use client';

// import { AuthActions } from '@/modules/auth/slice';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Result, Spin } from 'antd';
// import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
// import Link from 'next/link';

// const VerifyEmail = () => {
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');
//   const dispatch = useDispatch();
//   const [verifyStatus, setVerifyStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   useEffect(() => {
//     if (token) {
//       dispatch(
//         AuthActions.acceptEmail({
//           token,
//           onSuccess: () => {
//             setVerifyStatus('success');
//           },
//           onError: (err: any) => {
//             setVerifyStatus('error');
//             setErrorMessage(err.message || 'Có lỗi xảy ra trong quá trình xác thực email');
//           },
//         })
//       );
//     } else {
//       setVerifyStatus('error');
//       setErrorMessage('Token không hợp lệ');
//     }
//   }, [token, dispatch]);

//   const renderContent = () => {
//     switch (verifyStatus) {
//       case 'loading':
//         return (
//           <div className="flex flex-col items-center justify-center">
//             <Spin size="large" />
//             <p className="mt-4 text-lg">Đang xác thực email của bạn...</p>
//           </div>
//         );
//       case 'success':
//         return (
//           <Result
//             icon={<SmileOutlined className="text-green-500 text-6xl" />}
//             status="success"
//             title="Xác thực email thành công!"
//             subTitle="Chúc mừng! Bạn đã xác thực email thành công. Bây giờ bạn có thể đăng nhập vào hệ thống."
//           />
//         );
//       case 'error':
//         return (
//           <Result
//             icon={<FrownOutlined className="text-red-500 text-6xl" />}
//             status="error"
//             title="Xác thực email không thành công!"
//             subTitle={errorMessage}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
//       {renderContent()}
//       <Link className="mt-4 text-blue-500 hover:underline" href="/login">
//         Quay lại đăng nhập
//       </Link>
//     </div>
//   );
// };

// export default VerifyEmail;
