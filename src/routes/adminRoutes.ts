import express from "express";
import { postsListing } from "../controllers/admin/postController";

const router = express.Router();

router.get("/", postsListing);

export default router;
