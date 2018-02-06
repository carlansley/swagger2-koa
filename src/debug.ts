// debug.ts

/*
 * Middleware for debugging HTTP requests and responses
 */

/*
 The MIT License

 Copyright (c) 2014-2018 Carl Ansley

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

import * as debug from 'debug';

export default function(module: string) {

  // set up logging
  const log = debug(module);

  if (!log.enabled) {
    // logging not enabled for this module, return do-nothing middleware
    return (context: any, next: () => void) => next();
  }

  /* istanbul ignore next */
  return async (context: any, next: () => void) => {

    const startTime = Date.now();
    const { method, url } = context.request;

    await next();

    const status = parseInt(context.status, 10);
    const requestBody = context.request.body === undefined ? undefined : JSON.stringify(context.request.body);
    const responseBody = context.body === undefined ? undefined : JSON.stringify(context.body);
    const time = Date.now() - startTime;

    if (requestBody !== undefined && responseBody !== undefined) {
      log(`${method} ${url} ${requestBody} -> ${status} ${responseBody} ${time}ms`);
    }

    if (requestBody !== undefined && responseBody === undefined) {
      log(`${method} ${url} ${requestBody} -> ${status} ${time}ms`);
    }

    if (requestBody === undefined && responseBody !== undefined) {
      log(`${method} ${url} -> ${status} ${responseBody} ${time}ms`);
    }

    if (requestBody === undefined && responseBody === undefined) {
      log(`${method} ${url} -> ${status} ${time}ms`);
    }
  };
}
