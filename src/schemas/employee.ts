import { z } from 'zod';

const baseEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  phone: z.string().max(20).optional(),
  login: z.string().min(1, 'Login is required').max(50),
  notes: z
    .object({
      pl: z.string().max(500).optional(),
      ru: z.string().max(500).optional(),
    })
    .optional(),
  roleId: z.string().min(1, 'Role is required').max(100),
});

export const createEmployeeSchema = baseEmployeeSchema.extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255),
});

export const updateEmployeeSchema = baseEmployeeSchema.extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255)
    .optional()
    .or(z.literal('')),
});

export const profileSchema = z.object({
  phone: z.string().max(20).optional(),
  notes: z.object({
    pl: z.string().max(500).optional(),
    ru: z.string().max(500).optional(),
  }).optional(),
});


export type CreateFormData = z.infer<typeof createEmployeeSchema>;
export type UpdateFormData = z.infer<typeof updateEmployeeSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type FormData = CreateFormData & UpdateFormData & ProfileFormData;
