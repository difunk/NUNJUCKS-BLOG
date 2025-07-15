import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { BlogPost, BlogPosts, BlogPostWithSlug } from "../types/blogPost";

const FILE_PATH = path.join(__dirname, "..", "data/blogEntries.json");

export async function getAllBlogEntries(): Promise<BlogPosts> {
  console.log(FILE_PATH, "../data/blogEntries.json");
  try {
    const blogEntries = await readFile(FILE_PATH, { encoding: "utf8" });

    if (blogEntries.length === 0) {
      return [];
    } else {
      return JSON.parse(blogEntries);
    }
  } catch (error) {
    return [];
  }
}
