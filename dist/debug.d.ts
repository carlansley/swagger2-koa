export default function (module: string): (context: any, next: () => Promise<void>) => Promise<void>;
