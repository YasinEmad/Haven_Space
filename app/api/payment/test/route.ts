import { NextRequest, NextResponse } from 'next/server';
import { paymentHistory } from '@/lib/payment-service';
import { generateInvoiceNumber, generateTransactionId, formatPrice } from '@/lib/payment-utils';

/**
 * GET /api/payment/test
 * Get payment statistics and history for testing/demo purposes
 * 
 * This endpoint is only for development and should be removed in production
 */
export async function GET(request: NextRequest) {
  // Check if running in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    );
  }

  try {
    const history = paymentHistory.getAll();

    const statistics = {
      totalTransactions: history.length,
      totalAmount: history.reduce((sum, t) => sum + t.amount, 0),
      averageAmount:
        history.length > 0
          ? history.reduce((sum, t) => sum + t.amount, 0) / history.length
          : 0,
      latestTransaction: history[history.length - 1] || null,
      transactions: history.map((item, index) => ({
        id: index + 1,
        transactionId: item.transactionId,
        amount: item.amount,
        formattedAmount: formatPrice(item.amount),
        timestamp: item.timestamp.toISOString(),
        payerName: item.payerInfo.fullName,
        payerEmail: item.payerInfo.email,
        cardLast4: item.payerInfo.cardNumber.slice(-4),
        billingCity: item.payerInfo.billingCity,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Payment statistics retrieved successfully',
        statistics,
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment statistics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payment/test/generate
 * Generate a test payment for demo purposes
 */
export async function POST(request: NextRequest) {
  // Check if running in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    );
  }

  try {
    const testPayment = {
      transactionId: generateTransactionId(),
      invoiceNumber: generateInvoiceNumber(),
      amount: Math.floor(Math.random() * 5000) + 500,
      currency: 'SAR',
      timestamp: new Date().toISOString(),
      status: 'completed',
      payer: {
        fullName: 'محمد علي أحمد',
        email: 'customer@example.com',
        cardLast4: '1111',
        billingCity: 'الرياض',
      },
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Test payment generated successfully',
        payment: testPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating test payment:', error);
    return NextResponse.json(
      { error: 'Failed to generate test payment' },
      { status: 500 }
    );
  }
}
