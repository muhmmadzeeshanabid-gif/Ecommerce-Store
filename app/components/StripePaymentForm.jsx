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
        payment_method_data: {
          billing_details: {
            address: {
              country: 'US', // Default country since field is hidden
            }
          }
        }
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment Confirmation Error:", error);
      setErrorMessage(error.message);
      setIsProcessing(false);
      onLoading(false);
    } else if (paymentIntent) {
      console.log("Payment Intent Status:", paymentIntent.status);
      if (paymentIntent.status === "succeeded") {
        onSuccess();
      } else if (paymentIntent.status === "processing") {
        // Redirect to a success page or show success if it's processing
        onSuccess(); 
      } else {
        setErrorMessage("Payment status: " + paymentIntent.status + ". Please check your account.");
        setIsProcessing(false);
        onLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            wallets: {
              applePay: 'never',
              googlePay: 'never',
            },
            fields: {
              billingDetails: {
                address: {
                  country: 'never',
                  postalCode: 'never',
                }
              }
            }
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[11px] font-bold uppercase tracking-widest">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-center">
        <button
          id="stripe-submit-button"
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
          className="w-full md:w-auto md:min-w-[280px] btn-animate px-10 py-3.5 bg-black text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default StripePaymentForm;
