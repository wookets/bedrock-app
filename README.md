# Bedrock App (aka hello bedrock)

This application is built on tanstack start (nodejs) and will provide a server chat api and a rendered chat UI to interact with aws bedrock models. This project is meant to be used with bedrock-iac and bedrock-docs. 

## Dev

From your terminal:

```sh
npm install
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deploy

There is a very basic Dockerfile that can be used to build a container of this app for deployment on ECS. 
