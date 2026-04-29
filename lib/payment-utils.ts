/**
 * Payment Utilities
 * Helper functions for payment-related operations
 */

import { PaymentFormData } from '@/lib/payment-validation';

/**
 * Generate a unique transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

/**
 * Format price for display
 * @param price - Price in numbers
 * @param currency - Currency code (SAR, USD, etc)
 * @param locale - Locale for formatting (default: ar-SA)
 */
export function formatPrice(
  price: number,
  currency: string = 'SAR',
  locale: string = 'ar-SA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Get display name for card type based on card number
 */
export function getCardType(cardNumber: string): 'visa' | 'mastercard' | 'unknown' {
  const number = cardNumber.replace(/\D/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) {
    return 'visa';
  }
  if (/^5[1-5][0-9]{14}$/.test(number)) {
    return 'mastercard';
  }

  return 'unknown';
}

/**
 * Validate using Luhn algorithm
 */
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length !== 16) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Check if card is expired
 */
export function isCardExpired(expiryDate: string): boolean {
  try {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);

    if (expiryYear < currentYear) return true;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Log payment event (for debugging/monitoring)
 */
export function logPaymentEvent(
  eventType: 'START' | 'SUCCESS' | 'FAILURE' | 'VALIDATION_ERROR',
  data?: any
): void {
  const timestamp = new Date().toISOString();
  const message = `[Payment ${eventType}] ${timestamp}`;

  if (data) {
    console.log(message, data);
  } else {
    console.log(message);
  }

  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // sendToLoggingService(message, data);
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskPaymentData(data: PaymentFormData) {
  return {
    fullName: data.fullName,
    email: data.email,
    cardNumber: `•••• •••• •••• ${data.cardNumber.slice(-4)}`,
    expiryDate: data.expiryDate,
    cvv: '***',
    billingCity: data.billingCity,
  };
}

/**
 * Get payment status badge color
 */
export function getStatusColor(
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
): string {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return colors[status];
}

/**
 * Calculate fees
 */
export function calculatePaymentFees(
  amount: number,
  feePercentage: number = 2.5
): { amount: number; fee: number; total: number } {
  const fee = Math.round((amount * feePercentage) / 100 * 100) / 100;
  const total = amount + fee;

  return { amount, fee, total };
}

/**
 * Retry payment processing with exponential backoff
 */
export async function retryPayment<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logPaymentEvent('START');
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        logPaymentEvent('FAILURE', { error, attempt });
        return null;
      }

      const delay = delayMs * Math.pow(2, attempt - 1);
      console.log(`Retrying payment in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return null;
}

/**
 * Convert amount to smallest currency unit (e.g., SAR to Halala)
 */
export function amountToMinorUnit(amount: number, decimals: number = 2): number {
  return Math.round(amount * Math.pow(10, decimals));
}

/**
 * Convert from smallest currency unit back to decimal
 */
export function minorUnitToAmount(minorUnit: number, decimals: number = 2): number {
  return minorUnit / Math.pow(10, decimals);
}

/**
 * Generate receipt/invoice number
 */
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `INV-${year}${month}${day}-${random}`;
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 255);
}
