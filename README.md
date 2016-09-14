[![Build Status](https://travis-ci.org/carlansley/swagger2-koa.svg?branch=master)](https://travis-ci.org/carlansley/swagger2-koa2)
[![Coverage Status](https://coveralls.io/repos/github/carlansley/swagger2-koa/badge.svg?branch=master)](https://coveralls.io/github/carlansley/swagger2-koa2?branch=master)
[![Dependencies](https://david-dm.org/carlansley/swagger2-koa.svg)](https://raw.githubusercontent.com/carlansley/swagger2-koa/master/package.json)

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

This is the easiest way to use swagger2-koa; it creates a standalone koa server, adds the `validate` and `ui` middleware, and returns a
Router object that allows you to add your route implementations.

```
import {router as swaggerRouter, Router} from 'swagger2-koa';

...

let router: Router = swaggerRouter(__dirname + '/swagger.yml');

router.get('/ping', async (context) => {
  context.status = 200;
  context.body = {
    serverTime: new Date().toISOString()
  };
});

...

router.app().listen(3000);

```

Note: in addition to `validate` and `ui` (described below), `router` adds the following middleware:
* `koa-cors`
* `koa-router`
* `koa-convert`
* `koa-onerror`
* `koa-body`

### `validate(document) => koa2 middleware`
If you already have a Koa server, this middleware adds basic loading and validation of HTTP requests and responses against
swagger 2.0 document:

```
import * as swagger from 'swagger2';
import { validate } from 'swagger2-koa';

let app = new Koa();

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
* if the request body does not validate, an HTTP 400 is returned to the client (subsequent middleware is never processed)
* if the response body does not validate, an HTTP 500 is returned to the client

For either request (HTTP 400) or response (HTTP 500) errors, details of the schema validation error are passed back in the body. e.g.:

```
{
  'code': 'SWAGGER_RESPONSE_VALIDATION_FAILED',
  'errors': [{
     'actual': {'badTime': 'mock'},
     'expected': {
        'schema': {'type': 'object', 'required': ['time'], 'properties': {'time': {'type': 'string', 'format': 'date-time'}}}
     },
     'where': 'response'
}
```

### `ui(document) => koa2 middleware`

You can also serve a swagger-ui for your API:

```
import * as swagger from 'swagger2';
import { ui } from 'swagger2-koa';

let app = new Koa();

const document = swagger.loadDocumentSync('./swagger.yml');
app.use(ui(document));

```

`ui()` adds routes for /api-docs and serves swagger-ui at /.


## Limitations

* only supports Koa 2-style async/await middleware interface
* requires node version 6 and above

## License

MIT
