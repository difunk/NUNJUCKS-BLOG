import type { Request, Response } from "express";
import { getAllBlogEntries } from "../../models/blogEntriesModel";
import { transformBlogEntriesData } from "../../utils/transformBlogData";
import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlogPost } from "../../types/blogPost";
import multer from "multer";
import sanitizeHtml from "sanitize-html";
import { getDB } from "../../db/database";

const upload = multer({ dest: "public/images/" });

const FILE_PATH = path.join(__dirname, "..", "..", "data/blogEntries.json");

export const postsListing = async (req: Request, res: Response) => {
  const posts = await getAllBlogEntries();
  const postsWithSlug = transformBlogEntriesData(posts);

  res.render("admin/indexPage.njk", {
    title: "Admin-Dashboard",
    posts: postsWithSlug,
  });
};

async function deletePost(id: number): Promise<void> {
  const db = getDB();
  const sql = `DELETE FROM blog_entries WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(sql, [id], (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new Error("Keine ID empfangen!");
    }

    await deletePost(id);
    res.redirect("/admin");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    res.status(500).send("Fehler beim Löschen: " + errorMessage);
  }
};

export const editPostForm = async (req: Request, res: Response) => {
  const db = getDB();
  const sql = `SELECT * FROM blog_entries WHERE id = ?`;
  const id = req.params.id;

  const post = await new Promise<BlogPost>((resolve, reject) => {
    db.get(sql, [id], (error: Error | null, rowData: BlogPost) => {
      if (error) {
        reject(error);
      } else {
        resolve(rowData);
      }
    });
  });

  res.render("admin/editPost.njk", { title: "Beitrag bearbeiten", post });
};

export const editPostSubmit = async (req: Request, res: Response) => {
  const db = getDB();
  const sql = `UPDATE blog_entries SET title = ?, author = ?, content = ? WHERE id = ?`;
  const id = req.params.id;
  const { title, author, content } = req.body;

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(sql, [title, author, content, id], (error: Error | null) => {
        if (error) reject(error);
        else resolve();
      });
    });
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Fehler beim aktualsieren");
  }
};

function getSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export const addPostController = async (req: Request, res: Response) => {
  try {
    res.render("admin/addPost.njk", { title: "Neuen Beitrag erstellen" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    res.status(500).send("Fehler beim aufrufen der Seite: " + errorMessage);
  }
};

export const addPostSubmit = async (req: Request, res: Response) => {
  let imagePath: string;

  if (req.file) {
    const ext = path.extname(req.file.originalname);
    const oldPath = req.file.path;
    const newPath = req.file.path + ext;

    await rename(oldPath, newPath);
    imagePath = req.file.filename + ext;
  } else {
    imagePath = "/images/default.jpg";
  }

  const db = getDB();
  const sql = `INSERT INTO blog_entries (title, image, author, createdAt, teaser, content) VALUES (?, ?, ?, ?, ?, ?)`;
  const id = req.params.id;
  const { title, author, content } = req.body;
  const cleanContent = sanitizeHtml(content);
  const teaser = cleanContent.slice(0, 120);
  const createdAt = Math.floor(Date.now() / 1000);

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(
        sql,
        [title, imagePath, author, createdAt, teaser, cleanContent],
        (error: Error | null) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Fehler beim aktualsieren");
  }
};
