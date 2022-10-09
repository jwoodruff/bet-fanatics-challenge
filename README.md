## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

1. Get an access token from https://gorest.co.in/consumer/login
2. Open the `.env.sample` file and set the `GO_REST_API_TOKEN` variable with the access token.
3. Rename and save `.env.sample` to `.env`

Bootstrap file can be found in `src/main.ts`

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
