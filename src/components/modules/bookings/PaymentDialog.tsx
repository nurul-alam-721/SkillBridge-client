"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckoutForm } from "./CheckoutForm";
import { paymentService } from "@/services/payment.service";
import { Booking } from "@/services/booking.service";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CurrentUser } from "@/services/user.service";

const stripePromise = getStripe();

const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#FFFFFF",
    colorBackground: "#1C2333",
    colorText: "#F1F5F9",
    colorDanger: "#F87171",
    colorTextSecondary: "#94A3B8",
    colorTextPlaceholder: "#475569",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    spacingUnit: "4px",
    borderRadius: "10px",
    fontSizeBase: "14px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "none",
      padding: "10px 12px",
      backgroundColor: "#131929",
    },
    ".Input:focus": {
      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow: "none",
    },
    ".Label": {
      fontSize: "11px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "#475569",
      marginBottom: "6px",
    },
    ".Tab": {
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "none",
      backgroundColor: "#131929",
    },
    ".Tab--selected": {
      border: "1px solid rgba(255,255,255,0.25)",
      backgroundColor: "#1C2333",
    },
    ".TabLabel--selected": {
      color: "#F1F5F9",
      fontWeight: "600",
    },
    ".Error": {
      color: "#F87171",
      fontSize: "12px",
    },
  },
};

interface PaymentDialogProps {
  user: CurrentUser | null;
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentDialog({
  user,
  open,
  booking,
  onClose,
  onSuccess,
}: PaymentDialogProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (open && booking && !clientSecret && !isSuccess) {
      const getIntent = async () => {
        setIsLoading(true);
        try {
          const result = await paymentService.createPaymentIntent(booking.id);
          setClientSecret(result.clientSecret);
        } catch (err) {
           const msg =
    err instanceof Error && "response" in err
      ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined;
  toast.error(msg ?? "Failed to initialize payment.");
  onClose();
        } finally {
          setIsLoading(false);
        }
      };
      getIntent();
    }
  }, [open, booking, clientSecret, onClose, isSuccess]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setClientSecret(null);
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!booking) return null;

  const tutorName = booking.tutorProfile.user?.name;

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2200);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className="sm:max-w-[440px] p-0 border-0"
        style={{
          borderRadius: "20px",
          background: "#0F1624",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px -10px rgba(0,0,0,0.7)",
          maxHeight: "min(680px, 90dvh)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogTitle className="sr-only">Secure Checkout</DialogTitle>
        <DialogDescription className="sr-only">
          Complete your payment for a session with {tutorName ?? "your tutor"}.
        </DialogDescription>

        <AnimatePresence mode="wait">

          {/* ── Success ── */}
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center py-16 px-8 text-center gap-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 14, stiffness: 220, delay: 0.06 }}
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.25)",
                }}
              >
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                <h3 className="text-xl font-bold text-white mb-1">Payment confirmed</h3>
                <p className="text-sm text-white/50">
                  Your session with{" "}
                  <span className="font-semibold text-white/80">{tutorName}</span>{" "}
                  is now booked.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-xs text-white/30"
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                Redirecting…
              </motion.div>
            </motion.div>

          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              // This wrapper must fill the dialog and be a flex column
              style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
            >
              {/* ── Sticky header — never scrolls ── */}
              <div
                style={{
                  flexShrink: 0,
                  padding: "24px 24px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>
                  Checkout
                </h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                  Session with{" "}
                  <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                    {tutorName}
                  </span>
                </p>
              </div>

              {/* ── Scrollable body — grows and scrolls ── */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: "20px 24px",
                }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-4">
                    <Loader2 className="h-5 w-5 animate-spin text-white/30" />
                    <p className="text-sm text-white/30">Preparing secure checkout…</p>
                  </div>

                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: stripeAppearance }}
                  >
                    <CheckoutForm
                      bookingId={booking.id}
                      amount={booking.tutorProfile.hourlyRate}
                      userEmail={user?.email ?? ""}
                      userName={user?.name ?? ""}
                      tutorName={tutorName ?? undefined}
                      onSuccess={handleSuccess}
                      onCancel={onClose}
                    />
                  </Elements>

                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <p className="text-sm font-medium text-white/70">Unable to load checkout</p>
                    <p className="text-xs text-white/30">Check your connection and try again.</p>
                    <button
                      onClick={() => setClientSecret(null)}
                      className="mt-1 px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:bg-white/5 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}