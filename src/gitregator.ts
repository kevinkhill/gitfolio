import yaml from "js-yaml";
import { Octokit } from "@octokit/rest";
import { GitRegatorConfig, GitRegatorFile } from "./types";

export default class GitRegator {
  static GITREGATOR_FILENAME = ".gitregator.yml";

  static API_ENDPOINT = "GET /repos/{username}/{repo}/contents/";

  username: string;

  private _github: Octokit;

  constructor(config: GitRegatorConfig) {
    this.username = config.username;
    this._github = new Octokit({
      auth: config.apiKey,
      userAgent: "GitRegator v1",
    });
  }

  async getUserRepos(): Promise<Record<string, unknown>[]> {
    return this._github.paginate(this._github.repos.listForUser, {
      username: this.username
    }) ?? [];
  }

  async getUserRepoTitles(): Promise<string[]> {
    const repos = await this.getUserRepos();

    return repos.map(r => r.name) as string[];
  }

  async getInfoFromRepo(repo: string): Promise<GitRegatorFile> {
    try {
      const url = GitRegator.API_ENDPOINT + "/" + GitRegator.GITREGATOR_FILENAME;

      const fileInfo = await this._github.request(url, {
        repo,
        username: this.username,
      });

      const buffer = Buffer.from(fileInfo.data.content, "base64");
      const parsed = yaml.load(buffer.toString()) as GitRegatorFile;

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
