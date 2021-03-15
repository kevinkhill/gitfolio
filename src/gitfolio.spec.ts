import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

import { GitFolio } from './gitfolio';
import { GitFolioFile } from './types';

const getClient = () => new GitFolio({
  username: "kevinkhill",
  apiKey: process.env.GITHUB_API_KEY ?? ""
});

const getLocalGitfolioFile = (): GitFolioFile => {
  const file = path.join(__dirname, "..", ".gitfolio.yml");
  return yaml.load(fs.readFileSync(file, 'utf8')) as GitFolioFile;
}

test("process.env.GITHUB_API_KEY", async () => {
  expect(process.env.GITHUB_API_KEY).toBeDefined();
});

test("gitfolio.getInfoFromRepo()", async () => {
  const local = getLocalGitfolioFile();
  const remote = await getClient().getInfoFromRepo("gitfolio");

  expect(remote).toMatchObject(local);
});

test("gitfolio.getUserRepoTitles()", async () => {
  const titles = await getClient().getUserRepoTitles();

  expect(titles.length).toBeGreaterThan(0);
});
