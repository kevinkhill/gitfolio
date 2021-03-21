# GitRegator

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-downloads-url]
[![MIT License][license-image]][license-url]

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

Create your client
```javascript
const GitRegator = require("./gitregator");

const client = new GitRegator({
  username: <GITHUB_USERNAME>,
  apiKey: <GITHUB_API_KEY>
});
```

Then fetch one, or, fetch them all!
```javascript
(async () => {
  const info = await client.getInfoFromRepo("<REPO_NAME>");

  console.log(info); // { "icon": "fa fa-github", "name": "GitRegator", "description": "CLI tool ..."
})();
```

Or fetch them all!
```javascript
(async () => {
  const repos = await client.getUserRepoTitles();

  if (repos.length > 0) {
    for (const repo in repos) {
      const info = await client.getInfoFromRepo(repo);
      console.log(info);
    }
  }
})();
```

## Resources

- [Changelog](CHANGELOG.md)

## License

GitRegator is freely distributable under the terms of the [MIT license][license-url].

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/gitregator
[npm-version-image]: https://img.shields.io/npm/v/gitregator.svg?style=flat

[npm-downloads-image]: https://img.shields.io/npm/dm/gitregator.svg?style=flat
[npm-downloads-url]: https://npmcharts.com/compare/gitregator?minimal=true