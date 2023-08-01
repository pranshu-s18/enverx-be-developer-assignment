import { Router } from "express";
import { body, query } from "express-validator";
import {
  addNewPost,
  deletePostById,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/posts";
import { BlogCategory } from "../models/post";
import { isValidObjectId } from "mongoose";

const router = Router();
router.get(
  "/",
  query("page").isInt({ min: 1 }),
  query("date").optional().isIn(["asc", "desc"]),
  query("title").optional().isIn(["asc", "desc"]),
  query("category")
    .optional()
    .isIn(Object.values(BlogCategory))
    .withMessage("Invalid blog category"),
  getAllPosts
);

router.post(
  "/",
  body("title")
    .matches(/^[a-zA-Z0-9 ]{1,100}$/)
    .withMessage(
      "Title can only contain letters and numbers and must be less than 100 characters long"
    ),
  body("content")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Content cannot be longer than 1000 characters"),
  body("category")
    .isIn(Object.values(BlogCategory))
    .withMessage("Invalid blog category"),
  addNewPost
);

router.get(
  "/:id",
  query("id").custom((val) => !isValidObjectId(val)),
  getPostById
);

router.put(
  "/:id",
  query("id").custom((val) => !isValidObjectId(val)),
  body("title")
    .matches(/^[a-zA-Z0-9 ]{1,100}$/)
    .withMessage(
      "Title can only contain letters and numbers and must be less than 100 characters long"
    ),
  body("content")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Content cannot be longer than 1000 characters"),
  body("category")
    .isIn(Object.values(BlogCategory))
    .withMessage("Invalid blog category"),
  updatePost,
);

router.delete(
  "/:id",
  query("id").custom((val) => !isValidObjectId(val)),
  deletePostById
);

export default router;
