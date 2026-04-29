'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentFormSchema, PaymentFormData } from '@/lib/payment-validation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  CreditCard,
  Lock,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

import { motion } from 'framer-motion';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (data: PaymentFormData, paidAmount: number) => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  amount,
  currency = 'USD',
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumberDisplay, setCardNumberDisplay] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingAddress: '',
      billingCity: '',
      billingZipCode: '',
      propertyName: '',
      paymentType: 'full',
      paymentAmount: amount.toString(),
      installmentAmount: '',
    },
  });

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    form.setValue('cardNumber', value);

    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumberDisplay(formatted);
  };

  const handleExpiryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    form.setValue('expiryDate', value.slice(0, 5));
  };

  const handleCVVChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    form.setValue('cvv', value);
  };

  const paymentType = form.watch('paymentType');
  const paymentAmount = form.watch('paymentAmount');
  const installmentAmount = form.watch('installmentAmount');
  const displayAmount =
    paymentType === 'installment' && installmentAmount
      ? installmentAmount
      : paymentAmount || amount.toString();
  const amountToPay =
    paymentType === 'installment' && installmentAmount
      ? Number(installmentAmount)
      : paymentAmount
      ? Number(paymentAmount)
      : amount;

  useEffect(() => {
    if (paymentType === 'full') {
      form.setValue('paymentAmount', amount.toString());
    }
  }, [amount, paymentType, form]);

  const onSubmit = async (data: PaymentFormData) => {
    setErrorMessage(null);
    setIsProcessing(true);
    let success = false;

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountToPay,
          currency,
          paymentData: data,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || 'Payment failed');
      }

      await response.json();
      success = true;
      setIsSuccess(true);
      onSuccess?.(data, amountToPay);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }

    if (success) {
      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
        setCardNumberDisplay('');
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="border-emerald-400/20 bg-emerald-500/10 backdrop-blur-2xl rounded-3xl">
          <CardContent className="py-16 text-center">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />

            <h2 className="text-3xl font-bold text-white mb-3">
              Payment Successful
            </h2>

            <p className="text-white/65 mb-8">
              Your transaction has been completed successfully.
            </p>

            <div className="inline-block px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">Amount Paid</p>
              <p className="text-3xl font-bold text-emerald-400">
                {displayAmount} {currency}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Card Preview */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/10 p-7 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <CreditCard className="w-8 h-8 text-white" />
          <span className="text-sm text-white/60">Secure Checkout</span>
        </div>

        <p className="text-2xl font-mono tracking-[0.25em] text-white mb-8">
          {cardNumberDisplay || '•••• •••• •••• ••••'}
        </p>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-white/50">Cardholder</p>
            <p className="text-sm text-white font-medium">
              {form.watch('fullName') || 'Your Name'}
            </p>
          </div>

          <div>
            <p className="text-xs text-white/50">Expires</p>
            <p className="text-sm text-white font-medium">
              {form.watch('expiryDate') || 'MM/YY'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="rounded-3xl border-white/10 bg-white/5 backdrop-blur-2xl">
        <CardContent className="p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Carter"
                        disabled={isProcessing}
                        {...field}
                        className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Property Name */}
              <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Property Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Riyadh Villa"
                        disabled={isProcessing}
                        {...field}
                        className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Type */}
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Payment Type
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={isProcessing}
                        className="h-12 w-full rounded-2xl bg-white/5 border border-white/10 px-4 text-white"
                      >
                        <option value="full">Full Payment</option>
                        <option value="installment">Installment</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentType === 'full' ? (
                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        Total Amount
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter total amount"
                          disabled={isProcessing}
                          {...field}
                          className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="installmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        Installment Amount
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter installment amount"
                          disabled={isProcessing}
                          {...field}
                          className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@email.com"
                        disabled={isProcessing}
                        {...field}
                        className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card Number */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Card Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        disabled={isProcessing}
                        value={cardNumberDisplay}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="h-12 rounded-2xl text-center font-mono bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field: { value } }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        Expiry
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/YY"
                          value={value}
                          onChange={handleExpiryChange}
                          disabled={isProcessing}
                          className="h-12 rounded-2xl text-center bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field: { value } }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        CVV
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          value={value}
                          onChange={handleCVVChange}
                          disabled={isProcessing}
                          className="h-12 rounded-2xl text-center bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Billing */}
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Billing Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street"
                        disabled={isProcessing}
                        {...field}
                        className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City + ZIP */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billingCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          disabled={isProcessing}
                          {...field}
                          className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingZipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        ZIP Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
                          disabled={isProcessing}
                          {...field}
                          className="h-12 rounded-2xl bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Alert */}
              <Alert className="rounded-2xl border-blue-400/20 bg-blue-500/10">
                <ShieldCheck className="h-4 w-4 text-blue-300" />
                <AlertDescription className="text-blue-200">
                  This is a simulated payment form for testing purposes only.
                </AlertDescription>
              </Alert>

              {/* Actions */}
              {errorMessage && (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
                  {errorMessage}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-semibold"
                >
                  {isProcessing
                    ? 'Processing...'
                    : `Pay ${displayAmount} ${currency}`}
                </Button>

                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="h-12 rounded-2xl border-white/10 text-white"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {/* Test Cards */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
                <p className="mb-2 font-medium text-white">
                  Test Cards
                </p>
                <p className="font-mono">4111 1111 1111 1111</p>
                <p className="font-mono">5555 5555 5555 4444</p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}