# GitRegator

GitRegator is a simple utility to _ag-git-regate_ information from your projects on github.

## Install

`npm i gitregator`

## Usage

Drop a `.gitregator.yml` in the root of any project you want to get picked up.

Load some information in it

```
icon: "fa fa-github"
name: "GitRegator"
description: "CLI tool for aggregating information from github projects."
```

`GITHUB_API_KEY=abc123 gitregator --username <USERNAME>`
