// ui.ts

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

import type * as koa from 'koa';
import send from 'koa-send';
import type * as swagger from 'swagger2';

import html from './ui-html';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires
const SWAGGER_UI_PATH = require('swagger-ui-dist/absolute-path.js')();

export default function (
  document: swagger.Document,
  pathRoot = '/',
  skipPaths: string[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (context: any, next: () => Promise<void>) => Promise<void> {
  const pathPrefix = pathRoot.endsWith('/') ? pathRoot : `${pathRoot}/`;
  const uiHtml = html(document, pathPrefix);

  return async (context: koa.Context, next: () => void) => {
    if (context.path.startsWith(pathRoot)) {
      const skipPath: boolean = skipPaths.some((current) => context.path.startsWith(current));
      if (context.path === pathRoot && context.method === 'GET') {
        context.type = 'text/html; charset=utf-8';
        context.body = uiHtml;
        context.status = 200;
        return;
      } else if (context.path === `${pathPrefix}api-docs` && context.method === 'GET') {
        context.type = 'application/json; charset=utf-8';
        context.body = document;
        context.status = 200;
        return;
      } else if (!skipPath && context.method === 'GET') {
        const filePath = context.path.substring(pathRoot.length);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await send(context, filePath, { root: SWAGGER_UI_PATH });
        return;
      }
    }
    return next();
  };
}
