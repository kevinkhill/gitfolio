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

## Resources

- [Documentation](https://gitregatorjs.com/docs/)
- [Changelog](CHANGELOG.md)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/gitregatorjs)

## License

GitRegator is freely distributable under the terms of the [MIT license][license-url].

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/gitregator
[npm-version-image]: https://img.shields.io/npm/v/gitregator.svg?style=flat

[npm-downloads-image]: https://img.shields.io/npm/dm/gitregator.svg?style=flat
[npm-downloads-url]: https://npmcharts.com/compare/gitregator?minimal=true