import { z } from 'zod';

/**
 * User Validators
 *
 * Zod schemas for validating user request data.
 */

export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phone: z.string().optional(),
    }),
});

export const getUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
});
