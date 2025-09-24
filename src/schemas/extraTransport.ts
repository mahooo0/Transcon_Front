import { z } from 'zod';

const baseExtraTransportSchema = z.object({
  registrationNumber: z.string().min(1, 'Номер обязателен').max(20),
  name: z.string().min(1, 'Название обязательно').max(100),
  type: z.string().min(1, 'Тип обязателен').max(100),
  insuranceFrom: z.string().optional(),
  insuranceTo: z.string().optional(),
  technicalInspectionFrom: z.string().optional(),
  technicalInspectionTo: z.string().optional(),
  notes: z.string().max(500).optional(),
  photos: z.array(z.any()).max(7, 'Максимум 7 фотографий').optional(),
});

export const createExtraTransportSchema = baseExtraTransportSchema;

export const updateExtraTransportSchema = baseExtraTransportSchema;

export type ExtraTransportFormData = z.infer<typeof createExtraTransportSchema>;
