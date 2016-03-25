import * as swagger from 'swagger2';
export default function (document: swagger.Document): (context: any, next: () => Promise<void>) => Promise<void>;
