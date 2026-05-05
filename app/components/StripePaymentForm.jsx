"use client";

import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

const StripePaymentForm = ({ onSuccess, onLoading, onValidate, isStep1Complete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  // Automatically clear errors when the user finishes a step
  React.useEffect(() => {
    if (isStep1Complete || isCardComplete) {
      setErrorMessage(null);
    }
  }, [isStep1Complete, isCardComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Step 1 (Shipping)
    if (onValidate) {
      const isValid = onValidate();
      if (!isValid) {
        // validateStep1 in the parent scrolls to the field and focuses it
        setErrorMessage("Please complete your shipping information above.");
        return;
      }
    }

    // 2. Validation Step 2 (Card)
    if (!isCardComplete) {
      setErrorMessage("Please complete your card details below.");
      // Find the Stripe element and scroll to it if possible, but usually just showing error is enough
      return;
    }

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
      console.error("Full Payment Error Object:", JSON.stringify(error, null, 2));
      setErrorMessage(error.message + " (Hint: use test card 4242...)");
      setIsProcessing(false);
      onLoading(false);
    } else if (paymentIntent) {
      if (paymentIntent.status === "succeeded") {
        onSuccess();
      } else {
        setErrorMessage("Payment failed: " + paymentIntent.status);
        setIsProcessing(false);
        onLoading(false);
      }
    }
  };

  // Button is only truly disabled if Stripe hasn't loaded or we are already processing
  const isButtonDisabled = !stripe || isProcessing;
  // Visual state to show if it's "ready" or "needs attention"
  const isReady = isStep1Complete && isCardComplete;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Validation Status Summary */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {isStep1Complete ? (
            <CheckCircle2 size={14} className="text-green-500" />
          ) : (
            <AlertCircle size={14} className="text-zinc-300" />
          )}
          <span className={`text-[9px] uppercase tracking-widest font-medium ${isStep1Complete ? 'text-green-600' : 'text-zinc-400'}`}>
            Step 1: Shipping {isStep1Complete ? 'Ready' : 'Pending'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isCardComplete ? (
            <CheckCircle2 size={14} className="text-green-500" />
          ) : (
            <AlertCircle size={14} className="text-zinc-300" />
          )}
          <span className={`text-[9px] uppercase tracking-widest font-medium ${isCardComplete ? 'text-green-600' : 'text-zinc-400'}`}>
            Step 2: Card {isCardComplete ? 'Ready' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Lock size={14} className="text-zinc-300" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Card Payment Only</span>
        </div>

        <PaymentElement 
          onReady={() => console.log("Stripe Ready")}
          onChange={(event) => setIsCardComplete(event.complete)}
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
              radios: 'never',
            },
            paymentMethodOrder: ['card']
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[10px] font-medium uppercase tracking-widest text-center animate-bounce">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`w-full py-6 text-[11px] font-medium uppercase tracking-[0.4em] rounded-full shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${isReady ? 'bg-black text-white hover:bg-neutral-800' : 'bg-neutral-700 text-white opacity-80 cursor-pointer'}`}
        >
          {isProcessing ? "Finalizing Order..." : "Confirm & Pay Now"}
          {!isProcessing && <Lock size={16} />}
        </button>
      </div>
    </div>
  );
};

export default StripePaymentForm;
