import path from "path";
import fs from "fs";

import { GitFolioCacheFile } from './types';

export const cacheFilename = ".gitfolio_cache";
export const cacheFilepath = path.join(process.cwd(), cacheFilename);

export async function readCacheFile(): Promise<GitFolioCacheFile> {
  const contents = await fs.promises.readFile(cacheFilepath, "utf8");

  return JSON.parse(contents) as GitFolioCacheFile;
}

export async function writeCacheFile(cache: GitFolioCacheFile): Promise<void> {
  const cacheContents = JSON.stringify(cache, null, 2);

  return fs.promises.writeFile(cacheFilepath, cacheContents);
}