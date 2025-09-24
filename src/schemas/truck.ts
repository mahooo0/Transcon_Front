import { z } from 'zod';

const baseTruckSchema = z
  .object({
    registrationNumber: z.string().min(1, 'Номер авто обязателен').max(20),
    brand: z.string().min(1, 'Марка обязательна').max(100),
    model: z.string().min(1, 'Модель обязательна').max(100),
    vinNumber: z.string().min(1, 'VIN обязателен').max(50),
    status: z.enum(['IN_ROUTE', 'ON_BASE', 'IN_REPAIR'], {
      message: 'Статус обязателен',
    }),
    insuranceFrom: z.string().min(1, 'Дата начала страховки обязательна'),
    insuranceTo: z.string().min(1, 'Дата окончания страховки обязательна'),
    technicalInspectionFrom: z
      .string()
      .min(1, 'Дата начала техосмотра обязательна'),
    technicalInspectionTo: z
      .string()
      .min(1, 'Дата окончания техосмотра обязательна'),
    notes_ru: z.string().max(500, 'Максимум 500 символов').optional(),
    notes_pl: z.string().max(500, 'Максимум 500 символов').optional(),
    photos: z.array(z.any()).max(7, 'Максимум 7 фотографий').optional(),
  })
  .refine(
    (data) => {
      // Валидация: дата окончания страховки не может быть раньше даты начала
      if (data.insuranceFrom && data.insuranceTo) {
        return new Date(data.insuranceTo) >= new Date(data.insuranceFrom);
      }
      return true;
    },
    {
      message: 'Дата окончания страховки не может быть раньше даты начала',
      path: ['insuranceTo'],
    }
  )
  .refine(
    (data) => {
      // Валидация: дата окончания техосмотра не может быть раньше даты начала
      if (data.technicalInspectionFrom && data.technicalInspectionTo) {
        return (
          new Date(data.technicalInspectionTo) >=
          new Date(data.technicalInspectionFrom)
        );
      }
      return true;
    },
    {
      message: 'Дата окончания техосмотра не может быть раньше даты начала',
      path: ['technicalInspectionTo'],
    }
  );

export const createTruckSchema = baseTruckSchema;

export const updateTruckSchema = baseTruckSchema;

export type TruckFormData = z.infer<typeof createTruckSchema>;
