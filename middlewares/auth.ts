import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

export interface UserProfile {
  _id: Types.ObjectId;
  username: string;
  avatar?: string;
}

export interface AuthRequest extends Request {
  user?: UserProfile;
}

export const createToken = (user: UserProfile, res: Response) => {
  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 3600000,
    secure: true,
  });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.cookies?.token;
    if (!token) throw new Error("Unauthorized");

    const user = jwt.verify(token, process.env.JWT_SECRET!) as UserProfile;
    (req as AuthRequest).user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const notLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.cookies?.token;
    if (!token) return next();
    return res.status(400).json({ error: "Already logged in" });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
