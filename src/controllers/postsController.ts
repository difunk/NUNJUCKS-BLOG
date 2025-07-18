import type { Request, Response } from "express";
import { getDB } from "../db/database";

export const postsController = async (req: Request, res: Response) => {
  const db = getDB();
  const id = req.params.id;
  const sql = "SELECT * FROM blog_entries WHERE id = ?";

  db.get(sql, [id], (error, post) => {
    if (error || !post) {
      return res.status(404).send("Post nicht gefunden");
    }
    res.render("_layout/post.njk", { post });
  });
};
