import { Request, Response } from "express";
import postDB from "../models/post";
import { handleValidation } from "../utils/validation";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Flags for sorting
    const sortByCreatedAt = req.query.date === "asc" ? 1 : -1;
    const sortByTitle = req.query.title === "asc" ? 1 : -1;

    // DB query object
    const dbQuery: { category?: string; author?: Types.ObjectId } = {};
    if (req.query.category) dbQuery["category"] = req.query.category as string;
    if (req.query.author)
      dbQuery["author"] = new Types.ObjectId(req.query.author as string);

    // Pagination - Page number starts from 1, 10 posts per page
    const page = parseInt(req.query.page as string) - 1;

    /**
     * $match to filter posts, if no filter is applied, it will return all posts
     * $lookup to get author details
     * $project to select only required fields
     * $unwind to flatten the author object
     */
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
          author: { _id: 1, username: 1, avatar: 1 },
          title: 1,
          content: 1,
          category: 1,
        },
      },
      { $unwind: "$author" },
    ]);

    // Count total number of posts for current query (used for pagination)
    const count = await postDB.count(dbQuery);
    return res.status(200).json({ posts, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const addNewPost = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Converting to AuthRequest to access user property
    const request = req as AuthRequest;

    // Create new post
    const { title, content, category } = req.body;
    const newPost = await postDB.create({
      title,
      content,
      category,
      author: request.user!._id,
    });

    // If post is created successfully, return the post, else throw error
    if (!newPost) throw new Error("Something went wrong");
    return res.status(201).json(newPost);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Find post by id and populate author details
    const post = await postDB
      .findById(req.params.id)
      .populate("author", "username avatar")
      .select("title content category createdAt");

    // If post is not found, return 404 error, else return the post
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Converting to AuthRequest to access user property
    const request = req as AuthRequest;

    // Find post by id
    const post = await postDB.findById(req.params.id);

    // If post is not found, return 404 error
    if (!post) return res.status(404).json({ error: "Post not found" });

    // If user is not the author of the post, return 403 error
    if (post.author !== request.user!._id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    // Delete post
    const deleted = await postDB.deleteOne({ _id: req.params.id });

    // If post is not deleted, throw error
    if (!deleted.acknowledged) throw new Error("Something went wrong");

    // Return success message
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = handleValidation(req);
    if (errors) return res.status(400).json({ error: errors });

    // Converting to AuthRequest to access user property
    const request = req as AuthRequest;

    // Find post by id
    const post = await postDB.findById(req.params.id);

    // If post is not found, return 404 error
    if (!post) return res.status(404).json({ error: "Post not found" });

    // If user is not the author of the post, return 403 error
    if (post.author !== request.user!._id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    // Update post
    const { title, content } = req.body;
    post.title = title;
    post.content = content;
    
    const updatedPost = await post.save();
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
