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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var debug = require("debug");
function default_1(module) {
    var _this = this;
    // set up logging
    var log = debug(module);
    if (!log.enabled) {
        // logging not enabled for this module, return do-nothing middleware
        return function (context, next) { return next(); };
    }
    /* istanbul ignore next */
    return function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var startTime, _a, method, url, status, requestBody, responseBody, time;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startTime = Date.now();
                    _a = context.request, method = _a.method, url = _a.url;
                    return [4 /*yield*/, next()];
                case 1:
                    _b.sent();
                    status = parseInt(context.status, 10);
                    requestBody = context.request.body === undefined ? undefined : JSON.stringify(context.request.body);
                    responseBody = context.body === undefined ? undefined : JSON.stringify(context.body);
                    time = Date.now() - startTime;
                    if (requestBody !== undefined && responseBody !== undefined) {
                        log(method + " " + url + " " + requestBody + " -> " + status + " " + responseBody + " " + time + "ms");
                    }
                    if (requestBody !== undefined && responseBody === undefined) {
                        log(method + " " + url + " " + requestBody + " -> " + status + " " + time + "ms");
                    }
                    if (requestBody === undefined && responseBody !== undefined) {
                        log(method + " " + url + " -> " + status + " " + responseBody + " " + time + "ms");
                    }
                    if (requestBody === undefined && responseBody === undefined) {
                        log(method + " " + url + " -> " + status + " " + time + "ms");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.default = default_1;
//# sourceMappingURL=debug.js.map