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
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      onLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <PaymentElement 
          options={{
            layout: 'tabs',
            wallets: { applePay: 'never', googlePay: 'never' },
            fields: {
              billingDetails: { address: { country: 'never' } }
            }
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[11px] font-bold uppercase tracking-widest">
          {errorMessage}
        </div>
      )}

      <button
        id="stripe-submit-button"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing}
        className="w-full btn-animate px-14 py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${amount} Securely`}
      </button>
    </div>
  );
};

export default StripePaymentForm;
