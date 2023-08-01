import { Request, Response } from "express";
import postDB from "../models/post";
import { handleValidation } from "../utils/validation";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Sorting Flags
    const sortByCreatedAt = req.query.date === "asc" ? 1 : -1;
    const sortByTitle = req.query.title === "asc" ? 1 : -1;

    // Query
    const dbQuery: { category?: string; author?: string } = {};
    if (req.query.category) dbQuery["category"] = req.query.category as string;
    if (req.query.author) dbQuery["author"] = req.query.author as string;

    // Pagination
    const page = parseInt(req.query.page as string) - 1;
    const posts = await postDB.aggregate([
      { $match: dbQuery },
      { $skip: page * 10 },
      { $limit: 10 },
      { $sort: { createdAt: sortByCreatedAt, title: sortByTitle } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          author: { username: 1, avatar: 1 },
          title: 1,
          content: 1,
          category: 1,
        },
      },
    ]);

    const count = await postDB.count(dbQuery);
    return res.status(200).json({ posts, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const addNewPost = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    const { title, content, category } = req.body;
    const newPost = postDB.create({
      title,
      content,
      category,
      author: "64c8b89e37d9b94d4d57e154",
    });

    if (!newPost) throw new Error("Something went wrong");
    return res.status(201).json({ message: "Post created successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    const post = await postDB
      .findById(req.params.id)
      .populate("author", "username avatar")
      .select("title content category createdAt");

    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    const post = await postDB.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    const { title, content, category } = req.body;
    const post = await postDB
      .findByIdAndUpdate(
        req.params.id,
        { title, content, category },
        { new: true }
      )
      .populate("author", "username avatar");

    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
