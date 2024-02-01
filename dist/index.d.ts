import type { AxiosRequestConfig, CreateAxiosDefaults, AxiosInterceptorManager, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';

export type Response<D = unknown, M = string> = { code: number | string; data: D; message: M; msg?: string };

export type ResponsePromise<D = unknown, M = string, U = Response<D, M>> = Promise<U>;

export type ExceptionMsg = { msg: string; callback?: () => void };

export class BigAxios {
   create(
      serviceApiErrorMsgs: Record<string, ExceptionMsg>,
      config?: CreateAxiosDefaults,
      extraOptions?: { loginPath?: string; successfulCodes?: (string | number)[] }
   ): this;
   interceptors: {
      request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
      response: AxiosInterceptorManager<AxiosResponse>;
   };
   //  getUri(config?: AxiosRequestConfig): string;
   ajax<D = unknown, M = string, U = Response<D, M>>(
      url: string,
      data: Record<string, unknown>,
      { type, options }: { type?: Method; options?: AxiosRequestConfig }
   ): ResponsePromise<D, M, U>;
   get<D = unknown, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, unknown>,
      options?: AxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   delete<D = unknown, M = string, U = Response<D, M>>(url: string, options?: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // head<D = unknown, M = string, U = Response<D, M>>(url: string, data:Record<string, unknown>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // options<D = unknown, M = string, U = Response<D, M>>(url: string, data:Record<string, unknown>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   post<D = unknown, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, unknown>,
      options?: AxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   put<D = unknown, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, unknown>,
      options?: AxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   // patch<D = unknown, M = string, U = Response<D, M>>(url: string, data:Record<string, unknown>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // postForm<D = unknown, M = string, U = Response<D, M>>(
   //    url: string,
   //    data:Record<string, unknown>,
   //    options: AxiosRequestConfig
   // ): ResponsePromise<D, M, U>;
   // putForm<D = unknown, M = string, U = Response<D, M>>(url: string, data:Record<string, unknown>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // patchForm<D = unknown, M = string, U = Response<D, M>>(
   //    url: string,
   //    data:Record<string, unknown>,
   //    options: AxiosRequestConfig
   // ): ResponsePromise<D, M, U>;
}

declare const ba: BigAxios;
export default ba;
