export interface BlogPost {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

type BlogPosts = BlogPost[];

export interface BlogPostWithSlug extends BlogPost {
  slug: string;
  timestamp: string;
}
