// src/types/express.d.ts
export {};

declare global {
  namespace Express {
    interface Request {
      context: {
        requestId: string;
        url: string;
        method: string;
        query: any;
        params: any;
        body: any;
        ip: string | undefined;
      };
    }
  }
}
