import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config';
import type { JwtPayload } from '../types/common.types';

/**
 * Generate an access token for a user.
 */
export const generateAccessToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Generate a refresh token for a user.
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

/**
 * Verify an access token and return the decoded payload.
 */
export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

/**
 * Verify a refresh token and return the decoded payload.
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

/**
 * Generate both access and refresh tokens for a user.
 */
export const generateTokenPair = (
    payload: JwtPayload
): { accessToken: string; refreshToken: string } => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};
