require("dotenv").config();

import express, { Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";
import fs from "fs";
import slug from "slug";

interface BlogPost {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

interface BlogPostWithSlug extends BlogPost {
  slug: string;
  timestamp: string;
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

nunjucks.configure(path.join(__dirname, "../src/templates"), {
  autoescape: true,
  express: app,
  watch: true,
});

const rawData = fs.readFileSync(
  path.join(__dirname, "../src/data/blogEntries.json"),
  "utf-8"
);
const posts: BlogPost[] = JSON.parse(rawData);

app.set("view engine", "njk");

app.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html");
  res.render("home.njk", {
    title: "Home",
    subtitle: "Willkommen auf meinem Nunjucks-Blog!",
    posts: postsWithSlug,
    image: "/images/home-bg.jpg",
  });
});

const postsWithSlug: BlogPostWithSlug[] = posts.map((post: BlogPost) => {
  const titleAsSlug = slug(post.title);
  const timestamp = new Date(post.createdAt * 1000).toLocaleDateString("de-DE");
  return {
    ...post,
    slug: titleAsSlug,
    timestamp,
  };
});

app.get("/posts/:slug", (req: Request, res: Response) => {
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
});

app.get("/contact", (req: Request, res: Response) => {
  res.render("contact.njk", {
    title: "Kontakt",
    image: "/images/contact-bg.jpg",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.render("about.njk", {
    title: "About",
    subtitle: "Etwas über uns.",
    image: "/images/about-bg.jpg",
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
