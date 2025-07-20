# Vercel CORS Proxy
This `README` is a work in progress.

# Vercel
- Visit [Vercel](https://vercel.com/), sign up and give a name, then authenticate via `GitHub`
  - No need for a username and password
- From the main page you can "Intall GitHub", which allows you to select the repositories that `Vercel` has access to
  - For now it has only been given access to this `vercel-cors-proxy` repository
- Once linked you can deploy your `Vercel` site from a repository, and any pushes to the `main` branch of the repository will be reflected in your `Vercel` site
- To add a serverless function, simply add a `/api` folder to your repository with endpoints being `JavaScript` files, eg. `endpoint-name.js` would be accessible via `https://app-name.vercel.app/api/endpoint-name`

# What is CORS?
That is such a good question, Ben.

# Project Metadata
```yaml
---
title: "Vercel CORS Proxy"
date: "2025-07-20"
# last_modified_at: ""
# description: ""
categories: [
  miscellaneous
]
tags: [
  coding, dev, webdev, html, javascript, css, json, api, cors, cors proxy
]
---
```