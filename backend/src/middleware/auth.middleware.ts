import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.jwt_key;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("userId" in decoded)
        ) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.userId = decoded.userId as string;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};