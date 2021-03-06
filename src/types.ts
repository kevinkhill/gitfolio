export interface GitFolioConfig {
  apiKey: string;
  username: string;
}

export interface GitFolioCache {
  [K: string]: FullProjectDetails;
}

export interface ProjectDetails {
  icon: string;
  name: string;
  description: string;
}

export interface FullProjectDetails extends ProjectDetails {
  url: string;
};
