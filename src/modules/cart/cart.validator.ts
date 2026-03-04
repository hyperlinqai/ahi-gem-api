import { z } from 'zod';

/**
 * Cart Validators
 *
 * Zod schemas for validating cart request data.
 */

export const addCartItemSchema = z.object({
    body: z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be positive').default(1),
    }),
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().positive('Quantity must be positive'),
    }),
    params: z.object({
        itemId: z.string().uuid('Invalid cart item ID'),
    }),
});

export const removeCartItemSchema = z.object({
    params: z.object({
        itemId: z.string().uuid('Invalid cart item ID'),
    }),
});
