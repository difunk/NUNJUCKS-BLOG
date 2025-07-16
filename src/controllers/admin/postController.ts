import type { Request, Response } from "express";
import { getAllBlogEntries } from "../../models/blogEntriesModel";
import { transformBlogEntriesData } from "../../utils/transformBlogData";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const FILE_PATH = path.join(__dirname, "..", "..", "data/blogEntries.json");

export const postsListing = async (req: Request, res: Response) => {
  const posts = await getAllBlogEntries();
  const postsWithSlug = transformBlogEntriesData(posts);

  res.render("admin/indexPage.njk", {
    title: "Admin-Dashboard",
    posts: postsWithSlug,
  });
};

async function deletePost(title: string) {
  const posts = await getAllBlogEntries();
  const filteredPosts = posts.filter((post) => {
    return post.title !== title;
  });

  const convertedPosts = JSON.stringify(filteredPosts, null, 2);
  await writeFile(FILE_PATH, convertedPosts, { encoding: "utf-8" });
}

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      throw new Error("Kein Titel empfangen!");
    }

    await deletePost(title);
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
