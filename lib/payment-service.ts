import { PaymentFormData } from '@/lib/payment-validation';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  timestamp: Date;
  payerInfo: PaymentFormData;
}

export interface PaymentService {
  processPayment(data: PaymentFormData, amount: number): Promise<PaymentResult>;
  validateCardNumber(cardNumber: string): boolean;
  validateCVV(cvv: string): boolean;
}

/**
 * Mock Payment Service
 * This service simulates payment processing without connecting to real payment gateways.
 * Can be easily replaced with a real payment service later (Stripe, PayPal, etc.)
 */
export const mockPaymentService: PaymentService = {
  /**
   * Process payment - Always returns success for testing
   * In production, replace with actual payment gateway API call
   */
  processPayment: async (data: PaymentFormData, amount: number): Promise<PaymentResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      transactionId,
      amount,
      timestamp: new Date(),
      payerInfo: data,
    };
  },

  /**
   * Luhn algorithm for card validation
   */
  validateCardNumber: (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length !== 16) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  /**
   * Validate CVV format
   */
  validateCVV: (cvv: string): boolean => {
    const cleanCVV = cvv.replace(/\D/g, '');
    return cleanCVV.length === 3 || cleanCVV.length === 4;
  },
};

/**
 * Hook for handling payment in React components
 * Usage:
 * const { processPayment, loading, error } = usePaymentService();
 */
export function usePaymentService() {
  const processPayment = async (
    data: PaymentFormData,
    amount: number
  ): Promise<PaymentResult | null> => {
    try {
      const result = await mockPaymentService.processPayment(data, amount);
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      return null;
    }
  };

  return {
    processPayment,
    validateCardNumber: mockPaymentService.validateCardNumber,
    validateCVV: mockPaymentService.validateCVV,
  };
}

/**
 * Format card number for display (e.g., 4111111111111111 -> 4111 1111 1111 1111)
 */
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * Mask card number for security (e.g., 4111 1111 1111 1111 -> •••• •••• •••• 1111)
 */
export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

/**
 * Store payment history (in-memory for demo, replace with database in production)
 */
class PaymentHistory {
  private history: PaymentResult[] = [];

  add(result: PaymentResult): void {
    this.history.push(result);
  }

  getAll(): PaymentResult[] {
    return [...this.history];
  }

  getById(transactionId: string): PaymentResult | undefined {
    return this.history.find(item => item.transactionId === transactionId);
  }

  clear(): void {
    this.history = [];
  }
}

export const paymentHistory = new PaymentHistory();
