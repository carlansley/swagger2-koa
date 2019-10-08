export default function (module: string): ((context: any, next: () => void) => void) | ((context: any, next: () => Promise<void>) => Promise<void>);
