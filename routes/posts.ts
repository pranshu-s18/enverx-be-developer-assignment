import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  addNewPost,
  deletePostById,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/posts";
import { BlogCategory } from "../models/post";

const router = Router();
router.get(
  "/",
  query("page").isInt({ min: 1 }),
  query("date").optional().isIn(["asc", "desc"]),
  query("title").optional().isIn(["asc", "desc"]),
  query("author").optional().isMongoId(),
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
  param("id").isMongoId().withMessage("Invalid post id"),
  getPostById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Invalid post id"),
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
  updatePost
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid post id"),
  deletePostById
);

export default router;
