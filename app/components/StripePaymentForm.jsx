"use client";

import React, { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const StripePaymentForm = ({ amount, clientSecret, onSuccess, onLoading }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    onLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/50">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '15px',
                  fontFamily: 'system-ui, sans-serif',
                  color: '#000000',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
              hidePostalCode: true
            }}
          />
        </div>
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
        className="w-full btn-animate px-14 py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 rounded-full"
      >
        {isProcessing ? "Verifying Transaction..." : `Pay $${amount} Securely`}
      </button>
    </div>
  );
};

export default StripePaymentForm;
