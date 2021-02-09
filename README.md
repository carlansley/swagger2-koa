[![Build Status](https://travis-ci.org/carlansley/swagger2-koa.svg?branch=master)](https://travis-ci.org/carlansley/swagger2-koa)
[![Coverage Status](https://coveralls.io/repos/github/carlansley/swagger2-koa/badge.svg?branch=master)](https://coveralls.io/github/carlansley/swagger2-koa?branch=master)
[![Dependencies](https://david-dm.org/carlansley/swagger2-koa.svg)](https://raw.githubusercontent.com/carlansley/swagger2-koa/master/package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/carlansley/swagger2-koa/badge.svg)](https://snyk.io/test/github/carlansley/swagger2-koa)

# swagger2-koa
Koa 2 async-style middleware for loading, parsing and validating requests via swagger2, and serving UI via swagger-ui.
* `router(document) => koa2-style Router`
* `validate(document) => koa2 middleware`
* `ui(document) => koa2 middleware`

## Installation

```shell
$ npm install swagger2-koa --save
```

## Usage

### `router(document) => koa2-style Router`

This is the easiest way to use swagger2-koa; it creates a standalone koa server, adds the `validate` middleware, and returns a
Router object that allows you to add your route implementations.

```
import * as swagger from 'swagger2';
import {ui, router as swaggerRouter, Router} from 'swagger2-koa';

...
const document = swagger.loadDocumentSync('./swagger.yml');
const router: Router = swaggerRouter(document);

router.get('/ping', async (context) => {
  context.status = 200;
  context.body = {
    serverTime: new Date().toISOString()
  };
});

...

router.app()         // get the koa 2 server
  .use(ui(document)) // only needed if you want to publish a swagger-ui for the API
  .listen(3000);     // start handling requests on port 3000

```

Note: in addition to `validate` (described below), `router` adds the following middleware to its koa server:
* `@koa/cors`
* `@koa/router`
* `koa-bodyparser`

### `validate(document) => koa2 middleware`
If you already have a Koa server, this middleware adds basic loading and validation of HTTP requests and responses against
swagger 2.0 document:

```javascript
import * as swagger from 'swagger2';
import { validate } from 'swagger2-koa';

const app = new Koa();

// load YAML swagger file
const document = swagger.loadDocumentSync('./swagger.yml');

// validate document
if (!swagger.validateDocument(document)) {
  throw Error(`./swagger.yml does not conform to the Swagger 2.0 schema`);
}

app.use(body());
app.use(validate(document));

```

The `validate` middleware behaves as follows:
* expects context.body to contain request body in object form (e.g. via use of koa-body)
* if the request is for a path not defined in swagger document, an HTTP 404 is returned to the client (subsequent middleware is never processed).
* if the request body does not validate, an HTTP 400 is returned to the client (subsequent middleware is never processed)
* if the response body does not validate, an HTTP 500 is returned to the client

For either request (HTTP 400) or response (HTTP 500) errors, details of the schema validation error are passed back in the body. e.g.:

```JSON
{
  "code": "SWAGGER_RESPONSE_VALIDATION_FAILED",
  "errors": [{
     "actual": {"badTime": "mock"},
     "expected": {
        "schema": {"type": "object", "required": ["time"], "properties": {"time": {"type": "string", "format": "date-time"}}}
     },
     "where": "response"
  }]
}
```

### `ui(document, pathRoot = "/", skipPaths = []) => koa2 middleware`

You can also serve a swagger-ui for your API from a given path root (pathRoot defaults to "/"):

```javascript
import * as swagger from 'swagger2';
import { ui } from 'swagger2-koa';

const app = new Koa();

const document = swagger.loadDocumentSync('./swagger.yml');
app.use(ui(document));

```

`app.use(ui(document, "/swagger"))` adds routes /swagger/api-docs and /swagger.

By using the `skipPaths` parameter, it is possible to create routes such as:

```
/api          : Swagger UI
/api/api-docs : Swagger API Docs
/api/v1       : Actual API
```

with:

````javascript
app.use(ui(document, "/api", ['/api/v1']));
````

## Debugging

This library uses [`debug`](https://github.com/visionmedia/debug), which can be activated using the
`DEBUG` environment variable:

```shell
export DEBUG=swagger2-koa:*
```

## Limitations

* only supports Koa 2-style async/await middleware interface
* requires node version 14 and above

## License

MIT
