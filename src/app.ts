require("dotenv").config();

import express, { Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";

import { logger } from "./middlewares/loggerMiddleware";
import { aboutController } from "./controllers/aboutController";
import { homeController } from "./controllers/homeController";
import { postsController } from "./controllers/postsController";
import { contactController } from "./controllers/contactController";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

// Logger nur für dynamische Routes, nicht für statische Dateien
app.use(logger);

nunjucks.configure(path.join(__dirname, "../src/templates"), {
  autoescape: true,
  express: app,
  watch: true,
});

app.set("view engine", "njk");

app
  .get("/", homeController)
  .get("/posts/:slug", postsController)
  .get("/contact", contactController)
  .get("/about", aboutController);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
