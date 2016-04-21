// router.spec.ts

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
import * as agent from 'supertest-koa-agent';
import * as swagger from 'swagger2';
import swaggerRouter, {Context} from './router';

describe('router', () => {

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
        },
        'head': {
          responses: {
            200: {
              description: ''
            }
          }
        },
        'put': {
          responses: {
            204: {
              description: ''
            }
          }
        },
        'post': {
          responses: {
            201: {
              description: ''
            }
          }
        },
        'delete': {
          responses: {
            204: {
              description: ''
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

  let router = swaggerRouter(document);

  router.head('/ping', (context: Context) => {
    context.status = 200;
  });

  router.get('/ping', (context: Context) => {
    context.status = 200;
    context.body = {
      time: new Date().toISOString()
    };
  });

  router.put('/ping', (context: Context) => {
    context.status = 204;
  });

  router.post('/ping', (context: Context) => {
    context.status = 201;
  });

  router.del('/ping', (context: Context) => {
    context.status = 204;
  });

  router.get('/badPing', (context: Context) => {
    context.status = 200;
    context.body = {
      badTime: 'mock'
    };
  });

  let http = agent(router.app());

  it('invalid path', done => http.post('/mock/pingy').expect(404, done));
  it('invalid path', done => http.post('/pingy').expect(404, done));
  it('invalid method', done => http.post('/mock/badPing').expect(405, done));
  it('invalid request', done => http.get('/mock/ping?x=y').expect(400, done));

  it('validates valid GET operation', done => http.get('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 200);
    assert.doesNotThrow(() => new Date(response.body.time));
    done();
  }));

  it('validates valid HEAD operation', done => http.head('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 200);
    assert.deepStrictEqual(response.body, {});
    done();
  }));

  it('validates valid POST operation', done => http.post('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 201);
    assert.deepStrictEqual(response.body, {});
    done();
  }));

  it('validates valid DELETE operation', done => http.del('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 204);
    assert.deepStrictEqual(response.body, {});
    done();
  }));

  it('support CORS via OPTIONS operation', done => http.options('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 204);
    assert.deepStrictEqual(response.body, {});
    done();
  }));

  it('validates valid PUT operation', done => http.put('/mock/ping').end((err: any, response: any) => {
    assert.equal(!err, true);
    assert.equal(response.status, 204);
    assert.deepStrictEqual(response.body, {});
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
