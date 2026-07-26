import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestLogContext = {
  requestId: string;
};

const requestContextStorage = new AsyncLocalStorage<RequestLogContext>();

export const runWithRequestContext = <T>(context: RequestLogContext, callback: () => T) =>
  requestContextStorage.run(context, callback);

export const getRequestLogContext = () => requestContextStorage.getStore();
