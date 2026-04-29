'use client';

import { useState, useEffect, useRef } from 'react';
import PaymentForm from '@/components/PaymentForm';
import { PaymentFormData } from '@/lib/payment-validation';
import { paymentHistory } from '@/lib/payment-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  CreditCard,
  Sparkles,
} from 'lucide-react';

/* ---------- Scroll Reveal ---------- */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(30px)',
        transition: `all .7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Data ---------- */
const paymentAmount = 199.99;

/* ---------- Page ---------- */
export default function CheckoutPage() {
  const [lastTransaction, setLastTransaction] =
    useState<PaymentFormData | null>(null);
  const [lastPaidAmount, setLastPaidAmount] = useState<number>(paymentAmount);

  const handlePaymentSuccess = (data: PaymentFormData, paidAmount: number) => {
    setLastTransaction(data);
    setLastPaidAmount(paidAmount);

    paymentHistory.add({
      success: true,
      transactionId: `TXN-${Date.now()}`,
      amount: paidAmount,
      currency: 'USD',
      timestamp: new Date(),
      payerInfo: data,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/70">
                Secure Payment Experience
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5">
              Checkout
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Complete your payment with a secure and modern experience built
              for trust and simplicity.
            </p>
          </div>
        </Reveal>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form */}
            <Reveal delay={200}>
              <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10">
                <PaymentForm
                  amount={paymentAmount}
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            </Reveal>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Success */}
            {lastTransaction && (
              <Reveal delay={300}>
                <Card className="bg-emerald-500/10 border-emerald-400/20 rounded-3xl backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                      Last Transaction
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm text-white/80">
                    <p>Name: {lastTransaction.fullName}</p>
                    <p>Email: {lastTransaction.email}</p>
                    <p>Property: {lastTransaction.propertyName}</p>
                    <p>
                      Payment Type:{' '}
                      {lastTransaction.paymentType === 'installment'
                        ? 'Installment'
                        : 'Full Payment'}
                    </p>
                    {lastTransaction.paymentType === 'installment' && (
                      <p>
                        Installment Amount: {lastTransaction.installmentAmount} USD
                      </p>
                    )}
                    <p>
                      Card: •••• {lastTransaction.cardNumber.slice(-4)}
                    </p>
                    <p>City: {lastTransaction.billingCity}</p>
                  </CardContent>
                </Card>
              </Reveal>
            )}

            {/* Security */}
            <Reveal delay={350}>
              <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-300 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      Advanced Protection
                    </h3>
                    <p className="text-sm text-white/65">
                      This is a simulated payment environment for testing and
                      showcase purposes. No real financial data is processed.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Features */}
            <Reveal delay={400}>
              <div className="grid gap-3">
                {[
                  'Professional checkout design',
                  'Full form validation',
                  'Secure processing flow',
                  'Scalable architecture',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-white/75">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}