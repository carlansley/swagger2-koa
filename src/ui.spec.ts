// ui.spec.ts

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

import * as assert from 'assert';
import Koa from 'koa';
import agent from 'supertest';
import type * as swagger from 'swagger2';

import ui from './ui';

const document: swagger.Document = {
  swagger: '2.0',
  info: {
    title: 'mock',
    version: '0.0.1',
  },
  paths: {},
};

function getRequestClient(pathRoot?: string, skipPaths?: string[]) {
  const koa = new Koa().use(ui(document, pathRoot, skipPaths));
  return agent(koa.callback());
}

describe('ui', () => {
  it('serves custom index.html', async () => {
    await getRequestClient().get('/').expect(200);
  });
  it('serves custom index.html from custom path root', async () => {
    await getRequestClient('/swagger2').get('/swagger2').expect(200);
  });

  it('serves files from non-skipped paths', async () => {
    await getRequestClient('/swagger2', ['/swagger/images']).get('/swagger2/swagger-ui.css').expect(200);
  });
  it('does not serve files from skipped paths', async () => {
    await getRequestClient('/swagger2', ['/swagger2']).get('/swagger2/swagger-ui.css').expect(404);
  });

  it('serves api-docs', async () => {
    const { body } = await getRequestClient().get('/api-docs').expect(200);
    assert.deepStrictEqual(body, document);
  });
  it('serves api-docs from custom path root', async () => {
    const { body } = await getRequestClient('/swagger2').get('/swagger2/api-docs').expect(200);
    assert.deepStrictEqual(body, document);
  });

  it('serves swagger UI', async () => getRequestClient().get('/swagger-ui.js').expect(200));
  it('serves swagger UI from custom path root', async () => {
    await getRequestClient('/swagger2').get('/swagger2/swagger-ui.js').expect(200);
  });

  it('does not serve files from paths outside path root', async () => {
    await getRequestClient('/swagger2', ['/swagger/css']).get('/css/print.css').expect(404);
  });
});
