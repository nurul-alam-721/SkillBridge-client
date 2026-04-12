"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";
import { Loader2, ShieldCheck, Lock, CreditCard } from "lucide-react";

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutForm({ bookingId, amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/bookings`,
        },
      });

      if (error) {
        setErrorMessage(error.message ?? "An unexpected error occurred.");
        toast.error(error.message ?? "Payment failed.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Sync with backend
        await paymentService.confirmPayment({
          bookingId,
          paymentIntentId: paymentIntent.id,
        });
        
        onSuccess();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      const msg = err?.response?.data?.message ?? "Failed to sync payment with server.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-muted/30 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Order Summary</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold">BDT {amount}</span>
            <span className="text-sm text-muted-foreground">total</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure payment processed by Stripe</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Payment Details</label>
          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <PaymentElement 
              options={{ 
                layout: "tabs",
                business: { name: "SkillBridge" }
              }} 
            />
          </div>
        </div>

        {errorMessage && (
          <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto flex-1 h-11"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto flex-[2] h-11 gap-2 font-semibold"
            disabled={!stripe || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {isLoading ? "Processing..." : `Pay BDT ${amount}`}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By clicking "Pay", you agree to our Terms of Service.
        </p>
      </form>
    </div>
  );
}
