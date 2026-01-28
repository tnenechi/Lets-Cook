import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { Send } from "../utils/response.js";
import { prisma } from "../../lib/prisma.js";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return Send.unauthorized(res, "Token missing");
  }

  //verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    const userId = (decoded as { userId: string }).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Send.unauthorized(res, "User no longer exists");
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return Send.unauthorized(res, "Invalid or expired token");
  }
};
