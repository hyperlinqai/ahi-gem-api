import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import { env } from './config';
import {
    generalLimiter,
    requestLogger,
    errorHandler,
    notFoundHandler,
} from './middlewares';

// Module routes
import { authRoutes } from './modules/auth';
import { userRoutes } from './modules/user';
import { productRoutes } from './modules/product';
import { orderRoutes } from './modules/order';
import { cartRoutes } from './modules/cart';

const app: Application = express();

// ──────────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────────

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
    cors({
        origin: env.NODE_ENV === 'production' ? [] : '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Rate limiting
app.use(generalLimiter);

// Prevent HTTP parameter pollution
app.use(hpp());

// ──────────────────────────────────────────────
// Body Parsing
// ──────────────────────────────────────────────

// Parse JSON request bodies (limit to 10kb)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ──────────────────────────────────────────────
// Request Logging
// ──────────────────────────────────────────────

app.use(requestLogger);

// ──────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// ──────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);

// ──────────────────────────────────────────────
// Error Handling
// ──────────────────────────────────────────────

// Handle 404 routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export { app };
