import slug from "slug";
import type { BlogPost, BlogPosts, BlogPostWithSlug } from "../types/blogPost";

export function transformBlogEntriesData(posts: BlogPosts) {
  const postsWithSlug: BlogPostWithSlug[] = posts.map((post: BlogPost) => {
    const titleAsSlug = slug(post.title);
    const timestamp = new Date(post.createdAt * 1000).toLocaleDateString(
      "de-DE",
    );
    return {
      ...post,
      slug: titleAsSlug,
      timestamp,
    };
  });

  return postsWithSlug;
}
