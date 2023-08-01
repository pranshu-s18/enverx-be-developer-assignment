import { Schema, model, Types } from "mongoose";

interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true, maxlength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema);
