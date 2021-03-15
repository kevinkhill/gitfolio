import { Endpoints } from "@octokit/types";
export interface GitFolioConfig {
    apiKey: string;
    username: string;
}
export interface GitFolioCache {
    [K: string]: FullProjectDetails;
}
export interface GitFolioCacheFile {
    repos: string[];
    projects: GitFolioFile[];
}
export interface GitFolioFile {
    repo: string;
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
}
export interface RepoNameUrl {
    name: string;
    url: string;
}
declare type RepoEndpoint = Endpoints["GET /repos/{owner}/{repo}"];
export declare type listUserReposParameters = RepoEndpoint["parameters"];
export declare type listUserReposResponse = RepoEndpoint["response"];
export declare type UserRepoList = Array<listUserReposResponse["data"]>;
export {};
