// src/types/express.d.ts
export {};

declare global {
  namespace Express {
    interface Request {
      user: { id: number; username: string } | undefined;
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
