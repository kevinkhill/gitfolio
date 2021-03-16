import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { CACHE_FILENAME } from "./cache";

import GitRegator from "./gitregator";
import { GitRegatorFile } from "./types";

const getClient = () => new GitRegator({
  username: "kevinkhill",
  apiKey: process.env.GITHUB_API_KEY ?? ""
});

const getLocalGitregatorFile = (): GitRegatorFile => {
  const file = path.join(__dirname, "..", GitRegator.GITREGATOR_FILENAME);
  return yaml.load(fs.readFileSync(file, "utf8")) as GitRegatorFile;
};

test("process.env.GITHUB_API_KEY", async () => {
  expect(process.env.GITHUB_API_KEY).toBeDefined();
});

test("gitregator.getInfoFromRepo()", async () => {
  const local = getLocalGitregatorFile();
  const remote = await getClient().getInfoFromRepo("gitregator");

  expect(remote).toMatchObject(local);
});

test("gitregator.getUserRepoTitles()", async () => {
  const titles = await getClient().getUserRepoTitles();

  expect(titles.length).toBeGreaterThan(0);
});
