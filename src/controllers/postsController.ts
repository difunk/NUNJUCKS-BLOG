import type { Request, Response } from "express";
import slug from "slug";
import posts from "../data/blogEntries.json";
import type { BlogPost, BlogPostWithSlug } from "../types/blogPost";
import { transformBlogEntriesData } from "../utils/transformBlogData";

export const postsController = async (req: Request, res: Response) => {
  const postsWithSlug = await transformBlogEntriesData(posts);
  const currentPost = postsWithSlug.find((post: BlogPostWithSlug) => {
    return post.slug === req.params.slug;
  });

  if (currentPost) {
    res.render("post.njk", {
      title: currentPost.title,
      subtitle: currentPost.teaser,
      post: currentPost,
      image: `/images/${currentPost.image}`,
      timestamp: currentPost.timestamp,
    });
  } else {
    res.status(404).send("Post nicht gefunden");
  }
};
