// validate.ts

/*
 * Koa2 middleware for validating against a Swagger document
 */

/*
 The MIT License

 Copyright (c) 2014-2021 Carl Ansley

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import * as swagger from 'swagger2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (document: swagger.Document): (context: any, next: () => Promise<void>) => Promise<void> {
  // construct a validation object, pre-compiling all schema and regex required
  const compiled = swagger.compileDocument(document);

  // construct a canonical base path
  const basePath = (document.basePath || '') + ((document.basePath || '').endsWith('/') ? '' : '/');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (context: any, next: () => Promise<void>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (typeof document.basePath !== 'undefined' && !context.path.startsWith(basePath)) {
      // not a path that we care about
      return next();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const compiledPath = compiled(context.path);
    if (typeof compiledPath === 'undefined') {
      // if there is no single matching path, return 404 (not found)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.status = 404;
      return;
    }

    // check the request matches the swagger schema
    const validationErrors = swagger.validateRequest(
      compiledPath,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      context.method,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.request.query,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.request.body,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.request.headers
    );

    if (typeof validationErrors === 'undefined') {
      // operation not defined, return 405 (method not allowed)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (context.method !== 'OPTIONS') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        context.status = 405;
      }
      return;
    }
    if (validationErrors.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.status = 400;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.body = {
        code: 'SWAGGER_REQUEST_VALIDATION_FAILED',
        errors: validationErrors,
      };
      return;
    }

    // wait for the operation to execute
    await next();

    // do not validate responses to OPTIONS
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (context.method.toLowerCase() === 'options') {
      return;
    }

    // check the response matches the swagger schema
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const error = swagger.validateResponse(compiledPath, context.method, context.status, context.body);
    if (error) {
      error.where = 'response';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.status = 500;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.body = {
        code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
        errors: [error],
      };
    }
  };
}
