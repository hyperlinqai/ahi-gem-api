import { Router } from 'express';
import { authController } from './auth.controller';
import { validate, authenticate } from '../../middlewares';
import { loginSchema, registerSchema, refreshTokenSchema } from './auth.validator';
import { authLimiter } from '../../middlewares';

const router = Router();

/**
 * Auth Routes
 *
 * Routes:
 * POST /register  - Register a new user
 * POST /login     - Login user
 * POST /logout    - Logout user
 * POST /refresh   - Refresh access token
 */

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

export { router as authRoutes };
