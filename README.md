# Quadball scorekeeper web app

[![Build](https://github.com/QuadballScorekeeper/quadball-scorekeeper/actions/workflows/build.yml/badge.svg)](https://github.com/QuadballScorekeeper/quadball-scorekeeper/actions/workflows/build.yml)
[![Test](https://github.com/QuadballScorekeeper/quadball-scorekeeper/actions/workflows/test.yml/badge.svg)](https://github.com/QuadballScorekeeper/quadball-scorekeeper/actions/workflows/test.yml)
[![Lint](https://github.com/QuadballScorekeeper/quadball-scorekeeper/actions/workflows/lint.yml/badge.svg)](https://github.com/QuadballScorekeeper/quadball-scorekeeper/actions/workflows/lint.yml)

This is a web app for keeping track of game states in a quadball game.
Test it at _url-to-page_

Currently supporting:

- IQA 2023-2024 rulebook

## Developing

Once you've cloned the repository, install dependencies with `npm install` (or `pnpm install` or `yarn`), then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
