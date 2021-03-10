import { Command, Option } from 'clipanion';

import async from 'async';
import { map } from 'lodash/fp';


import { GitFolio } from "../GitFolio";
import { FullProjectDetails, GitFolioCache, GitFolioCacheFile, RepoNameUrl } from '../types';
import { cacheFilename, cacheFilepath, readCacheFile, writeCacheFile } from '../Cache';
import { GitFolioFile } from './../types';

require("dotenv").config();

export class RunCommand extends Command {
  refresh = Option.Boolean("-r,--refresh", {
    "description": "Refresh cache file by rescanning all user repos"
  });

  listRepos = Option.Boolean("-l,--list-repos", {
    "description": "List all the repositories for the user."
  });

  json = Option.Boolean("-j,--json", {
    "description": "List all project information as JSON to stdout."
  });

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

      if (this.json) {
        this.context.stdout.write(JSON.stringify(projects));
      }

      // console.dir(`Wrote ${cacheFilepath}`);
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