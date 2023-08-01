import { Request, Response } from "express";
import userDB from "../models/user";
import bcrypt from "bcrypt";
import { handleValidation } from "../utils/validation";
import { createToken } from "../middlewares/auth";

export const register = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Check if user exists
    const { username, email, password } = req.body;
    const exists = await userDB.findOne({ email }, { _id: 1 });

    // If user exists, return 400 error
    if (exists) return res.status(400).json({ error: "User already exists" });

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userDB.create({
      username,
      email,
      password: hashedPassword,
    });

    // If user is created successfully, return 201 status, else throw error
    if (!user) throw new Error("Something went wrong");
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Check if user exists
    const { email, password } = req.body;
    const user = await userDB.findOne({ email });

    // If user does not exist, return 401 error
    if (!user) return res.status(401).json({ error: "Invalid Credentials" });

    // Compare password using bcrypt
    const match = await bcrypt.compare(password, user!.password);

    // If password does not match, return 401 error
    if (!match) return res.status(401).json({ error: "Invalid Credentials" });

    // Create token and set cookie
    createToken(
      { _id: user._id, username: user.username, avatar: user.avatar },
      res
    );

    // If password matches, return user details
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        avatar:
          user?.avatar ??
          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};
