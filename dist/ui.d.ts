import type * as swagger from 'swagger2';
export default function (document: swagger.Document, pathRoot?: string, skipPaths?: string[]): (context: any, next: () => Promise<void>) => Promise<void>;
