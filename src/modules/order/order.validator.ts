import { z } from 'zod';

/**
 * Order Validators
 *
 * Zod schemas for validating order request data.
 */

const orderItemSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
});

export const createOrderSchema = z.object({
    body: z.object({
        items: z.array(orderItemSchema).min(1, 'At least one item is required'),
        shippingAddress: z.object({
            street: z.string().min(1),
            city: z.string().min(1),
            state: z.string().min(1),
            zipCode: z.string().min(1),
            country: z.string().min(1),
        }),
        billingAddress: z.object({
            street: z.string().min(1),
            city: z.string().min(1),
            state: z.string().min(1),
            zipCode: z.string().min(1),
            country: z.string().min(1),
        }).optional(),
        notes: z.string().optional(),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum([
            'PENDING', 'CONFIRMED', 'PROCESSING',
            'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
        ]),
    }),
    params: z.object({
        id: z.string().uuid('Invalid order ID'),
    }),
});

export const getOrderSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid order ID'),
    }),
});
