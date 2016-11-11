// ui.ts
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const send = require('koa-send');
const swaggerUi = require('swagger-ui/index');
const ui_html_1 = require('./ui-html');
function default_1(document, pathRoot = '/', skipPaths = []) {
    const pathPrefix = pathRoot.endsWith('/') ? pathRoot : pathRoot + '/';
    const uiHtml = ui_html_1.default(document, pathPrefix);
    return (context, next) => __awaiter(this, void 0, void 0, function* () {
        if (context.path.startsWith(pathRoot)) {
            const skipPath = skipPaths.some(path => context.path.startsWith(path));
            if (context.path === pathRoot && context.method === 'GET') {
                context.type = 'text/html; charset=utf-8';
                context.body = uiHtml;
                context.status = 200;
                return;
            }
            else if (context.path === (pathPrefix + 'api-docs') && context.method === 'GET') {
                context.type = 'application/json; charset=utf-8';
                context.body = document;
                context.status = 200;
                return;
            }
            else if (!skipPath && context.method === 'GET') {
                const filePath = context.path.substring(pathRoot.length);
                yield send(context, filePath, { root: swaggerUi.dist });
                return;
            }
        }
        return next();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=ui.js.map