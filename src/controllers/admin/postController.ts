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
    console.log("🔥 DELETE REQUEST RECEIVED");
    console.log("📝 req.body:", req.body);

    const { title } = req.body;
    console.log("🎯 Title to delete:", title);

    if (!title) {
      throw new Error("Kein Titel empfangen!");
    }

    await deletePost(title);
    console.log("✅ Post deleted successfully");
    res.redirect("/admin");
  } catch (error: unknown) {
    console.error("❌ Delete error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    res.status(500).send("Fehler beim Löschen: " + errorMessage);
  }
};
