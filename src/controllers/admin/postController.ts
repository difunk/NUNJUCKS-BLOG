import type { Request, Response } from "express";
import { getAllBlogEntries } from "../../models/blogEntriesModel";
import { transformBlogEntriesData } from "../../utils/transformBlogData";

export const postsListing = async (req: Request, res: Response) => {
  const posts = await getAllBlogEntries();
  const postsWithSlug = transformBlogEntriesData(posts);

  res.render("admin/indexPage.njk", {
    title: "Admin-Dashboard",
    posts: postsWithSlug,
  });
};
