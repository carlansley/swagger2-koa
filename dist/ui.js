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
const swaggerUi = require('swagger-ui/index');
const koaStatic = require('koa-static');
const koaConvert = require('koa-convert');
const ui_html_1 = require('./ui-html');
const uiMiddleware = koaConvert(koaStatic(swaggerUi.dist, {}));
function default_1(document) {
    const uiHtml = ui_html_1.default(document);
    return (context, next) => __awaiter(this, void 0, void 0, function* () {
        if (context.path === '/' && context.method === 'GET') {
            context.type = 'text/html; charset=utf-8';
            context.body = uiHtml;
            context.status = 200;
            return;
        }
        else if (context.path === '/api-docs' && context.method === 'GET') {
            context.type = 'application/json; charset=utf-8';
            context.body = document;
            context.status = 200;
            return;
        }
        // outside of / and /api-docs, serve static SwaggerUI files
        yield uiMiddleware(context, next);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=ui.js.map