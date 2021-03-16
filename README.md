# GitRegator

GitRegator is a simple utility to _ag-git-regate_ information from your projects on github.

## Install

`npm i gitregator`

## Usage

Drop a `.gitregator.yml` in the root of any project you want to get picked up.

Load some information in it

```yaml
icon: "fa fa-github"
name: "GitRegator"
description: "CLI tool for aggregating information from github projects."
```

Then gitregate it all!
```javascript
const GitRegator = require("./gitregator");

const client = new GitRegator({
  username: <GITHUB_USERNAME>,
  apiKey: <GITHUB_API_KEY>
});

(async () => {
  const info = await client.getInfoFromRepo("<REPO_NAME>");

  console.log(info); // { "icon": "fa fa-github", "name": "GitRegator", "description": "CLI tool ..."
})();
```