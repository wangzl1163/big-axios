import type { AxiosRequestConfig, CreateAxiosDefaults, AxiosInterceptorManager, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';

export type Response<D = unknown, M = string> = { code: number | string; data: D; message: M; msg?: string };

export type ResponsePromise<D = unknown, M = string, U = Response<D, M>> = Promise<U>;

export class BigAxios {
   create(
      serviceApiErrorMsgs: Record<string, Exception>,
      config?: CreateAxiosDefaults,
      { loginPath = '/login', successfulCodes = [200, 0, '200'] }: { loginPath: string; successfulCodes: (string | number)[] } = {}
   ): this;
   interceptors: {
      request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
      response: AxiosInterceptorManager<AxiosResponse>;
   };
   //  getUri(config?: AxiosRequestConfig): string;
   ajax<D = unknown, M = string, U = Response<D, M>>(
      url: string,
      data: Record<string, unknown> = {},
      { type = 'GET', options = {} }: { type: Method; options: AxiosRequestConfig } = {}
   ): ResponsePromise<D, M, U>;
   get<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   delete<D = unknown, M = string, U = Response<D, M>>(url: string, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   // head<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   // options<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   post<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   put<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   // patch<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   // postForm<D = unknown, M = string, U = Response<D, M>>(
   //    url: string,
   //    data = {},
   //    options: AxiosRequestConfig = {}
   // ): ResponsePromise<D, M, U>;
   // putForm<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U>;
   // patchForm<D = unknown, M = string, U = Response<D, M>>(
   //    url: string,
   //    data = {},
   //    options: AxiosRequestConfig = {}
   // ): ResponsePromise<D, M, U>;
}

export type Exception = { msg: string; callback?: () => void };
