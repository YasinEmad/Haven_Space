# نظام الدفع التجريبي - دليل الاستخدام

## 📋 نظرة عامة

نظام دفع تجريبي احترافي يحاكي بوابات الدفع الحقيقية. مصمم للعرض والاختبار ويدعم التطوير المستقبلي للربط مع بوابات دفع حقيقية مثل Stripe أو PayPal.

### ✨ المميزات

- ✅ تصميم احترافي وحديث
- ✅ واجهة رباعية الاختبار (RTL) - دعم كامل للعربية
- ✅ تحقق من صحة البيانات باستخدام Zod
- ✅ معالجة آمنة وسلسة
- ✅ رسائل نجاح وتأكيدات فورية
- ✅ قابل للتطوير والتوسع
- ✅ لا يتصل بأي خادم حقيقي (محاكاة فقط)

---

## 📁 البنية والملفات

```
lib/
├── payment-validation.ts      # Zod schema للتحقق من البيانات
└── payment-service.ts         # خدمة معالجة الدفع والأدوات

components/
└── PaymentForm.tsx            # مكون نموذج الدفع الرئيسي

app/
├── api/
│   └── payment/
│       └── route.ts           # API endpoint للدفع
└── checkout/
    └── page.tsx               # صفحة الدفع التجريبية
```

---

## 🚀 الاستخدام السريع

### 1. صفحة دفع بسيطة

```tsx
'use client';

import PaymentForm from '@/components/PaymentForm';

export default function ProductCheckout() {
  const handlePaymentSuccess = (data) => {
    console.log('تم الدفع بنجاح:', data);
    // قم بعمليات إضافية هنا
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
      <PaymentForm
        amount={299.99}
        currency="SAR"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
```

### 2. دمج مع متجر المنتجات

```tsx
'use client';

import { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import { PaymentFormData } from '@/lib/payment-validation';

export default function PropertyCheckout({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<any>(null);

  const handlePaymentSuccess = async (paymentData: PaymentFormData) => {
    // حفظ في قاعدة البيانات
    const response = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId,
        buyerEmail: paymentData.email,
        amount: property.price,
        paymentData,
      }),
    });

    if (response.ok) {
      // إعادة توجيه إلى صفحة التأكيد
      window.location.href = '/purchase-confirmation';
    }
  };

  return (
    <PaymentForm
      amount={property?.price || 0}
      currency="SAR"
      onSuccess={handlePaymentSuccess}
    />
  );
}
```

---

## 📊 مكونات النظام

### PaymentForm Component

النموذج الرئيسي الذي يعرض جميع حقول الدفع.

**Props:**
```typescript
interface PaymentFormProps {
  amount: number;              // المبلغ المستحق
  currency?: string;           // العملة (افتراضي: SAR)
  onSuccess?: (data) => void;  // callback عند نجاح الدفع
  onCancel?: () => void;       // callback عند الإلغاء
}
```

**مثال:**
```tsx
<PaymentForm
  amount={1500}
  currency="AED"
  onSuccess={(data) => console.log('Payment successful', data)}
  onCancel={() => console.log('Payment cancelled')}
/>
```

---

### Payment Service

خدمة معالجة الدفع التي توفر أدوات مساعدة.

**الدوال المتاحة:**

```typescript
// معالجة الدفع
processPayment(data: PaymentFormData, amount: number): Promise<PaymentResult>

// التحقق من صحة رقم البطاقة (Luhn algorithm)
validateCardNumber(cardNumber: string): boolean

// التحقق من صحة CVV
validateCVV(cvv: string): boolean

// تنسيق رقم البطاقة للعرض
formatCardNumber(cardNumber: string): string

// إخفاء رقم البطاقة (•••• •••• •••• 1111)
maskCardNumber(cardNumber: string): string
```

**مثال الاستخدام:**

```typescript
import { usePaymentService, maskCardNumber } from '@/lib/payment-service';

function MyComponent() {
  const { processPayment, validateCardNumber } = usePaymentService();

  // التحقق من البطاقة
  if (!validateCardNumber(cardNumber)) {
    console.log('رقم بطاقة غير صحيح');
  }

  // معالجة الدفع
  const result = await processPayment(paymentData, 500);
  if (result) {
    console.log(`تم الدفع: ${result.transactionId}`);
  }

  // إخفاء البطاقة
  const masked = maskCardNumber(cardNumber);
  console.log(masked); // •••• •••• •••• 1111
}
```

---

## 🔌 API Endpoint

### POST /api/payment

معالجة طلب الدفع.

**Request:**
```json
{
  "amount": 299.99,
  "currency": "SAR",
  "paymentData": {
    "fullName": "محمد علي",
    "email": "user@example.com",
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123",
    "billingAddress": "شارع النيل",
    "billingCity": "الرياض",
    "billingZipCode": "12345"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "transactionId": "TXN-1234567890-ABC123XYZ",
  "amount": 299.99,
  "currency": "SAR",
  "timestamp": "2026-04-29T12:00:00.000Z",
  "status": "completed",
  "payerInfo": {
    "fullName": "محمد علي",
    "email": "user@example.com",
    "cardLast4": "1111",
    "billingCity": "الرياض"
  }
}
```

