import { Request, Response } from "express";
import userDB from "../models/user";
import bcrypt from "bcrypt";
import { handleValidation } from "../utils/validation";

export const register = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    const { username, email, password } = req.body;
    const exists = await userDB.findOne({ email }, { _id: 1 });

    if (exists) return res.status(400).json({ error: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDB.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) throw new Error("Something went wrong");
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    const { email, password } = req.body;
    const user = await userDB.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Credentials" });

    const match = await bcrypt.compare(password, user!.password);
    if (!match) return res.status(400).json({ error: "Invalid Credentials" });

    return res
      .status(200)
      .json({
        id: user._id,
        username: user.username,
        avatar: user?.avatar ?? "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
