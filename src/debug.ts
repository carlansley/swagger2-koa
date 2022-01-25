// debug.ts

/*
 * Middleware for debugging HTTP requests and responses
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

import debug from 'debug';

/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-template-expressions */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (module: string): (context: any, next: () => Promise<void>) => Promise<void> {
  // set up logging
  const log = debug(module);

  if (!log.enabled) {
    // logging not enabled for this module, return do-nothing middleware
    return async (_, next) => next();
  }

  /* istanbul ignore next */
  return async (context, next) => {
    const startTime = Date.now();
    const { method, url } = context.request;

    await next();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const status = parseInt(context.status, 10);
    const requestBody =
      typeof context.request.body === 'undefined' ? context.request.body : JSON.stringify(context.request.body);
    const responseBody = typeof context.body === 'undefined' ? context.body : JSON.stringify(context.body);
    const time = Date.now() - startTime;

    if (typeof requestBody !== 'undefined' && typeof responseBody !== 'undefined') {
      log(`${method} ${url} ${requestBody} -> ${status} ${responseBody} ${time}ms`);
    }

    if (typeof requestBody !== 'undefined' && typeof responseBody === 'undefined') {
      log(`${method} ${url} ${requestBody} -> ${status} ${time}ms`);
    }

    if (typeof requestBody === 'undefined' && typeof responseBody !== 'undefined') {
      log(`${method} ${url} -> ${status} ${responseBody} ${time}ms`);
    }

    if (typeof requestBody === 'undefined' && typeof responseBody === 'undefined') {
      log(`${method} ${url} -> ${status} ${time}ms`);
    }
  };
}

/* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-template-expressions */
