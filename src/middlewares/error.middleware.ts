import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../config';
import { env } from '../config';

/**
 * Global error handling middleware.
 * Catches all errors and sends a standardized error response.
 */
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }

    // Log error
    if (!isOperational) {
        logger.error(
            {
                err,
                method: req.method,
                url: req.url,
                statusCode,
            },
            'Unhandled error'
        );
    } else {
        logger.warn(
            {
                message: err.message,
                method: req.method,
                url: req.url,
                statusCode,
            },
            'Operational error'
        );
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV === 'development' && {
            stack: err.stack,
        }),
    });
};

/**
 * Middleware to handle 404 (Not Found) errors.
 */
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
