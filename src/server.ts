import { app } from './app';
import { env, logger } from './config';
import { Database } from './database';

const PORT = env.PORT;

/**
 * Start the server and connect to the database.
 */
const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        await Database.connect();

        // Start HTTP server
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
            logger.info(`📋 Health check: http://localhost:${PORT}/health`);
            logger.info(`📡 API base URL: http://localhost:${PORT}/api/v1`);
        });

        // ──────────────────────────────────────────────
        // Graceful Shutdown
        // ──────────────────────────────────────────────

        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                // Disconnect from database
                await Database.disconnect();

                logger.info('Graceful shutdown complete');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: any) => {
            logger.error(reason, 'Unhandled Rejection');
            // Don't exit; let the error handler deal with it
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.fatal(error, 'Uncaught Exception');
            process.exit(1);
        });
    } catch (error) {
        logger.fatal(error, 'Failed to start server');
        process.exit(1);
    }
};

startServer();
