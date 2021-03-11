import async from 'async';

import fs from 'fs';

import { Command, Option } from 'clipanion';

import { GitFolio } from "../GitFolio";
import { GitFolioCacheFile, GitFolioFile } from '../types';
import { readCacheFile, writeCacheFile } from '../Cache';

require("dotenv").config();

export class RunCommand extends Command {
  refresh = Option.Boolean("-r,--refresh", {
    "description": "Refresh cache file by rescanning all user repos"
  });

  listRepos = Option.Boolean("-l,--list-repos", {
    "description": "List all the repositories for the user."
  });

  quiet = Option.Boolean("-q,--quiet", {
    "description": "Silence all output."
  });

  outfile = Option.String("-o,--outfile");
  username = Option.String("-u,--username", { "required": true });

  gitfolio!: GitFolio;

  static paths = [[`run`], Command.Default];

  async execute() {
    this.gitfolio = new GitFolio({
      username: this.username,
      apiKey: process.env.GITHUB_API_KEY ?? "",
    });

    const repos = await this.getRepoList();

    if (repos.length > 0) {
      // console.log(`User ${this.gitfolio.username} has ${repos.length} repositories.`);

      if (this.listRepos) {
        return console.dir(repos);
      }

      const projects = await this.scanRepos(repos);

      const cacheFile: GitFolioCacheFile = {
        repos,
        projects
      }

      await writeCacheFile(cacheFile);

      const json = JSON.stringify(projects, null, 2);

      if (this.outfile) {
        fs.promises.writeFile(this.outfile, json);
      } else {
        console.log(json);
      }
    }
  }

  /**
   * @fixme This is so dumb!!
   */
  private async getRepoList(): Promise<string[]> {
    // if (!this.refresh) {
    //   console.log(this.refresh);
    // }

    try {
      const cache = await readCacheFile();

      return cache.repos;
    } catch (err) {
      //console.error(err);
      try {
        return this.gitfolio.getUserRepoTitles();
      } catch (err) {
        return [];
      }
    }
  }

  /** 
   * Scan the given repository list for `.gitfolio.yml` files
   */
  private async scanRepos(repoList: string[]): Promise<GitFolioFile[]> {
    const projects: GitFolioFile[] = await async.map(repoList, async (repo, cb) => {
      cb(null, await this.gitfolio.getInfoFromRepo(repo));
    });

    return projects.filter(o => o.name);
  }
}