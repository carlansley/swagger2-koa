export interface Request {
    query: any;
    body?: any;
    method: string;
    url: string;
    ip: string;
    ips: string[];
    subdomains: string[];
    origin: string;
    host: string;
    length: number;
    originalUrl: string;
    href: string;
    querystring: string;
    search: string;
    hostname: string;
    type: string;
    charset?: string;
    fresh: boolean;
    stale: boolean;
    idempotent: boolean;
    get: (field: string) => string;
    header: {
        [name: string]: string;
    };
    headers: {
        [name: string]: string;
    };
}
export interface Response {
    get: (field: string) => string;
    set: (field: string, value: string) => void;
    body?: any;
    status?: number;
    message?: string;
    redirect: (url: string, alt?: string) => void;
    header: {
        [name: string]: string;
    };
}
export interface Context extends Request, Response {
    params: {
        [name: string]: string;
    };
    request: Request;
    response: Response;
}
export declare type Middleware = (context: Context, next: () => void) => any;
export interface Router {
    get: (path: string, ...middleware: Middleware[]) => Router;
    head: (path: string, ...middleware: Middleware[]) => Router;
    put: (path: string, ...middleware: Middleware[]) => Router;
    post: (path: string, ...middleware: Middleware[]) => Router;
    del: (path: string, ...middleware: Middleware[]) => Router;
    patch: (path: string, ...middleware: Middleware[]) => Router;
    app: () => any;
}
export default function (swaggerDocument: unknown): Router;
