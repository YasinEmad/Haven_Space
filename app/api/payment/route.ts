import { NextRequest, NextResponse } from 'next/server';
import { paymentFormSchema, PaymentFormData } from '@/lib/payment-validation';
import { paymentHistory } from '@/lib/payment-service';

interface PaymentRequest {
  amount: number;
  currency?: string;
  paymentData: PaymentFormData;
}

/**
 * POST /api/payment
 * 
 * Process a payment request (mock)
 * 
 * Request body:
 * {
 *   "amount": 299.99,
 *   "currency": "SAR",
 *   "paymentData": {
 *     "fullName": "محمد علي",
 *     "email": "user@example.com",
 *     "cardNumber": "4111111111111111",
 *     "expiryDate": "12/25",
 *     "cvv": "123",
 *     "billingAddress": "شارع النيل",
 *     "billingCity": "الرياض",
 *     "billingZipCode": "12345"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    // Validate required fields
    if (!body.amount || !body.paymentData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment data schema
    const validationResult = paymentFormSchema.safeParse(body.paymentData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid payment data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create payment result
    const paymentResult = {
      success: true,
      transactionId,
      amount: body.amount,
      currency: body.currency || 'SAR',
      timestamp: new Date().toISOString(),
      status: 'completed',
      payerInfo: {
        fullName: body.paymentData.fullName,
        email: body.paymentData.email,
        cardLast4: body.paymentData.cardNumber.slice(-4),
        billingCity: body.paymentData.billingCity,
      },
    };

    // Store in payment history
    paymentHistory.add({
      success: true,
      transactionId,
      amount: body.amount,
      timestamp: new Date(),
      payerInfo: body.paymentData,
    });

    return NextResponse.json(paymentResult, { status: 200 });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        message: 'An unexpected error occurred during payment processing',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment
 * Get payment history (for admin/testing purposes)
 */
export async function GET() {
  try {
    const history = paymentHistory.getAll();
    return NextResponse.json(
      {
        success: true,
        count: history.length,
        transactions: history.map(item => ({
          transactionId: item.transactionId,
          amount: item.amount,
          timestamp: item.timestamp.toISOString(),
          payerEmail: item.payerInfo.email,
          payerName: item.payerInfo.fullName,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
