import { prisma } from '../../database';
import { Prisma } from '@prisma/client';

/**
 * Auth Repository
 *
 * Data access layer for authentication-related database operations.
 */
export class AuthRepository {
    async createUser(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
        });
    }

    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }

    async findUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }

    async createSession(data: Prisma.SessionCreateInput) {
        return prisma.session.create({
            data,
        });
    }

    async findSessionByToken(refreshToken: string) {
        return prisma.session.findUnique({
            where: { refreshToken },
            include: { user: { include: { role: true } } },
        });
    }

    async deleteSession(id: string) {
        return prisma.session.delete({
            where: { id },
        });
    }

    async deleteUserSessions(userId: string) {
        return prisma.session.deleteMany({
            where: { userId },
        });
    }

    async getCustomerRole() {
        return prisma.role.findFirst({
            where: { name: 'Customer' },
        });
    }
}

export const authRepository = new AuthRepository();
