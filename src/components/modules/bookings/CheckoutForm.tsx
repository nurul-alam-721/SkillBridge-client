"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
  userEmail: string;
  userName?: string;
  tutorName?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutForm({
  bookingId,
  amount,
  userEmail,
  userName,
  tutorName,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(
          submitError.message ?? "Please check your payment details.",
        );
        setIsLoading(false);
        return;
      }

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
      } else if (paymentIntent?.status === "succeeded") {
        await paymentService.confirmPayment({
          bookingId,
          paymentIntentId: paymentIntent.id,
        });
        onSuccess();
      }
    } catch (err) {
      const msg =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      const message = msg ?? "Failed to sync payment with server.";
      setErrorMessage(message);
      toast.error(message);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Amount row ── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Total due
          </p>
          <p className="text-2xl font-bold text-white mt-0.5 tracking-tight">
            ৳ {amount.toLocaleString()}
          </p>
        </div>
        {tutorName && (
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              Session with
            </p>
            <p className="text-sm font-semibold text-white/80 mt-0.5">
              {tutorName}
            </p>
          </div>
        )}
      </div>

      {/* ── Stripe PaymentElement ── */}
      <div>
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">
          Payment details
        </p>
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: { type: "tabs", defaultCollapsed: false },
            business: { name: "SkillBridge" },

            defaultValues: {
              billingDetails: {
                name: userName || userEmail || "",
                email: userEmail || "",
                phone: "",
                address: {
                  country: "BD",
                },
              },
            },
            terms: { card: "never" },
          }}
        />
      </div>

      {/* ── Error ── */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <span className="mt-px shrink-0">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="h-11 px-5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white/80 disabled:opacity-40"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!stripe || !isReady || isLoading}
          onClick={handlePay}
          className="flex-1 h-11 rounded-xl text-sm font-semibold text-slate-900 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isLoading ? "rgba(255,255,255,0.7)" : "#FFFFFF",
            boxShadow: isLoading ? "none" : "0 2px 12px rgba(255,255,255,0.10)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
              <span className="text-slate-500">Processing…</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              Pay ৳ {amount.toLocaleString()}
            </>
          )}
        </button>
      </div>

      {/* ── Trust badge ── */}
      <div className="flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3 w-3 text-emerald-400" />
        <p className="text-[11px] text-white/25">
          Secured by Stripe · 256-bit SSL
        </p>
      </div>
    </div>
  );
}
