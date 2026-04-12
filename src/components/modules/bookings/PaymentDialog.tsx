"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckoutForm } from "./CheckoutForm";
import { paymentService } from "@/services/payment.service";
import { Booking } from "@/services/booking.service";
import { Loader2, CreditCard, CheckCircle2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const stripePromise = getStripe();

interface PaymentDialogProps {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentDialog({ open, booking, onClose, onSuccess }: PaymentDialogProps) {
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
        } catch (err: any) {
          console.error("Failed to create payment intent:", err);
          toast.error(err?.response?.data?.message ?? "Failed to initialize payment. Ensure backend is running.");
          onClose();
        } finally {
          setIsLoading(false);
        }
      };
      getIntent();
    }
  }, [open, booking, clientSecret, onClose, isSuccess]);

  // Reset states when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setClientSecret(null);
        setIsSuccess(false);
      }, 300);
    }
  }, [open]);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-primary/80 to-primary/40" />
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2"
                  >
                    <PartyPopper className="h-6 w-6 text-amber-500" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Payment Confirmed!</h3>
                <p className="text-muted-foreground text-sm max-w-[280px]">
                  Your session with <span className="text-foreground font-semibold">{booking?.tutorProfile.user?.name}</span> is now confirmed.
                </p>
                <div className="mt-8">
                   <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary/40" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DialogHeader className="mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <DialogTitle className="text-xl font-bold">Secure Checkout</DialogTitle>
                      <DialogDescription className="text-xs mt-1">
                        Professional tutoring with <span className="font-semibold text-foreground">{booking?.tutorProfile.user?.name}</span>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-5">
                    <div className="relative">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-primary/20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold tracking-tight">Securing Connection...</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Encrypting Transaction</p>
                    </div>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#0F172A",
                          colorBackground: "transparent",
                          colorText: "#1E293B",
                          colorDanger: "#E11D48",
                          fontFamily: 'Inter, system-ui, sans-serif',
                          spacingUnit: '5px',
                          borderRadius: '12px',
                        },
                        rules: {
                          '.Input': {
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          },
                          '.Label': {
                            fontSize: '13px',
                            fontWeight: '500',
                            marginBottom: '6px',
                          }
                        }
                      },
                    }}
                  >
                    <CheckoutForm
                      bookingId={booking!.id}
                      amount={booking!.tutorProfile.hourlyRate}
                      onSuccess={handleSuccess}
                      onCancel={onClose}
                    />
                  </Elements>
                ) : (
                   <div className="py-12 text-center">
                      <p className="text-sm text-destructive font-medium">Unable to load checkout.</p>
                      <Button variant="link" size="sm" onClick={() => setClientSecret(null)}>Retry</Button>
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
