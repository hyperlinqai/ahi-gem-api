import rateLimit from 'express-rate-limit';

/**
 * General rate limiter for all routes.
 * Limits each IP to 100 requests per 15-minute window.
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
});

/**
 * Strict rate limiter for authentication routes.
 * Limits each IP to 10 requests per 15-minute window.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
});
