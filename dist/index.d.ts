import type { AxiosRequestConfig, CreateAxiosDefaults, AxiosInterceptorManager, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';

export type Response<D = any, M = string> = { code: number | string; data: D; message: M; msg?: string };

export type ResponsePromise<D = any, M = string, U = Response<D, M>> = Promise<U>;

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
   ajax<D = any, M = string, U = Response<D, M>>(
      url: string,
      data: Record<string, any>,
      { type, options }: { type?: Method; options?: AxiosRequestConfig }
   ): ResponsePromise<D, M, U>;
   get<D = any, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, any>,
      options?: AxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   delete<D = any, M = string, U = Response<D, M>>(url: string, options?: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // head<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // options<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   post<D = any, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, any>,
      options?: AxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   put<D = any, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, any>,
      options?: AxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   // patch<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // postForm<D = any, M = string, U = Response<D, M>>(
   //    url: string,
   //    data:Record<string, any>,
   //    options: AxiosRequestConfig
   // ): ResponsePromise<D, M, U>;
   // putForm<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // patchForm<D = any, M = string, U = Response<D, M>>(
   //    url: string,
   //    data:Record<string, any>,
   //    options: AxiosRequestConfig
   // ): ResponsePromise<D, M, U>;
}

declare const ba: BigAxios;
export default ba;
