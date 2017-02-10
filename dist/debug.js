// debug.ts
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
 * Middleware for debugging HTTP requests and responses
 */
/*
 The MIT License

 Copyright (c) 2014-2017 Carl Ansley

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
const debug = require("debug");
function default_1(module) {
    // set up logging
    const log = debug(module);
    if (!log.enabled) {
        // logging not enabled for this module, return do-nothing middleware
        return (context, next) => next();
    }
    /* istanbul ignore next */
    return (context, next) => __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        const { method, url } = context.request;
        yield next();
        const status = parseInt(context.status, 10);
        const requestBody = context.request.body === undefined ? undefined : JSON.stringify(context.request.body);
        const responseBody = context.body === undefined ? undefined : JSON.stringify(context.body);
        const time = Date.now() - startTime;
        if (requestBody !== undefined && responseBody !== undefined) {
            log(`${method} ${url} ${requestBody} -> ${status} ${responseBody} ${time}ms`);
        }
        if (requestBody !== undefined && responseBody === undefined) {
            log(`${method} ${url} ${requestBody} -> ${status} ${time}ms`);
        }
        if (requestBody === undefined && responseBody !== undefined) {
            log(`${method} ${url} -> ${status} ${responseBody} ${time}ms`);
        }
        if (requestBody === undefined && responseBody === undefined) {
            log(`${method} ${url} -> ${status} ${time}ms`);
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=debug.js.map