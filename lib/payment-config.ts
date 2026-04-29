/**
 * Payment Configuration
 * Centralized configuration for payment processing
 * Easily switch between mock and real payment providers
 */

export enum PaymentProvider {
  MOCK = 'mock',        // Default: Mock payment (for testing)
  STRIPE = 'stripe',    // Real: Stripe
  PAYPAL = 'paypal',    // Real: PayPal
}

export interface PaymentConfig {
  provider: PaymentProvider;
  currency: string;
  // Add more config as needed
}

/**
 * Get active payment provider
 * Can be controlled via environment variables
 */
export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'mock';
  return provider as PaymentProvider;
}

/**
 * Get payment configuration
 */
export function getPaymentConfig(): PaymentConfig {
  return {
    provider: getPaymentProvider(),
    currency: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || 'SAR',
  };
}

/**
 * Payment provider keys (from environment variables)
 * Store these securely in .env.local
 */
export const paymentKeys = {
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  },
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    secretKey: process.env.PAYPAL_SECRET_KEY || '',
  },
};

/**
 * Currencies supported
 */
export const SUPPORTED_CURRENCIES = ['SAR', 'AED', 'EGP', 'USD', 'EUR'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * Currency symbols
 */
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  SAR: 'ر.س',
  AED: 'د.إ',
  EGP: 'ج.م',
  USD: '$',
  EUR: '€',
};

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency as SupportedCurrency] || currency;
}

/**
 * Payment processing timeouts (in milliseconds)
 */
export const PAYMENT_TIMEOUTS = {
  mock: 2000,        // Mock: 2 seconds
  stripe: 30000,     // Stripe: 30 seconds
  paypal: 30000,     // PayPal: 30 seconds
} as const;

/**
 * Get timeout for current provider
 */
export function getPaymentTimeout(): number {
  const provider = getPaymentProvider();
  return PAYMENT_TIMEOUTS[provider] || 30000;
}

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  cardNumber: {
    length: 16,
    pattern: /^[0-9]{16}$/,
    message: 'يجب أن يكون رقم البطاقة 16 رقم',
  },
  cvv: {
    minLength: 3,
    maxLength: 4,
    pattern: /^[0-9]{3,4}$/,
    message: 'يجب أن يكون CVV 3 أو 4 أرقام',
  },
  expiryDate: {
    pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
    message: 'الصيغة: MM/YY',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    message: 'الاسم يجب أن يكون 2-50 حرف',
  },
} as const;

/**
 * Error messages
 */
export const PAYMENT_ERROR_MESSAGES = {
  INVALID_CARD: 'رقم البطاقة غير صحيح',
  INVALID_CVV: 'رمز الأمان (CVV) غير صحيح',
  INVALID_EXPIRY: 'تاريخ انتهاء البطاقة غير صحيح',
  DECLINED: 'تم رفض العملية. حاول بطاقة أخرى',
  INSUFFICIENT_FUNDS: 'رصيد غير كافي',
  NETWORK_ERROR: 'خطأ في الاتصال. حاول لاحقاً',
  TIMEOUT: 'انقطعت العملية. حاول لاحقاً',
  INVALID_REQUEST: 'بيانات غير صحيحة',
} as const;

/**
 * Test mode
 * When true, payment will always succeed (useful for demo)
 */
export const PAYMENT_TEST_MODE = process.env.NEXT_PUBLIC_PAYMENT_TEST_MODE === 'true';

/**
 * Feature flags
 */
export const PAYMENT_FEATURES = {
  enableMockPayments: true,
  enableStripe: false,
  enablePayPal: false,
  saveCards: false,           // Store payment methods
  recurring: false,           // Recurring payments
  subscriptions: false,       // Subscription payments
} as const;
