#!/bin/env node
"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __assign = Object.assign;
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (result) => {
      return result.done ? resolve(result.value) : Promise.resolve(result.value).then(fulfilled, rejected);
    };
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/cli.ts
var _clipanion = require('clipanion');

// package.json
var version = "0.1.0";

// src/commands/RunCommand.ts
var _async = require('async'); var _async2 = _interopRequireDefault(_async);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);


// src/GitFolio.ts
var _jsyaml = require('js-yaml'); var _jsyaml2 = _interopRequireDefault(_jsyaml);
var _rest = require('@octokit/rest');
var _GitFolio = class {
  constructor(config) {
    this.username = config.username;
    this._github = new (0, _rest.Octokit)({
      auth: config.apiKey,
      userAgent: `GitFolio v1`
    });
  }
  getUserRepos() {
    return __async(this, null, function* () {
      return this._github.paginate(this._github.repos.listForUser, {
        username: this.username
      });
    });
  }
  getUserRepoTitles() {
    return __async(this, null, function* () {
      return (yield this.getUserRepos()).map((r) => r.name);
    });
  }
  getInfoFromRepo(repo) {
    return __async(this, null, function* () {
      try {
        const fileInfo = yield this._github.request(_GitFolio.API_ENDPOINT, {
          repo,
          username: this.username
        });
        const buffer = Buffer.from(fileInfo.data.content, "base64");
        const parsed = _jsyaml2.default.load(buffer.toString());
        return __assign(__assign({}, parsed), {
          repo,
          url: `https://github.com/${this.username}/${repo}`
        });
      } catch (err) {
        return {repo};
      }
    });
  }
};
var GitFolio = _GitFolio;
GitFolio.API_ENDPOINT = "GET /repos/{username}/{repo}/contents/.gitfolio.yml";

// src/Cache.ts
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

var cacheFilename = ".gitfolio_cache";
var cacheFilepath = _path2.default.join(process.cwd(), cacheFilename);
function readCacheFile() {
  return __async(this, null, function* () {
    const contents = yield _fs2.default.promises.readFile(cacheFilepath, "utf8");
    return JSON.parse(contents);
  });
}
function writeCacheFile(cache) {
  return __async(this, null, function* () {
    const cacheContents = JSON.stringify(cache, null, 2);
    return _fs2.default.promises.writeFile(cacheFilepath, cacheContents);
  });
}

// src/commands/RunCommand.ts
require("dotenv").config();
var RunCommand = class extends _clipanion.Command {
  constructor() {
    super(...arguments);
    this.refresh = _clipanion.Option.Boolean("-r,--refresh", {
      description: "Refresh cache file by rescanning all user repos"
    });
    this.listRepos = _clipanion.Option.Boolean("-l,--list-repos", {
      description: "List all the repositories for the user."
    });
    this.quiet = _clipanion.Option.Boolean("-q,--quiet", {
      description: "Silence all output."
    });
    this.outfile = _clipanion.Option.String("-o,--outfile");
    this.username = _clipanion.Option.String("-u,--username", {required: true});
  }
  execute() {
    return __async(this, null, function* () {
      var _a;
      this.gitfolio = new GitFolio({
        username: this.username,
        apiKey: (_a = process.env.GITHUB_API_KEY) != null ? _a : ""
      });
      const repos = yield this.getRepoList();
      if (repos.length > 0) {
        if (this.listRepos) {
          return console.dir(repos);
        }
        const projects = yield this.scanRepos(repos);
        const cacheFile = {
          repos,
          projects
        };
        yield writeCacheFile(cacheFile);
        const json = JSON.stringify(projects, null, 2);
        if (this.outfile) {
          _fs2.default.promises.writeFile(this.outfile, json);
        } else {
          console.log(json);
        }
      }
    });
  }
  getRepoList() {
    return __async(this, null, function* () {
      try {
        const cache = yield readCacheFile();
        return cache.repos;
      } catch (err) {
        try {
          return this.gitfolio.getUserRepoTitles();
        } catch (err2) {
          return [];
        }
      }
    });
  }
  scanRepos(repoList) {
    return __async(this, null, function* () {
      const projects = yield _async2.default.map(repoList, (repo, cb) => __async(this, null, function* () {
        cb(null, yield this.gitfolio.getInfoFromRepo(repo));
      }));
      return projects.filter((o) => o.name);
    });
  }
};
RunCommand.paths = [[`run`], _clipanion.Command.Default];

// src/cli.ts
var [node, app, ...args] = process.argv;
var cli = new (0, _clipanion.Cli)({
  binaryLabel: `gitfolio`,
  binaryName: `${node} ${app}`,
  binaryVersion: version
});
if (!process.env.GITHUB_API_KEY) {
  console.error(`Environment variable "GITHUB_API_KEY" not found.`);
}
cli.register(RunCommand);
cli.register(_clipanion.Builtins.HelpCommand);
cli.register(_clipanion.Builtins.VersionCommand);
cli.runExit(args, _clipanion.Cli.defaultContext);
