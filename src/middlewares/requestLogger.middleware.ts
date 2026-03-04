import pinoHttp from 'pino-http';
import { logger } from '../config';

/**
 * HTTP request logging middleware using Pino.
 */
export const requestLogger = pinoHttp({
    logger,
    autoLogging: {
        ignore: (req) => {
            // Skip logging for health check endpoints
            return req.url === '/health' || req.url === '/favicon.ico';
        },
    },
    customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage: (req, _res, err) => {
        return `${req.method} ${req.url} failed: ${err.message}`;
    },
});
