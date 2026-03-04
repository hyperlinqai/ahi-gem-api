import { PrismaClient } from '@prisma/client';
import { logger } from '../config';

class Database {
    private static instance: PrismaClient;

    private constructor() { }

    public static getInstance(): PrismaClient {
        if (!Database.instance) {
            Database.instance = new PrismaClient({
                log: [
                    { level: 'query', emit: 'event' },
                    { level: 'error', emit: 'stdout' },
                    { level: 'warn', emit: 'stdout' },
                ],
            });

            Database.instance.$on('query' as never, (e: any) => {
                logger.debug({ query: e.query, duration: e.duration }, 'Prisma Query');
            });
        }

        return Database.instance;
    }

    public static async connect(): Promise<void> {
        try {
            const client = Database.getInstance();
            await client.$connect();
            logger.info('✅ Database connected successfully');
        } catch (error) {
            logger.error(error, '❌ Database connection failed');
            process.exit(1);
        }
    }

    public static async disconnect(): Promise<void> {
        try {
            const client = Database.getInstance();
            await client.$disconnect();
            logger.info('Database disconnected');
        } catch (error) {
            logger.error(error, 'Error disconnecting from database');
        }
    }
}

export const prisma = Database.getInstance();
export { Database };
