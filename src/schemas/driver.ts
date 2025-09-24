import { z } from 'zod';

export const driverSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  phone: z.string().min(1, 'Телефон обязателен'),
  contractEndDate: z.string().min(1, 'Дата окончания контракта обязательна'),
  dailyRate: z.string().min(1, 'Дневная ставка обязательна'),
  currency: z.string().min(1, 'Валюта обязательна'),
  notes: z.string().optional(),
});

export type DriverFormData = z.infer<typeof driverSchema>;
