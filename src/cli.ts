import { Builtins, Cli } from 'clipanion';

import { RunCommand } from './commands/RunCommand';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `GitFolio`,
  binaryName: `${node} ${app}`,
  binaryVersion: `1.0.0`,
})

cli.register(RunCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);
cli.runExit(args, Cli.defaultContext);
