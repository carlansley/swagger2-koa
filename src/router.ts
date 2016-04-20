// router.ts

/*
 * Koa2 router implementation for validating against a Swagger document
 */

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

import * as Koa from 'koa';
import * as koaRouter from 'koa-router';
import * as koaConvert from 'koa-convert';
import * as koaError from 'koa-onerror';
import * as body from 'koa-body';
import * as swagger from 'swagger2';

import validate from './validate';

import {logger} from './log';

interface HttpRouter extends Router {
  routes: () => (ctx: Koa.Context, next: Function) => any;
  allowedMethods: () => (ctx: Koa.Context, next: Function) => any;
}

export interface Request {
  query: any;
  body?: any;
  method: string;
}

export interface Response {
  set?: (field: any, val: any) => void;
  body?: any;
  status?: number;
}

export interface Context extends Request, Response {
  params: { [name: string]: string; };
  request: Request;
  response: Response;
}

export type Middleware = (context: Context, next: Function) => any;

export interface Router {
  get: (path: string, middleware: Middleware) => Router;
  head: (path: string, middleware: Middleware) => Router;
  put: (path: string, middleware: Middleware) => Router;
  post: (path: string, middleware: Middleware) => Router;
  del: (path: string, middleware: Middleware) => Router;
  app: () => Koa;
}

export default function (swaggerDocument: any): Router {

  let router: HttpRouter = koaRouter();
  let app = new Koa();

  // automatically convert legacy middleware to new middleware
  const _use = app.use;
  app.use = x => _use.call(app, koaConvert(x));

  let document: any;

  if (typeof swaggerDocument === 'string') {
    document = swagger.loadDocumentSync(swaggerDocument);
  } else {
    document = swaggerDocument;
  }

  if (!swagger.validateDocument(document)) {
    throw Error(`Document does not conform to the Swagger 2.0 schema`);
  }

  koaError(app);

  app.use(logger);
  app.use(body());
  app.use(validate(document));
  app.use(router.routes());
  app.use(router.allowedMethods());

  return {
    get: (path, middleware) => router.get(document.basePath + path, middleware),
    head: (path, middleware) => router.head(document.basePath + path, middleware),
    put: (path, middleware) => router.put(document.basePath + path, middleware),
    post: (path, middleware) => router.post(document.basePath + path, middleware),
    del: (path, middleware) => router.del(document.basePath + path, middleware),
    app: () => app
  };
}
