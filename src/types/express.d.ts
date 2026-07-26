// src/types/express.d.ts
export {};

declare global {
  namespace Express {
    interface Request {
      user: { userId: string; tokenId: string } | undefined;
      context: {
        requestId: string;
        url: string;
        method: string;
        query: any;
        params: any;
        body: any;
        ip: string | undefined;
        headers: any;
      };
    }
  }
}

declare module 'swagger-ui-express';
