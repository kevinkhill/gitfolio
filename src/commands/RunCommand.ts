import { Command, Option } from 'clipanion';

import { GitFolio } from "../GitFolio";
import { FullProjectDetails, GitFolioCache } from '../types';
import { cacheFilename, readCacheFile, writeCacheFile } from '../Cache';

require("dotenv").config();

export class RunCommand extends Command {
  // name = Option.String();

  static paths = [[`run`], Command.Default];

  private _cache!: GitFolioCache;

  get projects() { return Object.values(this._cache); }

  async execute() {
    const myGitFolio = new GitFolio({
      apiKey: process.env.GITHUB_API_KEY ?? "",
      username: process.env.GITHUB_USERNAME ?? "",
    });

    const cache = await readCacheFile();

    if (cache.ok) {
      console.log(`Cache found`);

      this._cache = cache.data;

      const projects = {
        name: "Projects",
        source: this.projects.filter(project => project?.name)
      };

      console.log(projects);
    } else {
      console.log(`Reading Repos`);

      const repos = await myGitFolio.listUserRepos();

      if (repos.data) {
        console.log(
          `User ${myGitFolio.username} has ${repos.data.length} repositories.`
        );

        const repoList: Record<string, FullProjectDetails> = {};

        for (const repo of repos.data) {
          console.log(`Checking ${repo.name} for .gitfolio.yml`);

          const info = await myGitFolio.getInfoFromRepo(repo.name);

          repoList[repo.name] = {} as FullProjectDetails;

          if (!info.error) {
            repoList[repo.name] = { ...info.data, url: repo.url };
          }
        }

        console.log(
          `\nWriting ${cacheFilename} to disk.\nThis will speed up the next run.`
        );

        await writeCacheFile(repoList);

        console.log(
          `Done. Deleting this file will trigger a rescan of the repositories.`
        );
      }
    }
  }

}