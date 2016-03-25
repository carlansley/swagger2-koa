// validate.spec.ts

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
import * as koaRouter from 'koa-router';


import validate from './validate';

describe('validate', () => {

  const document: swagger.Document = {
    swagger: '2.0',
    info: {
      title: 'mock',
      version: '0.0.1'
    },
    basePath: '/mock',
    paths: {
      '/ping': {
        'get': {
          responses: {
            200: {
              description: '',
              schema: {
                type: 'object',
                required: ['time'],
                properties: {
                  time: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      },
      '/badPing': {
        'get': {
          responses: {
            200: {
              description: '',
              schema: {
                type: 'object',
                required: ['time'],
                properties: {
                  time: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  let router = koaRouter();

  router.get('/mock/ping', (context: Koa.Context) => {
    context.status = 200;
    context.body = {
      time: new Date().toISOString()
    };
  });

  router.get('/mock/badPing', (context: Koa.Context) => {
    context.status = 200;
    context.body = {
      badTime: 'mock'
    };
  });

  let app = new Koa();
  app.use(validate(document));
  app.use(router.routes());
  app.use(router.allowedMethods());

  let http = agent(app);

  it('invalid path', done => http.post('/mock/pingy').expect(404, done));
  it('invalid path', done => http.post('/pingy').expect(404, done));
  it('invalid method', done => http.post('/mock/ping').expect(405, done));
  it('invalid request', done => http.get('/mock/ping?x=y').expect(400, done));

  it('validates valid operation', done => http.get('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 200);
    assert.doesNotThrow(() => new Date(response.body.time));
    done();
  }));

  it('does not validate invalid operation response', done => http.get('/mock/badPing').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 500);
    assert.deepStrictEqual(response.body, {
      'code': 'SWAGGER_RESPONSE_VALIDATION_FAILED',
      'errors': [{
        'actual': {'badTime': 'mock'},
        'expected': {'schema': {'type': 'object', 'required': ['time'], 'properties': {'time': {'type': 'string', 'format': 'date-time'}}}},
        'where': 'response'
      }]
    });
    done();
  }));
});
