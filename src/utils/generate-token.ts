import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (data: any) => {
    const user_data = {
        id: data.id,
        username: data.username,
        role: data.role,
    };
    const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";

    const accessToken = jwt.sign(user_data, secretKey, { expiresIn: "6h" });
    return accessToken;
};

const getToken = (authHeader: string) => {
    const splitHeader = authHeader.split(' ');
    return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
}

export {
    generateAccessToken,
    getToken
};