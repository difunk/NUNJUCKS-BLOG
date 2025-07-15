import type { Request, Response } from "express";
import { getAllBlogEntries } from "../models/blogEntriesModel";
import { transformBlogEntriesData } from "../utils/transformBlogData";

export const homeController = async (req: Request, res: Response) => {
  const posts = await getAllBlogEntries();
  const postsWithSlug = transformBlogEntriesData(posts);

  res.setHeader("Content-Type", "text/html");
  res.render("home.njk", {
    title: "Home",
    subtitle: "Willkommen auf meinem Nunjucks-Blog!",
    posts: postsWithSlug,
    image: "/images/home-bg.jpg",
  });
};
