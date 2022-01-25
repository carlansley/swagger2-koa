"use strict";
// router.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const cors_1 = __importDefault(require("@koa/cors"));
const router_1 = __importDefault(require("@koa/router"));
const swagger = __importStar(require("swagger2"));
const validate_1 = __importDefault(require("./validate"));
const debug_1 = __importDefault(require("./debug"));
function default_1(swaggerDocument) {
    const router = new router_1.default();
    const app = new koa_1.default();
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
    app.use((0, debug_1.default)('swagger2-koa:router'));
    app.use((0, cors_1.default)());
    app.use((0, koa_bodyparser_1.default)());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    app.use((0, validate_1.default)(document));
    app.use(router.routes());
    app.use(router.allowedMethods());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-plus-operands
    const full = (path) => (typeof document.basePath !== 'undefined' ? document.basePath + path : path);
    return {
        get: (path, ...middleware) => router.get(full(path), ...middleware),
        head: (path, ...middleware) => router.head(full(path), ...middleware),
        put: (path, ...middleware) => router.put(full(path), ...middleware),
        post: (path, ...middleware) => router.post(full(path), ...middleware),
        del: (path, ...middleware) => router.del(full(path), ...middleware),
        patch: (path, ...middleware) => router.patch(full(path), ...middleware),
        app: () => app,
    };
}
exports.default = default_1;
//# sourceMappingURL=router.js.map