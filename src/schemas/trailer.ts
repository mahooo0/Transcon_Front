import { z } from 'zod';

const baseTrailerSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, 'Номер регистрации обязателен')
    .max(20, 'Номер регистрации не должен превышать 20 символов'),

  vinNumber: z
    .string()

    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Неверный формат VIN номера'),

  insuranceFrom: z.string().min(1, 'Дата начала страховки обязательна'),

  insuranceTo: z.string().min(1, 'Дата окончания страховки обязательна'),

  technicalInspectionFrom: z
    .string()
    .min(1, 'Дата начала техосмотра обязательна'),

  technicalInspectionTo: z
    .string()
    .min(1, 'Дата окончания техосмотра обязательна'),

  notes_ru: z.string().default(''),

  notes_pl: z.string().default(''),

  status: z.enum(['IN_ROUTE', 'ON_BASE', 'IN_REPAIR'], {
    message: 'Выберите статус прицепа',
  }),
});

// Добавляем валидацию дат - дата "до" не может быть меньше даты "от"
export const trailerSchema = baseTrailerSchema
  .refine(
    (data) => {
      const insuranceFrom = new Date(data.insuranceFrom);
      const insuranceTo = new Date(data.insuranceTo);
      return insuranceTo >= insuranceFrom;
    },
    {
      message: 'Дата окончания страховки не может быть раньше даты начала',
      path: ['insuranceTo'],
    }
  )
  .refine(
    (data) => {
      const techFrom = new Date(data.technicalInspectionFrom);
      const techTo = new Date(data.technicalInspectionTo);
      return techTo >= techFrom;
    },
    {
      message: 'Дата окончания техосмотра не может быть раньше даты начала',
      path: ['technicalInspectionTo'],
    }
  );

export type TrailerFormData = z.infer<typeof trailerSchema>;
