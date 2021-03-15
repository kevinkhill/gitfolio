import { GitFolioCacheFile } from './types';
export declare const cacheFilename = ".gitfolio_cache";
export declare const cacheFilepath: string;
export declare function readCacheFile(): Promise<GitFolioCacheFile>;
export declare function writeCacheFile(cache: GitFolioCacheFile): Promise<void>;
