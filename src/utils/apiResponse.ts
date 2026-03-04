import { Response } from 'express';

interface ApiResponseOptions<T> {
    res: Response;
    statusCode?: number;
    success?: boolean;
    message: string;
    data?: T;
    meta?: Record<string, any>;
}

export class ApiResponse {
    /**
     * Send a standardized success response.
     */
    static success<T>({
        res,
        statusCode = 200,
        message,
        data,
        meta,
    }: ApiResponseOptions<T>): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data: data ?? null,
            ...(meta && { meta }),
        });
    }

    /**
     * Send a standardized error response.
     */
    static error({
        res,
        statusCode = 500,
        message,
    }: Omit<ApiResponseOptions<never>, 'data' | 'success'>): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }

    /**
     * Send a paginated response.
     */
    static paginated<T>({
        res,
        data,
        message,
        page,
        limit,
        total,
    }: {
        res: Response;
        data: T[];
        message: string;
        page: number;
        limit: number;
        total: number;
    }): Response {
        return res.status(200).json({
            success: true,
            message,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        });
    }
}
