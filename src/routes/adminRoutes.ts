import express from "express";
import {
  deletePostController,
  postsListing,
  editPostForm,
  editPostSubmit,
  addPostController,
  addPostSubmit,
} from "../controllers/admin/postController";
import multer from "multer";

const upload = multer({ dest: "public/images/" });

const router = express.Router();

router
  .get("/", postsListing)
  .post("/posts/delete", deletePostController)
  .get("/posts/:id/edit", editPostForm)
  .post("/posts/:id/edit", editPostSubmit)
  .get("/posts/add", addPostController)
  .post("/posts/add", upload.single("image"), addPostSubmit);

export default router;
