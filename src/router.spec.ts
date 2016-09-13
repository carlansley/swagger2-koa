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

  it('fails with invalid filename', () => {
    assert.throws(() => swaggerRouter('invalid.yml'), Error);
  });

  it('fails with invalid Swagger document', () => {
    assert.throws(() => swaggerRouter(__dirname + '/../.travis.yml'));
  });

  it('invalid path', async () => http.post('/mock/pingy').expect(404));
  it('invalid path', async () => http.post('/pingy').expect(404));
  it('invalid method', async () => http.post('/mock/badPing').expect(405));
  it('invalid request', async () => http.get('/mock/ping?x=y').expect(400));

  it('validates valid GET operation', async () => {
    const {body} =  await http.get('/mock/ping').expect(200);
    assert.doesNotThrow(() => new Date(body.time));
  });

  it('validates valid HEAD operation', async () => {
    const {body} = await http.head('/mock/ping').expect(200);
    assert.deepStrictEqual(body, {});
  });

  it('validates valid POST operation', async () => {
    const {body} = await http.post('/mock/ping').expect(201);
    assert.deepStrictEqual(body, {});
  });

  it('validates valid DELETE operation', async () => {
    const {body} = await http.del('/mock/ping').expect(204);
    assert.deepStrictEqual(body, {});
  });

  it('support CORS via OPTIONS operation', async () => {
    const {body} = await http.options('/mock/ping').expect(204);
    assert.deepStrictEqual(body, {});
  });

  it('validates valid PUT operation', async () => {
    const {body} = await http.put('/mock/ping').expect(204);
    assert.deepStrictEqual(body, {});
  });

  it('does not validate invalid operation response', async () => {
    const {body} = await http.get('/mock/badPing').expect(500);
    assert.deepStrictEqual(body, {
      'code': 'SWAGGER_RESPONSE_VALIDATION_FAILED',
      'errors': [{
        'actual': {'badTime': 'mock'},
        'expected': {
          'schema': {'type': 'object', 'required': ['time'], 'properties': {'time': {'type': 'string', 'format': 'date-time'}}}},
        'where': 'response'
      }]
    });
  });
});
