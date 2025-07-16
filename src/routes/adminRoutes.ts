import express from "express";
import {
  deletePostController,
  postsListing,
  editPostForm,
  editPostSubmit,
} from "../controllers/admin/postController";

const router = express.Router();

router
  .get("/", postsListing)
  .post("/posts/delete", deletePostController)
  .get("/posts/:id/edit", editPostForm)
  .post("/posts/:id/edit", editPostSubmit);

export default router;
