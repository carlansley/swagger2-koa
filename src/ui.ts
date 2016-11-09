// ui.ts

/*
 The MIT License

 Copyright (c) 2014-2016 Carl Ansley

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

import * as koa from 'koa';
import * as koaConvert from 'koa-convert';
import * as koaStatic from 'koa-static';
import * as swaggerUi from 'swagger-ui/index';
import * as swagger from 'swagger2';

import html from './ui-html';

const uiMiddleware = koaConvert(koaStatic(swaggerUi.dist, {}));

export default function(
  document: swagger.Document, basePath: string = '/'): (context: any, next: () => Promise<void>) => Promise<void> {

  const uiHtml = html(document);
  const apiDocsPath = basePath.endsWith('/') ? basePath + 'api-docs' : basePath + '/api-docs';
  return async(context: koa.Context, next: Function) => {
    if (context.path === basePath && context.method === 'GET') {
      context.type = 'text/html; charset=utf-8';
      context.body = uiHtml;
      context.status = 200;
      return;
    } else if (context.path === apiDocsPath && context.method === 'GET') {
      context.type = 'application/json; charset=utf-8';
      context.body = document;
      context.status = 200;
      return;
    }

    // outside of / and /api-docs, serve static SwaggerUI files
    await uiMiddleware(context, next);
  };
}
