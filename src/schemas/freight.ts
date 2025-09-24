import { z } from 'zod';

export const freightSchema = z.object({
  // Основные поля для API
  truckId: z.string().min(1, 'Тягач обязателен'),
  trailerId: z.string().min(1, 'Прицеп обязателен'),
  driverId: z.string().min(1, 'Водитель обязателен'),
  loadingDate: z.string().min(1, 'Дата загрузки обязательна'),
  unloadingDate: z.string().min(1, 'Дата выгрузки обязательна'),
  loadingCode: z.string().min(1, 'Код загрузки обязателен'),
  unloadingCode: z.string().min(1, 'Код выгрузки обязателен'),
  countries: z
    .string()
    .min(1, 'Страны маршрута обязательны')
    .max(10, 'Страны маршрута должны быть не более 10 символов'),
  kilometers: z.coerce.number().min(1, 'Километры обязательны'),
  ratePerKm: z.coerce.number().min(0, 'Ставка за км должна быть положительной'),
  currency: z.enum(['PLN', 'EUR'], {
    message: 'Валюта должна быть PLN или EUR',
  }),
  totalAmount: z.number().min(0, 'Сумма должна быть положительной'),
  contractorString: z.string().min(1, 'Фирма-контрагент обязательна'),
  logist: z.string().min(1, 'Логист обязателен'),
  general: z.string().optional(),
  expectedPaymentDate: z.string().min(1, 'Дата ожидаемой оплаты обязательна'),

  // Статусы (только для редактирования)
  paymentStatus: z.string().optional(),
  status: z.string().optional(),

  // Дополнительные поля для формы (не отправляются в API)
  files: z.array(z.instanceof(File)).max(5, 'Максимум 5 файлов').optional(),
});

export type FreightFormData = z.infer<typeof freightSchema>;
