import yaml from "js-yaml";
import { Octokit } from "@octokit/rest";
import { FullProjectDetails, GitFolioConfig, ProjectDetails } from "./types";

type PartialProjectDetials = Omit<FullProjectDetails, "url">;

type ApiCall = {
  ok: boolean; data: PartialProjectDetials | Error;
} & {
  ok: true; data: PartialProjectDetials;
} | {
  ok: false; data: Error;
};

export class GitFolio {
  static API_ENDPOINT = "GET /repos/{username}/{repo}/contents/.gitfolio.yml";

  username: string;

  private _github: Octokit;

  constructor(config: GitFolioConfig) {
    this.username = config.username;

    this._github = new Octokit({
      auth: config.apiKey,
      userAgent: `GitFolio Crawler v1`,
    });
  }

  async listUserRepos() {
    return this._github.repos.listForUser({ username: this.username });
  }

  async getInfoFromRepo(repo: string): Promise<ApiCall> {
    try {
      const fileInfo = await this._github.request(GitFolio.API_ENDPOINT, {
        repo,
        username: this.username,
      });

      const buffer = Buffer.from(fileInfo.data.content, "base64");
      const parsed = yaml.load(buffer.toString());

      return {
        ok: true,
        data: parsed as PartialProjectDetials
      };
    } catch (err) {
      return {
        ok: false,
        data: err
      };
    }
  }
}