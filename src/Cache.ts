import path from "path";
import fs from "fs";

import { FullProjectDetails, GitFolioCache } from './types';

export const cacheFilename = ".gitfolio_cache";
export const cacheFilepath = path.join(process.cwd(), cacheFilename);

type CacheReadAttempt = {
  ok: boolean; data: GitFolioCache | Error;
} & {
  ok: true; data: GitFolioCache;
} | {
  ok: false; data: Error;
};

export async function readCacheFile(): Promise<CacheReadAttempt> {
  try {
    const contents = await fs.promises.readFile(cacheFilepath, "utf8");

    return {
      ok: true,
      data: JSON.parse(contents) as GitFolioCache
    };
  } catch (err) {
    return {
      ok: false,
      data: err
    };
  }
}

export async function writeCacheFile(data: Record<string, FullProjectDetails>): Promise<void> {
  const cacheContents = JSON.stringify(data, null, 2);

  return fs.promises.writeFile(cacheFilepath, cacheContents);
}