import type { Request, Response } from "express";

export const postsListing = (req: Request, res: Response) => {
  res.render("admin/indexPage.njk", {});
};