---

### GET /api/payment

الحصول على سجل المعاملات (للاختبار والإدارة).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "transactions": [
    {
      "transactionId": "TXN-1234567890-ABC123XYZ",
      "amount": 299.99,
      "timestamp": "2026-04-29T12:00:00.000Z",
      "payerEmail": "user@example.com",
      "payerName": "محمد علي"
    }
  ]
}
```

---

## 🧪 بطاقات اختبار

يمكن استخدام البطاقات التالية في النموذج:

| نوع البطاقة | رقم البطاقة | التاريخ | CVV |
|---------|-----------|--------|-----|
| Visa | 4111 1111 1111 1111 | أي تاريخ مستقبلي | أي 3 أرقام |
| Mastercard | 5555 5555 5555 4444 | أي تاريخ مستقبلي | أي 3 أرقام |

---

## 🔐 حقول النموذج المطلوبة

### المعلومات الشخصية
- **الاسم الكامل**: نص، 2-50 حرف
- **البريد الإلكتروني**: بريد إلكتروني صحيح

### معلومات البطاقة
- **رقم البطاقة**: 16 رقم
- **تاريخ الانتهاء**: MM/YY (تاريخ مستقبلي)
- **CVV**: 3-4 أرقام

### عنوان الفوترة
- **العنوان**: نص، 5-100 حرف
- **المدينة**: نص، 2+ حرف
- **الرمز البريدي**: نص، 3+ حرف

---

## 🛠️ التطوير والتخصيص

### تغيير رسالة النجاح

```tsx
// في components/PaymentForm.tsx
if (isSuccess) {
  return (
    <div>
      <h3>رسالتك المخصصة هنا</h3>
      {/* محتوى النجاح */}
    </div>
  );
}
```

### تخصيص التصميم

```tsx
// استخدام tailwind classes للتخصيص
<Card className="border-2 border-your-color-500">
  {/* محتوى مخصص */}
</Card>
```

### إضافة حقول إضافية

1. أضف الحقل إلى Zod schema في `lib/payment-validation.ts`:
```typescript
export const paymentFormSchema = z.object({
  // الحقول الموجودة...
  phoneNumber: z.string().min(10, 'رقم الهاتف مطلوب'),
});
```

2. أضفه إلى النموذج في `components/PaymentForm.tsx`:
```tsx
<FormField
  control={form.control}
  name="phoneNumber"
  render={({ field }) => (
    <FormItem>
      <FormLabel>رقم الهاتف</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

---

## 🔄 الربط مع بوابة دفع حقيقية

### Stripe Integration

```typescript
// lib/payment-service.ts - استبدل mockPaymentService

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripePaymentService: PaymentService = {
  processPayment: async (data: PaymentFormData, amount: number) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // بالفلس
      currency: 'sar',
      metadata: {
        customerName: data.fullName,
        customerEmail: data.email,
      },
    });

    return {
      success: true,
      transactionId: paymentIntent.id,
      amount,
      timestamp: new Date(),
      payerInfo: data,
    };
  },
  // ... implementations أخرى
};
```

### PayPal Integration

```typescript
// lib/payment-service.ts

import paypalSdk from '@paypal/checkout-server-sdk';

export const paypalPaymentService: PaymentService = {
  processPayment: async (data: PaymentFormData, amount: number) => {
    // إنشء طلب دفع PayPal
    const request = new paypalSdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      payer_reference: data.email,
      purchase_units: [{
        amount: {
          currency_code: 'SAR',
          value: amount.toString(),
        },
      }],
    });

    const response = await paypalClient.execute(request);
    
    return {
      success: true,
      transactionId: response.result.id,
      amount,
      timestamp: new Date(),
      payerInfo: data,
    };
  },
  // ... implementations أخرى
};
```

---

## 📝 الملاحظات المهمة

⚠️ **هذا نظام تجريبي**
- لا يتصل بأي خادم حقيقي
- لا يتم معالجة أي معاملات مالية فعلية
- جميع البيانات وهمية ولا تُحفظ

✅ **للاستخدام في الإنتاج**
- استبدل `mockPaymentService` بخدمة حقيقية
- أضف التحقق من جانب الخادم
- استخدم متغيرات البيئة للمفاتيح السرية
- أضف تسجيل الأنشطة والمراقبة
- طبق أمان HTTPS و SSL/TLS

---

## 📞 الدعم والمساعدة

للأسئلة أو التحسينات، يمكنك:
1. مراجعة التعليقات في الكود
2. اختبار المكونات في صفحة `/checkout`
3. استخدام console لتتبع العمليات
