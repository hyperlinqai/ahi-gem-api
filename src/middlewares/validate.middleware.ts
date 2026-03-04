import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

/**
 * Middleware factory that validates request body, query, and params
 * against the provided Zod schema.
 */
export const validate = (schema: AnyZodObject) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                next(
                    ApiError.badRequest(
                        `Validation failed: ${messages.map((m) => `${m.field} - ${m.message}`).join(', ')}`
                    )
                );
                return;
            }

            next(error);
        }
    };
};
