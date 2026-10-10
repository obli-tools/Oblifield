import { z } from 'zod';

const userPreferencesSchema = z.object({
  toastEnabled: z.boolean(),
  toastPosition: z.enum(['top-center', 'bottom-right']),
  // Declared so the Profile theme picker's choice is stored instead of being
  // stripped by z.object() (it was silently dropped before, and the next
  // session check re-applied the stale server-side theme). Keep in sync with
  // the AppTheme union in shared/src/types.ts and the enrollment schema.
  preferredTheme: z.enum(['obli-operator', 'obli-dim', 'modern', 'neon']).optional(),
}).nullable().optional();

export const updateProfileSchema = z.object({
  displayName: z.string().max(100).nullable().optional(),
  preferences: userPreferencesSchema,
  email: z.string().email().max(255).nullable().optional(),
  preferredLanguage: z.string().max(10).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(128),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
