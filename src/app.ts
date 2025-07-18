require("dotenv").config();

import express, { Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";
import { logger } from "./middlewares/loggerMiddleware";
import publicRoutes from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";
import { closeDB, connectDB } from "./db/database";

import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(cors());

nunjucks.configure(path.join(__dirname, "../src/views"), {
  autoescape: true,
  express: app,
  watch: true,
});

/** Routes */
app.set("view engine", "njk");

connectDB()
  .then(() => {
    app.use(publicRoutes).use("/admin", adminRoutes);

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Failed to start db server: " + error);
  });

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing database connection...");
  await closeDB();
  process.exit(0);
});
