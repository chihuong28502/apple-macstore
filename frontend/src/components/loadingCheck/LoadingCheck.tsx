"use client"
import { Check, XCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { memo, useEffect } from "react";

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes scale {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-scale {
    animation: scale 0.5s ease-out;
  }
`;

interface Props {
  isLoading: boolean;
  isCompleted: boolean;
  blur?: any;
  loadingText?: string;
  completedText?: string;
  autoHideDelay?: number;
  onComplete: any;
  completedFailText: string;
  paymentStatus: boolean;
}

const FullScreenLoading = ({
  isLoading,
  isCompleted,
  blur = true,
  completedText = "Hoàn thành!",
  completedFailText = "Thanh toán thất bại",
  paymentStatus = false,
  autoHideDelay = 3000,
  onComplete = () => { },
}: Props) => {
  const route = useRouter()
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        onComplete();
        route.push('/');
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, autoHideDelay, onComplete, isLoading]);

  if (!isLoading && !isCompleted) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center
          ${blur ? "backdrop-blur-sm" : "bg-black/50"}
          transition-opacity duration-300`}
      >
        <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
          {isCompleted && (
            <div className="flex flex-col items-center gap-4 animate-fadeIn">
              {paymentStatus ? (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-500 animate-scale" />
                </div>
              ) : (
                <div className="h-12 w-12 flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-500 animate-scale" />
                </div>
              )}
              <p
                className={`text-lg font-medium 
                  ${paymentStatus ? "text-green-600" : "text-red-600"}`}
              >
                {paymentStatus ? completedText : completedFailText}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(FullScreenLoading);
