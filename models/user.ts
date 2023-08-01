import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, maxlength: 20 },
    email: { type: String, required: true },
    password: { type: String, require: true },
    avatar: String,
  },
  { timestamps: { createdAt: true } }
);

export default model<IUser>("User", userSchema);
