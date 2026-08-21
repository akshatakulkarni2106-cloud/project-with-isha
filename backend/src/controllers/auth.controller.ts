import { Request, Response } from "express";
import { signupUser} from "../services/auth.services";
import { loginUser } from "../services/auth.services";
import { prisma } from "../db/db";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const signup = async (
    req: Request,
    res: Response
) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const user = await signupUser(
            name,
            email,
            password
        );

        return res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {

        return res.status(400).json({
            message: (error as Error).message
        });
    }
};


export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await loginUser(
            email,
            password
        );

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: result.user
        });

    } catch (error) {

        return res.status(401).json({
            message: (error as Error).message
        });
    }
};

export const getMe = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        if (!req.userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const logout = (
    req: Request,
    res: Response
) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json({
        message: "Logout successful"
    });
};