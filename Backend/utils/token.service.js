import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_change_me';

export const generateAccessToken = (admin) => {
    return jwt.sign(
        {
            id: admin.id,
            email: admin.email,
            role: 'admin',
            jti: crypto.randomUUID()
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (admin) => {
    return jwt.sign(
        {
            id: admin.id,
            jti: crypto.randomUUID()
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
