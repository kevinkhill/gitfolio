import { Endpoints } from "@octokit/types";

export interface GitFolioConfig {
  apiKey: string;
  username: string;
}

export interface GitFolioCache {
  [K: string]: FullProjectDetails;
}

export interface GitFolioFile {
  icon?: string;
  name?: string;
  description?: string;
  url?: string;
}

export interface ProjectDetails {
  icon: string;
  name: string;
  description: string;
}

export interface FullProjectDetails extends ProjectDetails {
  url: string;
};

export interface RepoNameUrl {
  name: string;
  url: string;
}

type RepoEndpoint = Endpoints["GET /repos/{owner}/{repo}"];

export type listUserReposParameters = RepoEndpoint["parameters"];
export type listUserReposResponse = RepoEndpoint["response"];
export type UserRepoList = Array<listUserReposResponse["data"]>;
