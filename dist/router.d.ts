export interface Request {
    query: any;
    body?: any;
    method: string;
}
export interface Response {
    set?: (field: any, val: any) => void;
    body?: any;
    status?: number;
}
export interface Context extends Request, Response {
    params: {
        [name: string]: string;
    };
    request: Request;
    response: Response;
}
export declare type Middleware = (context: Context, next: Function) => any;
export interface Router {
    get: (path: string, middleware: Middleware) => Router;
    head: (path: string, middleware: Middleware) => Router;
    put: (path: string, middleware: Middleware) => Router;
    post: (path: string, middleware: Middleware) => Router;
    del: (path: string, middleware: Middleware) => Router;
    app: () => any;
}
export default function (swaggerDocument: any): Router;
