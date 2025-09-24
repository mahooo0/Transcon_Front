import { z } from 'zod';

export const journalSchema = z.object({
  incidentDate: z.string().min(1, 'Дата происшествия обязательна'),
  incidentType: z.string().min(1, 'Тип происшествия обязателен'),
  culprit: z.string().min(1, 'Виновник обязателен'),
  currency: z.string().min(1, 'Валюта обязательна'),
  freight: z.string().optional(), // Это поле не используется в API
  freightId: z.string().min(1, 'ID фрахта обязателен'),
  incidentDescription: z.string().min(1, 'Описание происшествия обязательно'),
  amount: z.string().min(1, 'Сумма обязательна'),
  note: z.string().optional(),
  documents: z.array(z.any()).optional(),
});

export type JournalFormData = z.infer<typeof journalSchema>;
