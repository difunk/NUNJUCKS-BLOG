import express from "express";
import { aboutController } from "../controllers/aboutController";
import { homeController } from "../controllers/homeController";
import { postsController } from "../controllers/postsController";
import { contactController } from "../controllers/contactController";

const router = express.Router();

router
  .get("/", homeController)
  .get("/posts/:id", postsController)
  .get("/contact", contactController)
  .get("/about", aboutController);

export default router;
