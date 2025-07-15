import { Request, Response, NextFunction } from "express";
import * as fs from "node:fs/promises";
import { access, appendFile, writeFile, constants } from "node:fs/promises";
import * as path from "node:path";

const LOG_DIR = path.join(__dirname, "..", "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "logs.txt");

async function addLogMessage(message: string): Promise<void> {
  try {
    if (message.length > 20) {
      await appendFile(LOG_FILE, message + "\n");
    } else {
      throw Error("message is as expeced. Please check format: " + message);
    }
  } catch (error) {}
}

async function fileExists(): Promise<boolean> {
  try {
    await access(LOG_FILE, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

fileExists()
  .then(async (fileExists: boolean) => {
    if (!fileExists) {
      await createLogFile();
    }
  })
  .catch((error) => {
    console.error(error);
  });

async function createLogFile(): Promise<void> {
  try {
    await writeFile(LOG_FILE, "", { encoding: "utf-8" });
  } catch (error) {
    console.error(error);
  }
}

// iife immediate invoked function expression
(async () => {
  try {
    await access(LOG_FILE, constants.F_OK);
    await writeFile(LOG_FILE, "", { encoding: "utf-8" });
  } catch (error) {
    console.error(error);
  }
})();

export async function logger(req: Request, res: Response, next: NextFunction) {
  const { ip, method, originalUrl: url } = req;

  /** dateTime */
  const dateTime = new Date().toISOString();

  // Nur HTML-Requests loggen, statische Dateien ignorieren
  if (
    !req.url.includes(".css") &&
    !req.url.includes(".js") &&
    !req.url.includes("/images/")
  ) {
    // console.log(`${dateTime} ${method} ${ip} ${url}`);W
    // console.log([dateTime, method, ip, url].join(" "));
  }

  await addLogMessage([dateTime, method, ip, url].join(" "));
  next();
}
