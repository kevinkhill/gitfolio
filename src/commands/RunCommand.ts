import { Command, Option } from 'clipanion';

import async from 'async';


import { GitFolio } from "../GitFolio";
import { FullProjectDetails, GitFolioCache, RepoNameUrl } from '../types';
import { cacheFilename, readCacheFile, writeCacheFile } from '../Cache';
import { GitFolioFile } from './../types';

require("dotenv").config();

export class RunCommand extends Command {
  refresh = Option.Boolean("--refresh", {
    "description": "Refresh cache file by rescanning all user repos"
  });

  listRepos = Option.Boolean("--list-repos", {
    "description": "List all the repositories for the user."
  });

  username = Option.String("-u,--username", { "required": true });

  gitfolio!: GitFolio;

  static paths = [[`run`], Command.Default];

  async execute() {
    this.gitfolio = new GitFolio({
      username: this.username,
      apiKey: process.env.GITHUB_API_KEY ?? "",
    });


    // if (!this.refresh) {
    //   console.log(this.refresh);
    //   const cache = await readCacheFile();
    // }


    // if (cache.ok) {
    //   console.log(`Cache found`);

    // const projects = {
    //   name: "Projects",
    //   source: this.getProjectDetails(cache.data)
    // };

    // console.log(projects);
    // } else {
    // }
    const repos = await this.gitfolio.getUserRepoTitles();

    if (this.listRepos) {
      console.log(
        `User ${this.gitfolio.username} has ${repos.length} repositories.`
      );
      console.dir(repos);
      return;
    }

    const projects = await this.scanRepos(repos);

    console.log(
      `\nWriting ${cacheFilename} to disk.\nThis will speed up the next run.`
    );

    await writeCacheFile(projects);

    console.log(
      `Done. Deleting this file will trigger a rescan of the repositories.`
    );

    console.dir(projects);
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