# Vercel API
The primary aim for this project is to have a set of low-maintenance `API` endpoints / `serverless` functions that are accessible via simple `HTTP` requests eg. `GET` and `POST`. This is achieved via `Vercel` as it allows you to make use of these free `serverless` functions in your project's `api/` directory. Some effort has been made to ensure that the `API` is consistent, and that the `HTTP` requests get a coherent response in every scenario.

The main site can be found [here](https://scarletti-ben.vercel.app), it is currently a work in progress, with the `API` itself being the main focus

> [!NOTE]
> This repository is hosted on `GitHub`, and linked to `Vercel`. `Vercel` listens for any pushes to the `main` branch which will automatically trigger a new `build` and `deploy` process

# API Endpoints
The `serverless` function for each `API` endpoint should be accessible via a link in the format `https://app-name.vercel.app/api/endpoint-name`

> [!TIP]
> You can test `API` endpoints using the `API` tester [ReqBin](https://reqbin.com/)

## Current API Endpoints

### [api/test](https://scarletti-ben.vercel.app/api/test)
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test) should succeed

### [api/test-proxy](https://scarletti-ben.vercel.app/api/test-proxy)
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-proxy) should fail as the `?url=` parameter is missing
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-proxy?url=https://api.dictionaryapi.dev/api/v2/entries/en/hello) should succeed with a `JSON` object as the data field
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-proxy?url=https://www.example.com) should fail as the content type returned is `text/html`
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-proxy?url=https://www.reddit.com) should fail as `Reddit` does not honour the request

### [api/public-key](https://scarletti-ben.vercel.app/api/public-key)
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/public-key) should succeed with `PUBLIC_KEY` as a `Base64` encoded string in an object of the data field `response.data.PUBLIC_KEY`

### [api/test-rsa-oaep](https://scarletti-ben.vercel.app/api/test-rsa-oaep)
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-rsa-oaep) should fail as neither `?encrypt=` nor `?decrypt=` parameter are found
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-rsa-oaep?encrypt=test) should succeed and encrypt text to `response.data.text`
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-rsa-oaep?decrypt=V%2Bt0hOXZvfeO51ca2UopBVuv5j3Hjz1JeTjXhIlEa2UManXn5JbUbGfyWfbQsI0ymvNe%2BD7kgTkiHFDHQUgrivKjUknzuQel8Wmm%2BM5hc7yfzqWDDrjJwFN3xr%2BtFnD31bxaaK%2Fqw6z%2FjZlAVy4bFIkKu%2BlmQyABoGQStNOLyC%2FHGYIPptm6cvlT%2BAU4vY4c8psr0FcTwweQTg88YsM9hFBo7UXDyvQK4ugD5RDes%2FL%2BennOMEmOI9SosA7KZz825%2FJX5zzpkf2c8fNw5JXetn7HSfvVozYrb9akVPodk81XSTsNc1gWuIsDmen5JtIqZhLso8aP9yHMItoOeZahAw%3D%3D) should succeed and decrypt text to `response.data.text`
- A `GET` request or direct access [here](https://scarletti-ben.vercel.app/api/test-rsa-oaep?decrypt=test) should fail as the text is not `URI`-safe `Base64`-encoded string encrypted via `RSA-OAEP`

> [!Caution]
> Remember that `GET` requests have security issues as text needs to be passed as query parameters within the `URL` itself. This endpoint should not be used for sensitive data under any circumstances

Ideally, instead of a `GET` request, a `POST` request with `HTTPS` would be used, and this would also eliminate the need for the `decodeURIComponent` and `encodeURIComponent` calls as `POST` does not need to adhere to the `URL` character set

## Adding a New API Endpoint
It is incredibly easy to add a new `serverless` function / `API` endpoint to `Vercel`. To do so, create a new `.js` file in the `api/` directory and write a function in the format `export default function handler(request, response)`. Once completed, push the change to the `main` branch. `Vercel` will start a `build` and `deploy` process, with the new endpoint accessible at `https://app-name.vercel.app/api/endpoint-name`

An incredibly simple example of a `handler` function can be found below. There is no perfect `handler` function, it can be as complex or simple as you want, this example is using a response object style I have been using recently
```javascript
/**
 * API handler for the `example` endpoint
 * - Runs in a Node.js environment
 * - Request and Response types from Next.js
 * 
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

# Vercel Environment Variables
You can add environment variables to your `Vercel` projects via `Projet Settings/Environment Variables`, these are accessible in your `API` endpoints via `process.env.VARIABLE_NAME`. The contents of these variables are only exposed if you manually return them in a response, otherwise you can use them within your serverless functions however you wish.

An example usage is in `api/public-key` which exposes `process.env.PUBLIC_KEY` openly for any `GET` request to the endpoint. See [api/public-key](#apipublic-key)

# Initial Vercel Setup
As mentioned above, this `Vercel` project is linked to a `GitHub` repository, and listens for pushes to the `main` branch. Setting this up was incredibly simple, and the steps are listed below

- Visit [Vercel](https://vercel.com/), sign up and give a name, then authenticate via `GitHub`
  - No need for a username or password
- From the main page of `Vercel` you can "Install GitHub", which allows you to select the repositories that `Vercel` has access to
  - Select the specific repositories you want `Vercel` to have access to
- Once linked you can deploy your `Vercel` site from a repository, and any pushes to the `main` branch of the repository will be reflected in your `Vercel` site
- To add a serverless function, simply add the `/api` directory to your repository with endpoints being `JavaScript` files, eg. `endpoint-name.js` would be accessible via `https://app-name.vercel.app/api/endpoint-name`, see [adding a new API endpoint](#adding-a-new-api-endpoint)

# Miscellaneous
- By default, all requests via `HTTPS` are encrypted, and requests without `HTTPS` would be visible in plain text on your network. This does not mean that `GET` requests via `HTTP` are entirely secure, as the query parameters may be saved in your browser history or the server logs of the server you connect to
- Sometimes clicking a link can affect the characters in the URL slightly, consider copy and pasting the URL if you encounter issues

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