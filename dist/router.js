"use strict";
// router.ts
Object.defineProperty(exports, "__esModule", { value: true });
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
var Koa = require("koa");
var body = require("koa-body");
var koaConvert = require("koa-convert");
var koaCors = require("koa-cors");
var koaRouter = require("koa-router");
var swagger = require("swagger2");
var validate_1 = require("./validate");
var debug_1 = require("./debug");
function default_1(swaggerDocument) {
    var router = koaRouter();
    var app = new Koa();
    // automatically convert legacy middleware to new middleware
    var appUse = app.use;
    app.use = function (x) { return appUse.call(app, koaConvert(x)); };
    var document;
    if (typeof swaggerDocument === 'string') {
        document = swagger.loadDocumentSync(swaggerDocument);
    }
    else {
        document = swaggerDocument;
    }
    if (!swagger.validateDocument(document)) {
        throw Error("Document does not conform to the Swagger 2.0 schema");
    }
    app.use(debug_1.default('swagger2-koa:router'));
    app.use(koaCors());
    app.use(body());
    app.use(validate_1.default(document));
    app.use(router.routes());
    app.use(router.allowedMethods());
    var full = function (path) { return document.basePath !== undefined ? document.basePath + path : path; };
    return {
        get: function (path) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            return router.get.apply(router, [full(path)].concat(middleware));
        },
        head: function (path) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            return router.head.apply(router, [full(path)].concat(middleware));
        },
        put: function (path) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            return router.put.apply(router, [full(path)].concat(middleware));
        },
        post: function (path) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            return router.post.apply(router, [full(path)].concat(middleware));
        },
        del: function (path) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            return router.del.apply(router, [full(path)].concat(middleware));
        },
        patch: function (path) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            return router.patch.apply(router, [full(path)].concat(middleware));
        },
        app: function () { return app; }
    };
}
exports.default = default_1;
//# sourceMappingURL=router.js.map