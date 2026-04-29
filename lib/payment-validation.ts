import { z } from 'zod';

export const paymentFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'يجب أن يكون الاسم على الأقل حرفين' })
    .max(50, { message: 'الاسم طويل جداً' }),
  email: z
    .string()
    .email({ message: 'بريد إلكتروني غير صحيح' }),
  cardNumber: z
    .string()
    .regex(/^[0-9]{16}$/, { message: 'رقم البطاقة يجب أن يكون 16 رقم' }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'الصيغة: MM/YY' })
    .refine((date) => {
      const [month, year] = date.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expiryYear = parseInt(year);
      
      if (expiryYear < currentYear) return false;
      if (expiryYear === currentYear && parseInt(month) < currentMonth) return false;
      return true;
    }, { message: 'تاريخ انتهاء البطاقة غير صحيح' }),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, { message: 'CVV يجب أن يكون 3 أو 4 أرقام' }),
  billingAddress: z
    .string()
    .min(5, { message: 'العنوان قصير جداً' })
    .max(100, { message: 'العنوان طويل جداً' }),
  billingCity: z
    .string()
    .min(2, { message: 'المدينة قصيرة جداً' }),
  billingZipCode: z
    .string()
    .min(3, { message: 'الرمز البريدي قصير جداً' }),
  propertyName: z
    .string()
    .min(2, { message: 'يجب كتابة اسم العقار' })
    .max(100, { message: 'اسم العقار طويل جداً' }),
  paymentType: z.enum(['full', 'installment']),
  paymentAmount: z.string().optional(),
  installmentAmount: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentType === 'full') {
    if (!data.paymentAmount?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paymentAmount'],
        message: 'Please enter the full payment amount',
      });
    } else if (Number.isNaN(Number(data.paymentAmount)) || Number(data.paymentAmount) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paymentAmount'],
        message: 'Amount must be a positive number',
      });
    }
  }

  if (data.paymentType === 'installment') {
    if (!data.installmentAmount?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['installmentAmount'],
        message: 'Please enter the installment amount',
      });
    } else if (Number.isNaN(Number(data.installmentAmount)) || Number(data.installmentAmount) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['installmentAmount'],
        message: 'Installment amount must be a positive number',
      });
    }
  }
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
