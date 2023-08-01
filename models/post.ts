import { Schema, model, Types } from "mongoose";

interface IPost {
  title: string;
  content: string;
  category: string;
  author: Types.ObjectId;
}

export enum BlogCategory {
  TECHNOLOGY = "Technology",
  TRAVEL = "Travel",
  FOOD = "Food",
  HEALTH = "Health",
  PERSONAL_DEVELOPMENT = "Personal Development",
  FASHION = "Fashion",
  PARENTING = "Parenting",
  HOME_AND_DECOR = "Home & Decor",
  FINANCE = "Finance",
  BOOKS_AND_LITERATURE = "Books & Literature",
  ENTERTAINMENT = "Entertainment",
  LIFESTYLE = "Lifestyle",
  PHOTOGRAPHY = "Photography",
  EDUCATION = "Education",
  ENVIRONMENT = "Environment",
  ART = "Art",
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true, maxlength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: BlogCategory, required: true },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema);
