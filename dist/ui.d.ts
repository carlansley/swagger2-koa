import * as swagger from 'swagger2';
export default function (document: swagger.Document, pathRoot?: string, skipPaths?: Array<string>): (context: any, next: () => Promise<void>) => Promise<void>;
