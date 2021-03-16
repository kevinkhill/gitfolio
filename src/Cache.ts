import path from "path";
import fs from "fs";

import { GitRegatorCacheFile } from "./types";

export const CACHE_FILENAME = ".gitregator.cache.json";
export const CACHE_ABSPATH = path.join(process.cwd(), CACHE_FILENAME);

export async function readCacheFile(): Promise<GitRegatorCacheFile> {
  const contents = await fs.promises.readFile(CACHE_ABSPATH, "utf8");

  return JSON.parse(contents) as GitRegatorCacheFile;
}

export async function writeCacheFile(cache: GitRegatorCacheFile): Promise<void> {
  const cacheContents = JSON.stringify(cache, null, 2);

  return fs.promises.writeFile(CACHE_ABSPATH, cacheContents);
}
