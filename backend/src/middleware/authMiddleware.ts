import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { Send } from "../utils/response.js";
import { prisma } from "../lib/prisma.js";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Extract the token
  let accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return Send.unauthorized(res, "accessToken missing");
  }

  //verify the accessToken
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    );

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
    return Send.invalidToken(res, "Access token expired");
  }
};
