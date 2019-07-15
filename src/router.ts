// router.ts

/*
 * Koa2 router implementation for validating against a Swagger document
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

import * as Koa from 'koa';
import * as body from 'koa-bodyparser';
import koaConvert = require('koa-convert');
import * as koaCors from 'koa-cors';
import * as KoaRouter from 'koa-router';
import * as swagger from 'swagger2';

import validate from './validate';

import debug from './debug';

interface HttpRouter extends Router {
  routes: () => (ctx: Koa.Context, next: () => void) => any;
  allowedMethods: () => (ctx: Koa.Context, next: () => void) => any;
}

export interface Request {
  query: any;
  body?: any;
  method: string;
  url: string;
  ip: string;
  ips: string[];
  subdomains: string[];
  origin: string;
  host: string;
  length: number;
  originalUrl: string;
  href: string;
  querystring: string;
  search: string;
  hostname: string;
  type: string;
  charset?: string;
  fresh: boolean;
  stale: boolean;
  idempotent: boolean;
  get: (field: string) => string;
  header: { [name: string]: string; };
  headers: { [name: string]: string; };
}

export interface Response {
  get: (field: string) => string;
  set: (field: string, value: string) => void;
  body?: any;
  status?: number;
  message?: string;
  redirect: (url: string, alt?: string) => void;
  header: { [name: string]: string; };
}

export interface Context extends Request, Response {
  params: { [name: string]: string; };
  request: Request;
  response: Response;
}

export type Middleware = (context: Context, next: () => void) => any;

export interface Router {
  get: (path: string, ...middleware: Middleware[]) => Router;
  head: (path: string, ...middleware: Middleware[]) => Router;
  put: (path: string, ...middleware: Middleware[]) => Router;
  post: (path: string, ...middleware: Middleware[]) => Router;
  del: (path: string, ...middleware: Middleware[]) => Router;
  patch: (path: string, ...middleware: Middleware[]) => Router;
  app: () => any;
}

export default function(swaggerDocument: any): Router {

  const router = new KoaRouter() as unknown as HttpRouter;
  const app = new Koa();

  // automatically convert legacy middleware to new middleware
  const appUse = app.use;
  app.use = (x: any): any => appUse.call(app, koaConvert(x));

  let document: any;

  if (typeof swaggerDocument === 'string') {
    document = swagger.loadDocumentSync(swaggerDocument);
  } else {
    document = swaggerDocument;
  }

  if (!swagger.validateDocument(document)) {
    throw Error(`Document does not conform to the Swagger 2.0 schema`);
  }

  app.use(debug('swagger2-koa:router'));
  app.use(koaCors());
  app.use(body());
  app.use(validate(document));
  app.use(router.routes());
  app.use(router.allowedMethods());

  const full = (path: string) => document.basePath !== undefined ? document.basePath + path : path;

  return {
    get: (path, ...middleware) => router.get(full(path), ...middleware),
    head: (path, ...middleware) => router.head(full(path), ...middleware),
    put: (path, ...middleware) => router.put(full(path), ...middleware),
    post: (path, ...middleware) => router.post(full(path), ...middleware),
    del: (path, ...middleware) => router.del(full(path), ...middleware),
    patch: (path, ...middleware) => router.patch(full(path), ...middleware),
    app: () => app
  };
}
