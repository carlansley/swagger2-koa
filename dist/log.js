// log.ts
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const winston = require('winston');
// set up logging
exports.winstonLogger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({ timestamp: true })],
    level: 'debug'
});
exports.logger = (context, next) => __awaiter(this, void 0, void 0, function* () {
    let startTime = Date.now();
    let { method, url } = context.request;
    yield next();
    let logHttp = {
        method,
        url,
        status: context.status
    };
    logHttp.time = (Date.now() - startTime) + 'ms';
    exports.winstonLogger.info('HTTP', logHttp);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.winstonLogger;
//# sourceMappingURL=log.js.map