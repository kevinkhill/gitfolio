import { Builtins, Cli } from 'clipanion';

import { version } from "../package.json";

import { RunCommand } from './commands/RunCommand';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `gitfolio`,
  binaryName: `${node} ${app}`,
  binaryVersion: version,
})

if (!process.env.GITHUB_API_KEY) {
  console.error(`Environment variable "GITHUB_API_KEY" not found.`);
}

cli.register(RunCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);

cli.runExit(args, Cli.defaultContext);
