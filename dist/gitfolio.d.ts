import { GitFolioConfig, GitFolioFile } from "./types";
export declare class GitFolio {
    static API_ENDPOINT: string;
    username: string;
    private _github;
    constructor(config: GitFolioConfig);
    getUserRepos(): Promise<unknown>;
    getUserRepoTitles(): Promise<string[]>;
    getInfoFromRepo(repo: string): Promise<GitFolioFile>;
}
