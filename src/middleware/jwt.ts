import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

dotenv.config();

const getToken = (authHeader: string) => {
  const splitHeader = authHeader.split(" ");
  return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
};

const authorized = async (authorization?: string) => {
  if (!authorization || typeof authorization !== "string") return null;

  try {
    const token = getToken(authorization);
    const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
    const payload: any = jwt.verify(token, secretKey);

    const user = await prismaClient.user.findUnique({ where: { id: payload.id } });
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  } catch {
    return null;
  }
};

const allowRoles = (roles: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = await authorized(req.headers.authorization);
      if (!user) throw new ResponseError(401, "Unauthorized");

      if (!roles.includes(user.role)) {
        throw new ResponseError(403, "Forbidden: Access denied");
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

const allowAdmin = allowRoles(['ADMIN']);
const allowAll = allowRoles(['USER', 'ADMIN']);

export default { allowRoles, allowAdmin, allowAll };
