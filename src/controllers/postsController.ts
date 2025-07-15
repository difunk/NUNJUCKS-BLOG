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

export const postsController = (req: Request, res: Response) => {
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
