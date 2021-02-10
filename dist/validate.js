"use strict";
// validate.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Koa2 middleware for validating against a Swagger document
 */
/*
 The MIT License

 Copyright (c) 2014-2021 Carl Ansley

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
/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
const swagger = __importStar(require("swagger2"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function default_1(document) {
    // construct a validation object, pre-compiling all schema and regex required
    const compiled = swagger.compileDocument(document);
    // construct a canonical base path
    const basePath = (document.basePath || '') + ((document.basePath || '').endsWith('/') ? '' : '/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (context, next) => {
        if (typeof document.basePath !== 'undefined' && !context.path.startsWith(basePath)) {
            // not a path that we care about
            return next();
        }
        const compiledPath = compiled(context.path);
        if (typeof compiledPath === 'undefined') {
            // if there is no single matching path, return 404 (not found)
            context.status = 404;
            return;
        }
        // check the request matches the swagger schema
        const validationErrors = swagger.validateRequest(compiledPath, context.method, context.request.query, context.request.body, context.request.headers);
        if (typeof validationErrors === 'undefined') {
            // operation not defined, return 405 (method not allowed)
            if (context.method !== 'OPTIONS') {
                context.status = 405;
            }
            return;
        }
        if (validationErrors.length > 0) {
            context.status = 400;
            context.body = {
                code: 'SWAGGER_REQUEST_VALIDATION_FAILED',
                errors: validationErrors,
            };
            return;
        }
        // wait for the operation to execute
        // eslint-disable-next-line callback-return
        await next();
        // do not validate responses to OPTIONS
        if (context.method.toLowerCase() === 'options') {
            return;
        }
        // check the response matches the swagger schema
        const error = swagger.validateResponse(compiledPath, context.method, context.status, context.body);
        if (error) {
            error.where = 'response';
            // eslint-disable-next-line require-atomic-updates
            context.status = 500;
            // eslint-disable-next-line require-atomic-updates
            context.body = {
                code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
                errors: [error],
            };
        }
    };
}
exports.default = default_1;
/* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
//# sourceMappingURL=validate.js.map