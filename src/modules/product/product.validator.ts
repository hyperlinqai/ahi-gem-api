import { z } from 'zod';

/**
 * Product Validators
 *
 * Zod schemas for validating product request data.
 */

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Product name is required'),
        description: z.string().optional(),
        price: z.number().positive('Price must be positive'),
        compareAt: z.number().positive().optional(),
        sku: z.string().optional(),
        stock: z.number().int().min(0).default(0),
        categoryId: z.string().uuid().optional(),
        images: z.array(z.string().url()).default([]),
    }),
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        compareAt: z.number().positive().nullable().optional(),
        sku: z.string().optional(),
        stock: z.number().int().min(0).optional(),
        categoryId: z.string().uuid().nullable().optional(),
        images: z.array(z.string().url()).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().uuid('Invalid product ID'),
    }),
});

export const getProductSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid product ID'),
    }),
});
