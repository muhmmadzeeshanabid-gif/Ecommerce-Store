"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      fontFamily: "'Outfit', system-ui, sans-serif",
      fontSmoothing: "antialiased",
      color: "#000000",
      letterSpacing: "0.025em",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444", iconColor: "#ef4444" },
  },
  hidePostalCode: true,
};

const StripePaymentForm = ({ amount, clientSecret, onSuccess, onLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    onLoading(true);
    setErrorMessage(null);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
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
      {/* Card Input */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Card Details</p>
        <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 transition-all focus-within:border-black">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-[9px] text-gray-300 uppercase tracking-widest font-medium flex items-center gap-2">
          🔒 256-bit SSL encrypted · Powered by Stripe
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[11px] font-bold uppercase tracking-widest">
          {errorMessage}
        </div>
      )}

      {/* Pay Button */}
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

