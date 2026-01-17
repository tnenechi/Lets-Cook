import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const JWT_ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
}

if (!JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
}

export const generateAccessToken = (userId: string) => {
  const payload = { userId };

  const token = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN as any,
  });

  return token;
};


export const generateRefreshToken = (userId: string) => {
  const payload = { userId };

  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as any,
  });

  return token;
};
