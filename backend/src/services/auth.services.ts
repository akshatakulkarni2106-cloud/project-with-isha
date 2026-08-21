import argon2 from "argon2";
import { prisma } from "../db/db";
import { createToken } from "../utils/jwt.js";

export const signupUser = async (
    name: string,
    email: string,
    password: string
) => {

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash
        }
    });

    // Never send password/hash to the client
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
};

export const loginUser = async (
    email: string,
    password: string
) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await argon2.verify(
        user.passwordHash,
        password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = createToken(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
};