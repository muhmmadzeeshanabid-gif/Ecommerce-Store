"use client";

import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const StripePaymentForm = ({ amount, onSuccess, onLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    onLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/checkout?success=true",
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment Confirmation Error:", error);
      setErrorMessage(error.message);
      setIsProcessing(false);
      onLoading(false);
    } else if (paymentIntent) {
      if (paymentIntent.status === "succeeded" || paymentIntent.status === "processing") {
        onSuccess();
      } else {
        setErrorMessage("Payment failed with status: " + paymentIntent.status);
        setIsProcessing(false);
        onLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-sm">
        <PaymentElement 
          options={{
            layout: {
              type: 'accordion',
              defaultCollapsed: false,
              radios: 'always',
              spacedAccordionItems: true
            },
            wallets: {
              applePay: 'never',
              googlePay: 'never',
            },
            paymentMethodOrder: ['card'],
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[11px] font-black uppercase tracking-widest text-center">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
          className="w-full md:w-auto md:min-w-[320px] px-12 py-6 bg-black text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 rounded-full disabled:opacity-50"
        >
          {isProcessing ? "Processing Security..." : "Complete Payment"}
        </button>
      </div>
    </div>
  );
};

export default StripePaymentForm;
