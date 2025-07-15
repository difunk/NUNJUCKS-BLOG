import express from "express";
import {
  deletePostController,
  postsListing,
} from "../controllers/admin/postController";

const router = express.Router();

router.get("/", postsListing).post("/posts/delete", deletePostController);

export default router;
