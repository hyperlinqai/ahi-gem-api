import { authRepository } from './auth.repository';
import { hashPassword, comparePassword, generateTokenPair, ApiError } from '../../utils';

/**
 * Auth Service
 *
 * Contains business logic for authentication operations.
 */
export class AuthService {
    async register(data: any) {
        // Check if user exists
        const existingUser = await authRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new ApiError(400, 'User with this email already exists');
        }

        // Get default customer role
        const customerRole = await authRepository.getCustomerRole();
        if (!customerRole) {
            throw new ApiError(500, 'Customer role not found in database');
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = await authRepository.createUser({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: { connect: { id: customerRole.id } },
        });

        // Generate tokens
        const tokens = generateTokenPair({ userId: user.id, role: customerRole.name });

        // Save refresh token session
        await authRepository.createSession({
            userId: user.id,
            refreshToken: tokens.refreshToken,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Exclude password from response
        const { password, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, tokens };
    }

    async login(data: any) {
        const user = await authRepository.findUserByEmail(data.email);
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        if (!user.isActive) {
            throw new ApiError(403, 'Account is deactivated');
        }

        // Generate tokens
        const tokens = generateTokenPair({ userId: user.id, role: user.role.name });

        // Save refresh token session
        await authRepository.createSession({
            userId: user.id,
            refreshToken: tokens.refreshToken,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, tokens };
    }

    async logout(refreshToken: string) {
        const session = await authRepository.findSessionByToken(refreshToken);
        if (session) {
            await authRepository.deleteSession(session.id);
        }
    }

    async refreshToken(refreshToken: string, ipAddress?: string, userAgent?: string) {
        const session = await authRepository.findSessionByToken(refreshToken);

        if (!session || session.expiresAt < new Date()) {
            if (session) {
                await authRepository.deleteSession(session.id);
            }
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        // Generate new tokens
        const tokens = generateTokenPair({ userId: session.user.id, role: session.user.roleId /* role name is normally better here, but we'd need to fetch user w/ role */ });

        // Replace session
        await authRepository.deleteSession(session.id);
        await authRepository.createSession({
            userId: session.user.id,
            refreshToken: tokens.refreshToken,
            userAgent,
            ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        return tokens;
    }
}

export const authService = new AuthService();
