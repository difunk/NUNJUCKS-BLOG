import type { Request, Response } from "express";

export const contactController = (req: Request, res: Response) => {
  res.render("_layout/contact.njk", {
    title: "Kontakt",
    image: "/images/contact-bg.jpg",
  });
};
