"use strict";
// ui.ts
Object.defineProperty(exports, "__esModule", { value: true });
const send = require("koa-send");
// tslint:disable-next-line:no-var-requires no-submodule-imports
const SWAGGER_UI_PATH = require('swagger-ui-dist/absolute-path.js')();
const ui_html_1 = require("./ui-html");
function default_1(document, pathRoot = '/', skipPaths = []) {
    const pathPrefix = pathRoot.endsWith('/') ? pathRoot : pathRoot + '/';
    const uiHtml = ui_html_1.default(document, pathPrefix);
    return async (context, next) => {
        if (context.path.startsWith(pathRoot)) {
            const skipPath = skipPaths.some((current) => context.path.startsWith(current));
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
                await send(context, filePath, { root: SWAGGER_UI_PATH });
                return;
            }
        }
        return next();
    };
}
exports.default = default_1;
//# sourceMappingURL=ui.js.map