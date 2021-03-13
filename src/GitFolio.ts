import yaml from "js-yaml";
import { Octokit } from "@octokit/rest";
import { GitFolioConfig, GitFolioFile } from "./types";

export class GitFolio {
  static API_ENDPOINT = "GET /repos/{username}/{repo}/contents/.gitfolio.yml";

  username: string;

  private _github: Octokit;

  constructor(config: GitFolioConfig) {
    this.username = config.username;

    this._github = new Octokit({
      auth: config.apiKey,
      userAgent: `GitFolio v1`,
    });
  }

  async getUserRepos(): Promise<unknown> {
    return this._github.paginate(this._github.repos.listForUser, {
      username: this.username
    });
  }

  async getUserRepoTitles(): Promise<string[]> {
    return (await this.getUserRepos()).map(r => r.name);
  }

  async getInfoFromRepo(repo: string): Promise<GitFolioFile> {
    try {
      const fileInfo = await this._github.request(GitFolio.API_ENDPOINT, {
        repo,
        username: this.username,
      });

      const buffer = Buffer.from(fileInfo.data.content, "base64");
      const parsed = yaml.load(buffer.toString()) as GitFolioFile;

      return {
        ...parsed,
        repo,
        url: `https://github.com/${this.username}/${repo}`
      };
    } catch (err) {
      return { repo };
    }
  }
}
