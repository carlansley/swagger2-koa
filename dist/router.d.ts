export interface Request {
    query: any;
    body?: any;
    method: string;
    url: string;
    get?: (field: string) => string;
    header: {
        [name: string]: string;
    };
}
export interface Response {
    get?: (field: string) => string;
    set?: (field: string, value: string) => void;
    body?: any;
    status?: number;
    message?: string;
    header: {
        [name: string]: string;
    };
}
export interface Context extends Request, Response {
    originalUrl?: string;
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
