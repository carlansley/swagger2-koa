// router.spec.ts

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
import agent from 'supertest';
import type * as swagger from 'swagger2';

import swaggerRouter, { Context } from './router';

describe('router', () => {
  describe('numeric-path', () => {
    const numericPath = swaggerRouter({
      swagger: '2.0',
      info: {
        title: 'thing',
        version: '1.0',
      },
      paths: {
        '/v1/post/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                type: 'integer',
                format: 'int64',
                description: 'The post to fetch',
                required: true,
              },
            ],
            responses: {
              200: {
                description: '',
              },
            },
          },
        },
      },
    });

    numericPath.get('/v1/post/:id', async (context: Context) => {
      context.status = 200;
    });

    const http = agent(numericPath.app().callback());

    it('validates valid GET operation', async () => {
      await http.get('/v1/post/3').expect(200);
      await http.get('/v1/post/3.2').expect(400);
      await http.get('/v1/post/abc').expect(400);
    });
  });

  describe('no-base-path', () => {
    const routerNoBasePath = swaggerRouter({
      swagger: '2.0',
      info: {
        title: 'mock',
        version: '0.0.1',
      },
      paths: {
        '/ping': {
          get: {
            responses: {
              200: {
                description: '',
                schema: {
                  type: 'object',
                  required: ['time'],
                  properties: {
                    time: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    routerNoBasePath.get('/ping', async (context: Context) => {
      context.status = 200;
      context.body = {
        time: new Date().toISOString(),
      };
    });

    const http = agent(routerNoBasePath.app().callback());

    it('validates valid GET operation', async () => {
      const { body } = await http.get('/ping').expect(200);
      assert.doesNotThrow(() => new Date(body.time));
    });
  });

  describe('mock swagger', () => {
    // noinspection ReservedWordAsName
    const document: swagger.Document = {
      swagger: '2.0',
      info: {
        title: 'mock',
        version: '0.0.1',
      },
      basePath: '/mock',
      paths: {
        '/ping': {
          get: {
            responses: {
              200: {
                description: '',
                schema: {
                  type: 'object',
                  required: ['time'],
                  properties: {
                    time: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
          head: {
            responses: {
              200: {
                description: '',
              },
            },
          },
          patch: {
            responses: {
              204: {
                description: '',
              },
            },
          },
          put: {
            responses: {
              204: {
                description: '',
              },
            },
          },
          post: {
            responses: {
              201: {
                description: '',
              },
            },
          },
          options: {
            responses: {
              200: {
                description: '',
              },
            },
          },
          delete: {
            responses: {
              204: {
                description: '',
              },
            },
          },
        },
        '/badPing': {
          get: {
            responses: {
              200: {
                description: '',
                schema: {
                  type: 'object',
                  required: ['time'],
                  properties: {
                    time: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
          put: {
            responses: {
              201: { description: '' },
            },
          },
          post: {
            responses: {
              201: { description: '' },
            },
          },
        },
      },
    };

    const router = swaggerRouter(document);

    router.head('/ping', async (context: Context) => {
      context.status = 200;
    });

    router.get(
      '/ping',
      async (context: Context, next: () => void) => {
        context.status = 200;
        return next();
      },
      async (context: Context) => {
        context.body = {
          time: new Date().toISOString(),
        };
      }
    );

    router.put('/ping', async (context: Context) => {
      context.status = 204;
    });

    router.patch('/ping', async (context: Context) => {
      context.status = 204;
    });

    router.post('/ping', async (context: Context) => {
      context.status = 201;
    });

    router.del('/ping', async (context: Context) => {
      context.status = 204;
    });

    router.get('/badPing', async (context: Context) => {
      context.status = 200;
      context.body = {
        badTime: 'mock',
      };
    });

    router.put('/badPing', async (context: Context) => {
      context.status = 201;
      context.body = {
        something: 'mock',
      };
    });

    router.post('/badPing', async () => {
      const err = new Error();
      (err as unknown as { status: number }).status = 400;
      throw err;
    });

    const http = agent(router.app().callback());

    it('fails with invalid filename', () => {
      assert.throws(() => swaggerRouter('invalid.yml'), /^Error: ENOENT/u);
    });

    it('fails with invalid Swagger document', () => {
      assert.throws(() => swaggerRouter(`${__dirname}/../.travis.yml`));
    });

    it('invalid path', async () => http.post('/mock/pingy').expect(404));
    it('invalid path', async () => http.post('/pingy').expect(404));
    it('invalid method', async () => http.patch('/mock/badPing').expect(405));
    it('invalid request', async () => http.get('/mock/ping?x=y').expect(400));

    it('validates valid GET operation', async () => {
      const { body } = await http.get('/mock/ping').expect(200);
      assert.doesNotThrow(() => new Date(body.time));
    });

    it('validates valid HEAD operation', async () => {
      const { body } = await http.head('/mock/ping').expect(200);
      assert.deepStrictEqual(body, {});
    });

    it('validates valid POST operation', async () => {
      const { body } = await http.post('/mock/ping').expect(201);
      assert.deepStrictEqual(body, {});
    });

    it('validates valid PATCH operation', async () => {
      const { body } = await http.patch('/mock/ping').expect(204);
      assert.deepStrictEqual(body, {});
    });

    it('validates valid DELETE operation', async () => {
      const { body } = await http.del('/mock/ping').expect(204);
      assert.deepStrictEqual(body, {});
    });

    it('pass through OPTIONS operation', async () => {
      const { body } = await http.options('/mock/ping').expect(200);
      assert.deepStrictEqual(body, {});
    });

    it('validates valid PUT operation', async () => {
      const { body } = await http.put('/mock/ping').expect(204);
      assert.deepStrictEqual(body, {});
    });

    it('handles POST operation throwing 400 error', async () => {
      await http.post('/mock/badPing').expect(400);
    });

    it('does not validate invalid operation response', async () => {
      const { body } = await http.get('/mock/badPing').expect(500);
      assert.deepStrictEqual(body, {
        code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
        errors: [
          {
            actual: { badTime: 'mock' },
            expected: {
              schema: {
                type: 'object',
                required: ['time'],
                properties: { time: { type: 'string', format: 'date-time' } },
              },
            },
            where: 'response',
            error: 'data.time is required',
          },
        ],
      });
    });

    it('does not validate response where nothing is expected', async () => {
      const { body } = await http.put('/mock/badPing').expect(500);
      assert.deepStrictEqual(body, {
        code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
        errors: [
          {
            actual: { something: 'mock' },
            where: 'response',
          },
        ],
      });
    });
  });
});
