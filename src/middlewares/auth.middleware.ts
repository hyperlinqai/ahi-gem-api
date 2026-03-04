import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { ApiError } from '../utils/apiError';
import { logger } from '../config';

/**
 * Middleware to authenticate requests using JWT access tokens.
 * Extracts the token from the Authorization header (Bearer scheme),
 * verifies it, and attaches the decoded payload to req.user.
 */
export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Access token is required');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw ApiError.unauthorized('Access token is required');
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;

        next();
    } catch (error: any) {
        if (error instanceof ApiError) {
            next(error);
            return;
        }

        if (error.name === 'TokenExpiredError') {
            next(ApiError.unauthorized('Access token has expired'));
            return;
        }

        if (error.name === 'JsonWebTokenError') {
            next(ApiError.unauthorized('Invalid access token'));
            return;
        }

        logger.error(error, 'Authentication error');
        next(ApiError.unauthorized('Authentication failed'));
    }
};

/**
 * Middleware to restrict access to specific roles.
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(ApiError.unauthorized('Authentication required'));
            return;
        }

        if (!roles.includes(req.user.role)) {
            next(ApiError.forbidden('Insufficient permissions'));
            return;
        }

        next();
    };
};
