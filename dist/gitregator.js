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
const js_yaml_1 = __importDefault(require("js-yaml"));
const rest_1 = require("@octokit/rest");
class GitRegator {
    constructor(config) {
        this.username = config.username;
        this._github = new rest_1.Octokit({
            auth: config.apiKey,
            userAgent: "GitRegator v1",
        });
    }
    getUserRepos() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this._github.paginate(this._github.repos.listForUser, {
                username: this.username
            })) !== null && _a !== void 0 ? _a : [];
        });
    }
    getUserRepoTitles() {
        return __awaiter(this, void 0, void 0, function* () {
            const repos = yield this.getUserRepos();
            return repos.map(r => r.name);
        });
    }
    getInfoFromRepo(repo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileInfo = yield this._github.request(GitRegator.API_ENDPOINT, {
                    repo,
                    username: this.username,
                });
                const buffer = Buffer.from(fileInfo.data.content, "base64");
                const parsed = js_yaml_1.default.load(buffer.toString());
                return Object.assign(Object.assign({}, parsed), { repo, url: `https://github.com/${this.username}/${repo}` });
            }
            catch (err) {
                return { repo };
            }
        });
    }
}
exports.default = GitRegator;
GitRegator.API_ENDPOINT = "GET /repos/{username}/{repo}/contents/.gitRegator.yml";
