/// <reference types="koa" />
import * as winston from 'winston';
import { Context } from 'koa';
export declare const winstonLogger: winston.LoggerInstance;
export declare let logger: (context: Context, next: Function) => Promise<void>;
export default winstonLogger;
