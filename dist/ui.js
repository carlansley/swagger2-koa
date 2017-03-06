// ui.ts
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
var send = require("koa-send");
var swaggerUi = require("swagger-ui/index");
var ui_html_1 = require("./ui-html");
function default_1(document, pathRoot, skipPaths) {
    var _this = this;
    if (pathRoot === void 0) { pathRoot = '/'; }
    if (skipPaths === void 0) { skipPaths = []; }
    var pathPrefix = pathRoot.endsWith('/') ? pathRoot : pathRoot + '/';
    var uiHtml = ui_html_1.default(document, pathPrefix);
    return function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var skipPath, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.path.startsWith(pathRoot)) return [3 /*break*/, 4];
                    skipPath = skipPaths.some(function (path) { return context.path.startsWith(path); });
                    if (!(context.path === pathRoot && context.method === 'GET')) return [3 /*break*/, 1];
                    context.type = 'text/html; charset=utf-8';
                    context.body = uiHtml;
                    context.status = 200;
                    return [2 /*return*/];
                case 1:
                    if (!(context.path === (pathPrefix + 'api-docs') && context.method === 'GET')) return [3 /*break*/, 2];
                    context.type = 'application/json; charset=utf-8';
                    context.body = document;
                    context.status = 200;
                    return [2 /*return*/];
                case 2:
                    if (!(!skipPath && context.method === 'GET')) return [3 /*break*/, 4];
                    filePath = context.path.substring(pathRoot.length);
                    return [4 /*yield*/, send(context, filePath, { root: swaggerUi.dist })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4: return [2 /*return*/, next()];
            }
        });
    }); };
}
exports.default = default_1;
//# sourceMappingURL=ui.js.map