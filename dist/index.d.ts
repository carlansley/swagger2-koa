import * as swagger from 'swagger2';
declare var _default: {
    ui: (document: swagger.Document) => (context: any, next: () => Promise<void>) => Promise<void>;
    validate: (document: swagger.Document) => (context: any, next: () => Promise<void>) => Promise<void>;
};
export default _default;
