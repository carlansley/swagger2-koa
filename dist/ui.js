"use strict";
// ui.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_send_1 = __importDefault(require("koa-send"));
const ui_html_1 = __importDefault(require("./ui-html"));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires
const SWAGGER_UI_PATH = require('swagger-ui-dist/absolute-path.js')();
function default_1(document, pathRoot = '/', skipPaths = []
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    const pathPrefix = pathRoot.endsWith('/') ? pathRoot : `${pathRoot}/`;
    const uiHtml = (0, ui_html_1.default)(document, pathPrefix);
    return async (context, next) => {
        if (context.path.startsWith(pathRoot)) {
            const skipPath = skipPaths.some((current) => context.path.startsWith(current));
            if (context.path === pathRoot && context.method === 'GET') {
                context.type = 'text/html; charset=utf-8';
                context.body = uiHtml;
                context.status = 200;
                return;
            }
            else if (context.path === `${pathPrefix}api-docs` && context.method === 'GET') {
                context.type = 'application/json; charset=utf-8';
                context.body = document;
                context.status = 200;
                return;
            }
            else if (!skipPath && context.method === 'GET') {
                const filePath = context.path.substring(pathRoot.length);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                await (0, koa_send_1.default)(context, filePath, { root: SWAGGER_UI_PATH });
                return;
            }
        }
        return next();
    };
}
exports.default = default_1;
//# sourceMappingURL=ui.js.map