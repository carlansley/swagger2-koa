"use strict";
// validate.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Koa2 middleware for validating against a Swagger document
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
var swagger = require("swagger2");
function default_1(document) {
    var _this = this;
    // construct a validation object, pre-compiling all schema and regex required
    var compiled = swagger.compileDocument(document);
    // construct a canonical base path
    var basePath = (document.basePath || '') + ((document.basePath || '').endsWith('/') ? '' : '/');
    return function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var compiledPath, validationErrors, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(document.basePath !== undefined && !context.path.startsWith(basePath))) return [3 /*break*/, 2];
                    // not a path that we care about
                    return [4 /*yield*/, next()];
                case 1:
                    // not a path that we care about
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    compiledPath = compiled(context.path);
                    if (compiledPath === undefined) {
                        // if there is no single matching path, return 404 (not found)
                        context.status = 404;
                        return [2 /*return*/];
                    }
                    validationErrors = swagger.validateRequest(compiledPath, context.method, context.request.query, context.request.body, context.request.headers, context.params);
                    if (validationErrors === undefined) {
                        // operation not defined, return 405 (method not allowed)
                        if (context.method !== 'OPTIONS') {
                            context.status = 405;
                        }
                        return [2 /*return*/];
                    }
                    if (validationErrors.length > 0) {
                        context.status = 400;
                        context.body = {
                            code: 'SWAGGER_REQUEST_VALIDATION_FAILED',
                            errors: validationErrors
                        };
                        return [2 /*return*/];
                    }
                    // wait for the operation to execute
                    return [4 /*yield*/, next()];
                case 3:
                    // wait for the operation to execute
                    _a.sent();
                    error = swagger.validateResponse(compiledPath, context.method, context.status, context.body);
                    if (error) {
                        error.where = 'response';
                        context.status = 500;
                        context.body = {
                            code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
                            errors: [error]
                        };
                    }
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.default = default_1;
//# sourceMappingURL=validate.js.map