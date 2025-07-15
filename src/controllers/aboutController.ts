import type { Request, Response } from "express";

export const aboutController = (req: Request, res: Response) => {
  res.render("../templates/about.njk", {
    title: "About",
    subtitle: "Etwas über uns.",
    image: "/images/about-bg.jpg",
  });
};
