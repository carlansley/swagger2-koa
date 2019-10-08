"use strict";
// router.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
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
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_convert_1 = __importDefault(require("koa-convert"));
const koa_cors_1 = __importDefault(require("koa-cors"));
const koa_router_1 = __importDefault(require("koa-router"));
const swagger = __importStar(require("swagger2"));
const validate_1 = __importDefault(require("./validate"));
const debug_1 = __importDefault(require("./debug"));
function default_1(swaggerDocument) {
    const router = new koa_router_1.default();
    const app = new koa_1.default();
    // automatically convert legacy middleware to new middleware
    const appUse = app.use;
    // eslint-disable-next-line id-length,@typescript-eslint/no-explicit-any
    app.use = (x) => appUse.call(app, koa_convert_1.default(x));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let document;
    if (typeof swaggerDocument === 'string') {
        // eslint-disable-next-line no-sync
        document = swagger.loadDocumentSync(swaggerDocument);
    }
    else {
        document = swaggerDocument;
    }
    if (!swagger.validateDocument(document)) {
        throw Error(`Document does not conform to the Swagger 2.0 schema`);
    }
    app.use(debug_1.default('swagger2-koa:router'));
    app.use(koa_cors_1.default());
    app.use(koa_bodyparser_1.default());
    app.use(validate_1.default(document));
    app.use(router.routes());
    app.use(router.allowedMethods());
    const full = (path) => (typeof document.basePath !== 'undefined' ? document.basePath + path : path);
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
exports.default = default_1;
//# sourceMappingURL=router.js.map