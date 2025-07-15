require("dotenv").config();

import express, { Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";
import { logger } from "./middlewares/loggerMiddleware";
import publicRoutes from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

nunjucks.configure(path.join(__dirname, "../src/views"), {
  autoescape: true,
  express: app,
  watch: true,
});

/** Routes */
app.set("view engine", "njk");

app.use(publicRoutes).use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
