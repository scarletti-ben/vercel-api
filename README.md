# Vercel API
The primary aim for this project is to have a set of low-maintenance `API` endpoints / `serverless` functions that are accessible via simple `HTTP` requests eg. `GET` and `POST`. This is achieved via `Vercel` as it allows you to make use of these free `serverless` functions in your project's `api/` directory. Some effort has been made to ensure that the `API` is consistent, and that the `HTTP` requests get a coherent response in every scenario.

The main site can be found [here](https://scarletti-ben.vercel.app), it is currently a work in progress, with the `API` itself being the main focus

> [!NOTE]
> This repository is hosted on `GitHub`, and linked to `Vercel`. `Vercel` listens for any pushes to the `main` branch which will automatically trigger a new `build` and `deploy` process

# Current API Endpoints
The `serverless` function for each `API` endpoint should be accessible via a link in the format `https://app-name.vercel.app/api/endpoint-name`

> [!TIP]
> You can test `API` endpoints using the `API` tester [ReqBin](https://reqbin.com/)

## Current API Endpoints

### [api/test](https://scarletti-ben.vercel.app/api/test)
- A `GET` request or direct access to https://scarletti-ben.vercel.app/api/test should succeed

### [api/test-proxy](https://scarletti-ben.vercel.app/api/test-proxy)
- A `GET` request or direct access to https://scarletti-ben.vercel.app/api/test-proxy?url=https://api.dictionaryapi.dev/api/v2/entries/en/hello should succeed with a `JSON` object as the data field
- A `GET` request or direct access to https://scarletti-ben.vercel.app/api/test-proxy?url=https://www.example.com should fail as the content type returned is `text/html`
- A `GET` request or direct access to https://scarletti-ben.vercel.app/api/test-proxy?url=https://www.reddit.com should fail as `Reddit` does not honour the request

## Adding a New API Endpoint
It is incredibly easy to add a new `serverless` function / `API` endpoint to `Vercel`. To do so, create a new `.js` file in the `api/` directory and write a function in the format `export default function handler(request, response)`. Once completed, push the change to the `main` branch. `Vercel` will start a `build` and `deploy` process, with the new endpoint accessible at `https://app-name.vercel.app/api/endpoint-name`

An incredibly simple example of a `handler` function can be found below. There is no perfect `handler` function, it can be as complex or simple as you want, this example is using a response object style I have been using recently
```javascript
/**
 * API handler for the `example` endpoint
 * - Runs in a Node.js environment
 * - Request and Response types from Next.js
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {void}
 */
export default function handler(request, response) {
    // Handle a GET request with success response
    if (request.method === 'GET') {
        return response.status(200).json({
            ok: true,
            status: 200,
            data: null,
            info: {
                code: 200,
                message: "GET request received",
                details: `GET requests to this endpoint are allowed`,
            },
            error: null,
            timestamp: new Date().toISOString()
        });
    }
}
```

# Initial Vercel Setup
As mentioned above, this `Vercel` project is linked to a `GitHub` repository, and listens for pushes to the `main` branch. Setting this up was incredibly simple, and the steps are listed below

- Visit [Vercel](https://vercel.com/), sign up and give a name, then authenticate via `GitHub`
  - No need for a username or password
- From the main page of `Vercel` you can "Install GitHub", which allows you to select the repositories that `Vercel` has access to
  - Select the specific repositories you want `Vercel` to have access to
- Once linked you can deploy your `Vercel` site from a repository, and any pushes to the `main` branch of the repository will be reflected in your `Vercel` site
- To add a serverless function, simply add the `/api` directory to your repository with endpoints being `JavaScript` files, eg. `endpoint-name.js` would be accessible via `https://app-name.vercel.app/api/endpoint-name`, see [adding a new API endpoint](#adding-a-new-api-endpoint)

# Project Metadata
```yaml
---
title: "Vercel API"
date: "2025-07-20"
# last_modified_at: ""
# description: ""
categories: [
  miscellaneous
]
tags: [
  coding, dev, webdev, html, javascript, css, json, api, endpoints, vercel, fetch, cors, cors proxy
]
---
```