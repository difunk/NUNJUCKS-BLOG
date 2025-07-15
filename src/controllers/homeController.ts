import type { Request, Response } from "express";
import slug from "slug";
import posts from "../data/blogEntries.json";
import type { BlogPost, BlogPostWithSlug } from "../types/blogPost";

const postsWithSlug: BlogPostWithSlug[] = posts.map((post: BlogPost) => {
  const titleAsSlug = slug(post.title);
  const timestamp = new Date(post.createdAt * 1000).toLocaleDateString("de-DE");
  return {
    ...post,
    slug: titleAsSlug,
    timestamp,
  };
});

export const homeController = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html");
  res.render("../templates/home.njk", {
    title: "Home",
    subtitle: "Willkommen auf meinem Nunjucks-Blog!",
    posts: postsWithSlug,
    image: "/images/home-bg.jpg",
  });
};
