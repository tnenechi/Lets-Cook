import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { CookieOptions, Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { Send } from "../utils/response.js";
import ms from "ms";

const JWT_REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN ?? "1d";
const JWT_ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m";

const accessTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: ms(JWT_ACCESS_EXPIRES_IN as ms.StringValue),
};

const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: ms(JWT_REFRESH_EXPIRES_IN as ms.StringValue),
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Send.error(res, "User already exists");
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        hashPassword,
      },
    });

    return Send.success(
      res,
      { userId: newUser.id },
      "User registered successfully",
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Send.error(res, "Registration failed");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Send.unauthorized(res, "Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordValid) {
      return Send.unauthorized(res, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    res.cookie("accessToken", accessToken, accessTokenCookieConfig);

    return Send.success(
      res,
      { user: { id: user.id, email: user.email } },
      "Login successful",
    );
  } catch (error) {
    console.error("Login error:", error);
    return Send.error(res, "Login failed");
  }
};

const logOut = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
  });

  return Send.success(res, null, "Logged out successfully");
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  // No refresh token
  if (!refreshToken) {
    return Send.unauthorized(res, "No refresh token provided");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    // No user
    if (!user) {
      return Send.unauthorized(res, "User not found");
    }

    // Generate tokens
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieConfig);

    res.cookie("accessToken", newAccessToken, accessTokenCookieConfig);

    return Send.success(res, null, "Access token refreshed");
  } catch (error) {
    console.error("Refresh token error:", error);
    return Send.unauthorized(res, "Invalid refresh token");
  }
};

const getUser = (req: Request, res: Response) => {
  return Send.success(res, { user: (req as any).user });
};

export { register, login, logOut, refreshToken, getUser };
