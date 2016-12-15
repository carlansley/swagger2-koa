// validate.ts
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/*
 * Koa2 middleware for validating against a Swagger document
 */
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
const swagger = require("swagger2");
function default_1(document) {
    // construct a validation object, pre-compiling all schema and regex required
    let compiled = swagger.compileDocument(document);
    return (context, next) => __awaiter(this, void 0, void 0, function* () {
        if (document.basePath !== undefined && !context.path.startsWith(document.basePath)) {
            // not a path that we care about
            yield next();
            return;
        }
        let compiledPath = compiled(context.path);
        if (compiledPath === undefined) {
            // if there is no single matching path, return 404 (not found)
            context.status = 404;
            return;
        }
        // check the request matches the swagger schema
        let validationErrors = swagger.validateRequest(compiledPath, context.method, context.request.query, context.request.body);
        if (validationErrors === undefined) {
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
                errors: validationErrors
            };
            return;
        }
        // wait for the operation to execute
        yield next();
        // check the response matches the swagger schema
        let error = swagger.validateResponse(compiledPath, context.method, context.status, context.body);
        if (error) {
            error.where = 'response';
            context.status = 500;
            context.body = {
                code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
                errors: [error]
            };
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=validate.js.map