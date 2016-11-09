// ui.spec.ts

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

import * as assert from 'assert';
import * as Koa from 'koa';
import * as agent from 'supertest-koa-agent';
import * as swagger from 'swagger2';

import ui from './ui';

const document: swagger.Document = {
  swagger: '2.0',
  info: {
    title: 'mock',
    version: '0.0.1'
  },
  paths: {}
};

function getRequestClient(basePath?: string) {
  return agent((new Koa()).use(ui(document, basePath)));
}

describe('ui', () => {
  it('serves custom index.html', async () => {
    getRequestClient().get('/').expect(200);
  });
  it('serves custom index.html from custom base path', async () => {
    getRequestClient('/swagger2').get('/swagger2').expect(200);
  });

  it('serves api-docs', async () => {
    const {body} = await getRequestClient().get('/api-docs').expect(200);
    assert.deepStrictEqual(body, document);
  });
  it('serves api-docs from custom base path', async () => {
    const {body} = await getRequestClient('/swagger2').get('/swagger2/api-docs').expect(200);
    assert.deepStrictEqual(body, document);
  });

  it('serves swagger UI', async () => getRequestClient().get('/swagger-ui.js').expect(200));
  it('serves swagger UI from custom base path', async () => {
    getRequestClient('/swagger2').get('/swagger2/swagger-ui.js').expect(200);
  });

});
