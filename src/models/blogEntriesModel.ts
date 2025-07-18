import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { BlogPost, BlogPosts, BlogPostWithSlug } from "../types/blogPost";
import { getDB } from "../db/database";
import { error } from "node:console";

export async function getAllBlogEntries(): Promise<BlogPosts> {
  const db = getDB();

  return new Promise((resolve, reject) => {
    db.all<BlogPost>(
      `SELECT * FROM blog_entries`,
      [],
      (error: Error | null, rowData: BlogPosts) => {
        if (error) {
          reject(error);
        } else {
          resolve(rowData);
        }
      },
    );
  });
}
