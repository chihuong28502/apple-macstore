"use client";
import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import { OrderActions, OrderSelectors } from "@/modules/order/slice";
import { loadStripe } from "@stripe/stripe-js";
import _ from "lodash";
import { useEffect } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const StripeCheckout = ({ code }: any) => {
  const dispatch = useAppDispatch();
  const checkout = useAppSelector(OrderSelectors.creditPaymentMethod);

  useEffect(() => {
    if (!_.isEmpty(code)) {
      dispatch(OrderActions.getCreditCardPayment(code));
    }
  }, [code]);

  useEffect(() => {
    if (checkout) {
      let creditCardPayment: any = null;
      const initializeStripe = async () => {
        const stripe: any = await stripePromise;
        const fetchClientSecret = () => checkout;
        creditCardPayment = await stripe.initEmbeddedCheckout({
          fetchClientSecret,
        });

        // Mount the checkout form
        creditCardPayment.mount("#checkout");
      };

      initializeStripe();

      return () => {
        if (creditCardPayment) {
          creditCardPayment.destroy(); // Hủy instance nếu tồn tại
          creditCardPayment = null;
        }
      };
    }
  }, [checkout]);

  return (
    <div className="mt-5 bg-layout">
      <div className="bg-layout" id="checkout"></div>
    </div>
  );
};

export default StripeCheckout;
