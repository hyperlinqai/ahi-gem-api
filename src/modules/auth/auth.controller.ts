import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils';
import { ApiResponse } from '../../utils';

/**
 * Auth Controller
 *
 * Handles authentication-related HTTP requests.
 */
export class AuthController {
    register = catchAsync(async (req: Request, res: Response) => {
        const { user, tokens } = await authService.register({
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return ApiResponse.success({
            res,
            statusCode: 201,
            data: { user, tokens },
            message: 'User registered successfully'
        });
    });

    login = catchAsync(async (req: Request, res: Response) => {
        const { user, tokens } = await authService.login({
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return ApiResponse.success({
            res,
            statusCode: 200,
            data: { user, tokens },
            message: 'User logged in successfully'
        });
    });

    logout = catchAsync(async (req: Request, res: Response) => {
        // Use refresh token from body or headers depending on client implementation. Assuming body for now based on typical setup.
        const { refreshToken } = req.body;

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        return ApiResponse.success({
            res,
            statusCode: 200,
            data: null,
            message: 'User logged out successfully'
        });
    });

    refreshToken = catchAsync(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        const tokens = await authService.refreshToken(
            refreshToken,
            req.ip,
            req.headers['user-agent']
        );

        return ApiResponse.success({
            res,
            statusCode: 200,
            data: { tokens },
            message: 'Token refreshed successfully'
        });
    });
}

export const authController = new AuthController();
