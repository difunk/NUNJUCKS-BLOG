export interface BlogPost {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

export interface BlogPostWithSlug extends BlogPost {
  slug: string;
  timestamp: string;
}
