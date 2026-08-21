import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.jwt_key;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const createToken = (userId: string) => {
    return jwt.sign(
        {
            userId
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};