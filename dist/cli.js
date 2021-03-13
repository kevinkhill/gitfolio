#!/bin/env node
"use strict";
exports.__esModule = true;
var clipanion_1 = require("clipanion");
var package_json_1 = require("../package.json");
var RunCommand_1 = require("./commands/RunCommand");
var _a = process.argv, node = _a[0], app = _a[1], args = _a.slice(2);
var cli = new clipanion_1.Cli({
    binaryLabel: "gitfolio",
    binaryName: node + " " + app,
    binaryVersion: package_json_1.version
});
if (!process.env.GITHUB_API_KEY) {
    console.error("Environment variable \"GITHUB_API_KEY\" not found.");
}
cli.register(RunCommand_1.RunCommand);
cli.register(clipanion_1.Builtins.HelpCommand);
cli.register(clipanion_1.Builtins.VersionCommand);
cli.runExit(args, clipanion_1.Cli.defaultContext);
