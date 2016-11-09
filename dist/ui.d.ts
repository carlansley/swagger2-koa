import * as swagger from 'swagger2';
export default function (document: swagger.Document, basePath?: string): (context: any, next: () => Promise<void>) => Promise<void>;
