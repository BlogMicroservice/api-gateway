import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.accessToken;
  console.log(token)
  if (!token) {
    res.status(401).json({ success: false, message: 'Access token not found' });
    return; // ✅ Add return
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = decoded;
    req.headers['x-user-id'] = decoded.id;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: 'Invalid or expired token', error });
    return; // ✅ Add return
  }
};
