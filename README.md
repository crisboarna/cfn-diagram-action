<div align="center">
<h1>cfn-diagram-action</h1>
<h2>
  <a href="https://github.com/crisboarna/cfn-diagram-action/actions/workflows/merge_main.yaml">
    <img src="https://github.com/crisboarna/cfn-diagram-action/workflows/CI/CD/badge.svg">
  </a>
  <a href="https://snyk.io/test/github/crisboarna/cfn-diagram-action">
    <img src="https://snyk.io/test/github/crisboarna/cfn-diagram-action/badge.svg?targetFile=package.json">
  </a>
  <a href="https://codecov.io/gh/crisboarna/cfn-diagram-action">
    <img src="https://img.shields.io/codecov/c/github/crisboarna/cfn-diagram-action.svg">
  </a>
  <a href="https://github.com/crisboarna/cfn-diagram-action">
    <img src="https://img.shields.io/github/stars/crisboarna/cfn-diagram-action.svg">
  </a>
  <a href="https://github.com/crisboarna/cfn-diagram-action/issues">
    <img src="https://img.shields.io/github/issues/crisboarna/cfn-diagram-action.svg">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/github/license/crisboarna/cfn-diagram-action">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)">
  </a>
  <a href="https://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
  </a>
    <img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" >
  <a href="https://github.com/crisboarna">
    <img src="https://img.shields.io/badge/made%20by-crisboarna-blue.svg" >
  </a>
  <a href="https://github.com/crisboarna/cfn-diagram-action/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">
  </a>
</h2>
</div>

# Description

This action uses [cfn-diagram](https://github.com/mhlabs/cfn-diagram) to generate [draw.io](https://draw.io) diagrams or [vis.js](https://visjs.org) generated images of your AWS Cloudformation IaC code.

Ideal for maintaining live documentation where the CI auto-updates the infrastructure diagrams for your docs.

## Table of Contents
* [Inputs](#inputs)
* [Outputs](#outputs)
* [Example](#example)
* [Development](#development)
  * [Installation](#installation)
  * [Linting](#linting)
  * [Testing](#testing)
  * [Building](#building)
* [How to Contribute](#how-to-contribute)
  * [Bots used](#bots-used)
* [License](#license)

## Inputs

## `path_input`

**Required** 

Path where the Cloudformation templates can be found

## `path_output`

**Optional**
Default: `diagrams/`

Path where the output diagrams should be placed

## `diagram_type`

**Optional**
Default: `html`

What type of diagram export should be executed

## `diagram_exclude_types`

**Optional** 
Default : ``

Cloudformation types to be excluded from cfn-diagram output

## `diagram_stacks`

**Optional** 

Cloudformation stacks to be included in export, defaults to all

## `viewport_height`

**Optional** 
Default: `1080`

Browser viewport height configuration

## `viewport_width`
Default: `1920`

Browser viewport width configuration. Only valid for html|h diagramType

## Outputs
The specified diagrams on the filesystem. Only valid for html|h diagramType

## Example

```yaml
uses: crisboarna/cfn-diagram-action@v1
with:
  path_input: '/test/data'
  path_output: '/docs/diagrams'
  diagram_type: 'draw.io'
  diagram_exclude_types: ''
  diagram_stacks: ''
  viewport_height: 1080
  viewport_width: 1920
```

# Development
## Installation
To setup for local development you need the following:
```shell
yarn install
yarn setup
```

This installs the npm dependencies and the [act](https://github.com/nektos/act) cli tool for local GitHub action testing.

## Linting
```shell
yarn lint
```
## Testing
To run unit tests:
```shell
yarn test
```

To run integration tests locally via Docker Compose use 
```shell
docker compose up
```
the output files will be visible in 
To run integration tests in mock Github Action environment(via Docker)
```shell
yarn test:integration:local
```

To run the underlying integration command locally without the wrapper environment for direct fast debugging
```shell
yarn test:integration
```
## Building

# How to Contribute

1. Clone repo and create a new branch:
```shell
git checkout https://github.com/crisboarna/cfn-diagram-action -b name_for_new_branch`.
````
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes

## Bots used
To facilitate development the following bots are integrated into the repository:
1. [Request Info](https://github.com/behaviorbot/request-info)
2. [Semantic Pull Requests](https://github.com/apps/semantic-pull-requests)
2. [Welcome](https://github.com/apps/welcome)
3. [Snyk](https://github.com/marketplace/snyk)
4. [Todo](https://github.com/apps/todo)

# License
[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

Full license details can be found in [LICENSE.md](./LICENSE.md)
