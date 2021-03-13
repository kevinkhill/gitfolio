"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RunCommand = void 0;
var async_1 = require("async");
var fs_1 = require("fs");
var clipanion_1 = require("clipanion");
var GitFolio_1 = require("../GitFolio");
var Cache_1 = require("../Cache");
require("dotenv").config();
var RunCommand = /** @class */ (function (_super) {
    __extends(RunCommand, _super);
    function RunCommand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.refresh = clipanion_1.Option.Boolean("-r,--refresh", {
            "description": "Refresh cache file by rescanning all user repos"
        });
        _this.listRepos = clipanion_1.Option.Boolean("-l,--list-repos", {
            "description": "List all the repositories for the user."
        });
        _this.quiet = clipanion_1.Option.Boolean("-q,--quiet", {
            "description": "Silence all output."
        });
        _this.outfile = clipanion_1.Option.String("-o,--outfile");
        _this.username = clipanion_1.Option.String("-u,--username", { "required": true });
        return _this;
    }
    RunCommand.prototype.execute = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var repos, projects, cacheFile, json;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.gitfolio = new GitFolio_1.GitFolio({
                            username: this.username,
                            apiKey: (_a = process.env.GITHUB_API_KEY) !== null && _a !== void 0 ? _a : ""
                        });
                        return [4 /*yield*/, this.getRepoList()];
                    case 1:
                        repos = _b.sent();
                        if (!(repos.length > 0)) return [3 /*break*/, 4];
                        // console.log(`User ${this.gitfolio.username} has ${repos.length} repositories.`);
                        if (this.listRepos) {
                            return [2 /*return*/, console.dir(repos)];
                        }
                        return [4 /*yield*/, this.scanRepos(repos)];
                    case 2:
                        projects = _b.sent();
                        cacheFile = {
                            repos: repos,
                            projects: projects
                        };
                        return [4 /*yield*/, Cache_1.writeCacheFile(cacheFile)];
                    case 3:
                        _b.sent();
                        json = JSON.stringify(projects, null, 2);
                        if (this.outfile) {
                            fs_1["default"].promises.writeFile(this.outfile, json);
                        }
                        else {
                            console.log(json);
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @fixme This is so dumb!!
     */
    RunCommand.prototype.getRepoList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cache, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Cache_1.readCacheFile()];
                    case 1:
                        cache = _a.sent();
                        return [2 /*return*/, cache.repos];
                    case 2:
                        err_1 = _a.sent();
                        //console.error(err);
                        try {
                            return [2 /*return*/, this.gitfolio.getUserRepoTitles()];
                        }
                        catch (err) {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Scan the given repository list for `.gitfolio.yml` files
     */
    RunCommand.prototype.scanRepos = function (repoList) {
        return __awaiter(this, void 0, void 0, function () {
            var projects;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, async_1["default"].map(repoList, function (repo, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = cb;
                                        _b = [null];
                                        return [4 /*yield*/, this.gitfolio.getInfoFromRepo(repo)];
                                    case 1:
                                        _a.apply(void 0, _b.concat([_c.sent()]));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        projects = _a.sent();
                        return [2 /*return*/, projects.filter(function (o) { return o.name; })];
                }
            });
        });
    };
    RunCommand.paths = [["run"], clipanion_1.Command.Default];
    return RunCommand;
}(clipanion_1.Command));
exports.RunCommand = RunCommand;
