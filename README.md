# backend-pdf2qa

Backend for the PDF converter. We validate PDFs of articles and journals and pass them to our AI model, before retreiving Q&A responses and storing them on the database. User payment options are supported.

## Installation

Use yarn to install node modules.

```bash
yarn install
```

## Usage

Ensure to add `.env` file with reference to `.env.template`.

### Develop locally with `serverless-offline` plugin

`yarn sls-local` will start a HTTP server on your local machine that emulates AWS Lambda and AWS API Gateway:

Example:

```bash
❯ yarn sls-dev
yarn run v1.22.19
$ sls offline --reloadHandler --stage dev
(node:30929) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
✔ serverless-better-credentials: credentials resolved from config ini profile: AWS_DEFAULT_PROFILE (default)

Starting Offline at stage dev (eu-west-2)

Offline [http for lambda] listening on http://localhost:3002
Function names exposed for local invocation by aws-sdk:
           * ping: ping
           * authorizer: authorizer
           * uploadPdf: uploadPdf
Configuring Authorization: /upload-pdf authorizer

   ┌──────────────────────────────────────────────────────────────────────────────┐
   │                                                                              │
   │   GET  | http://localhost:3000/dev                                           │
   │   POST | http://localhost:3000/2015-03-31/functions/ping/invocations         │
   │   POST | http://localhost:3000/dev/authorizer                                │
   │   POST | http://localhost:3000/2015-03-31/functions/authorizer/invocations   │
   │   POST | http://localhost:3000/dev/upload-pdf                                │
   │   POST | http://localhost:3000/2015-03-31/functions/uploadPdf/invocations    │
   │                                                                              │
   └──────────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

Use curl to make a GET request to the `ping` lambda:

```bash
❯ curl http://localhost:3000/
{"message":"pong"}%
```
### Custom Authorizer

A custom authorizer can be connected to endpoints but adding the `authorizer` property to the function's http event:

```yml
...
  uploadPdf:
    handler: ./src/lambda/uploadPdf.handler
    name: uploadPdf
    events:
      - http:
          path: /upload-pdf
          method: post
          # An AWS API Gateway custom authorizer function
          authorizer:
            name: authorizer
            resultTtlInSeconds: 0
            identitySource: method.request.header.cookie
            type: token   
...
```

The `authorizer` (a dedicated function within this service) acts as a middle man for all protected routes, extracting the `sessionToken` created by NextAuth.js on the frontend abd verfiying it with the `NEXT_AUTH_SECRET` environment variable before allowing/denying further access. [See AWS docs for more infomation](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)

The custom `authorizer` endpoint can be tested as follows:
```bash
❯ curl -X POST http://localhost:3000/dev/upload-pdf
{"statusCode":401,"error":"Unauthorized","message":"User is not authorized to access this resource"}% 
```

### Deploy to AWS

To deploy lambdas to AWS run `sls-deploy`.

### Run Docker

Initialise database connection with `docker-compose build` followed by `docker-compose up`.

## Project Best Practices

### Git

We use Gitflow https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

main => dev => feature branches

### Style

Code with reference to https://github.com/goldbergyoni/nodebestpractices#1-project-architecture-practices
