'use client';

import { AuthActions } from '@/modules/auth/slice';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch();

  // Lấy trạng thái từ Redux store

  useEffect(() => {
    if (token) {
      dispatch(
        AuthActions.acceptEmail({
          token,
          onSuccess: (res :any) => {
            console.log('Response from server:', res);
          },
          onError: (err :any) => {
            console.error('Error:', err);
          },
        })
      );
    }
  }, [token, dispatch]);

  return (
    <div className='text-fontColor'>
      <h1>Verify Email</h1>
    </div>
  );
};

export default VerifyEmail;
