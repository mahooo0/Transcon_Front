import { z } from 'zod';

export const paymentSchema = z.object({
  amount: z.string().min(1, 'Сумма обязательна'),
  paidAmount: z.string().min(1, 'Оплаченная сумма обязательна'),
  expectedPaymentDate: z.string().min(1, 'Ожидаемая дата оплаты обязательна'),
  actualPaymentDate: z.string().min(1, 'Фактическая дата оплаты обязательна'),
  currency: z.string().min(1, 'Валюта обязательна'),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
