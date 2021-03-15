"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCacheFile = exports.readCacheFile = exports.cacheFilepath = exports.cacheFilename = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.cacheFilename = ".gitfolio_cache";
exports.cacheFilepath = path_1.default.join(process.cwd(), exports.cacheFilename);
function readCacheFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const contents = yield fs_1.default.promises.readFile(exports.cacheFilepath, "utf8");
        return JSON.parse(contents);
    });
}
exports.readCacheFile = readCacheFile;
function writeCacheFile(cache) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheContents = JSON.stringify(cache, null, 2);
        return fs_1.default.promises.writeFile(exports.cacheFilepath, cacheContents);
    });
}
exports.writeCacheFile = writeCacheFile;
