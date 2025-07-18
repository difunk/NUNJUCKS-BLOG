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

// async function deletePost(title: string) {
//   const posts = await getAllBlogEntries();
//   const filteredPosts = posts.filter((post) => {
//     return post.title !== title;
//   });

//   const convertedPosts = JSON.stringify(filteredPosts, null, 2);
//   await writeFile(FILE_PATH, convertedPosts, { encoding: "utf-8" });
// }

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
  try {
    const postId = req.params.id;
    const posts = await getAllBlogEntries();
    const postsWithSlug = transformBlogEntriesData(posts);
    const post = postsWithSlug.find((postToEdit) => postToEdit.slug === postId);

    res.render("admin/editPost.njk", { title: "Beitrag bearbeiten", post });
  } catch (error) {}
};

function getSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export const editPostSubmit = async (req: Request, res: Response) => {
  try {
    const { title, author, content } = req.body;
    const postId = req.params.id;
    const posts = await getAllBlogEntries();
    const post = posts.find((p) => getSlug(p.title) === postId);

    if (post) {
      post.title = title;
      post.author = author;
      post.content = content;
      const convertedPosts = JSON.stringify(posts, null, 2);
      await writeFile(FILE_PATH, convertedPosts, { encoding: "utf-8" });
      res.redirect("/admin");
    } else {
      res.status(404).send("Post nicht gefunden");
    }
  } catch (error) {
    res.status(500).send("Fehler beim aktualsieren");
  }
};

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

  try {
    const { title, author, content } = req.body;
    const cleanContent = sanitizeHtml(content);
    const posts = await getAllBlogEntries();

    const newPost: BlogPost = {
      id: Math.floor(Date.now() / 1000),
      title,
      image: imagePath,
      author,
      createdAt: Math.floor(Date.now() / 1000),
      teaser: cleanContent.slice(0, 120),
      content: cleanContent || "",
    };

    posts.push(newPost);

    await writeFile(FILE_PATH, JSON.stringify(posts, null, 2), {
      encoding: "utf-8",
    });
    res.redirect("/admin");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    res.status(500).send("Fehler beim hinzufügen: " + errorMessage);
  }
};
