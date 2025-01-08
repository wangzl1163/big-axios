/*
 * @Description: 类型声明文件
 * @Author:
 * @Date: 2024-01-12 13:45:16
 * @LastEditTime: 2025-01-07 16:33:40
 * @LastEditors: Please set LastEditors
 */
import type {
   AxiosRequestConfig,
   CreateAxiosDefaults,
   AxiosInterceptorManager,
   InternalAxiosRequestConfig,
   AxiosResponse,
   AxiosInstance
} from 'axios';

export type ExtraOptions = {
   loginPath?: string;
   successfulCodes?: (string | number)[];
   defaultResponseData?: any;
   responseDataObjectKey?: string;
};

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';

export type Response<D = any, M = string> = { code: number | string; data: D; message: M; msg?: string };

export type ResponsePromise<D = any, M = string, U = Response<D, M>> = Promise<U>;

export type ExceptionMsg = { msg: string; callback?: () => void };

export interface BigAxiosRequestConfig extends AxiosRequestConfig {
   defaultResponseData?: Record<string, any>;
   notRepeated?: boolean;
   notRepeatedMsg?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface InternalBigAxiosRequestConfig<D = any> extends InternalAxiosRequestConfig {
   defaultResponseData?: Record<string, any>;
}

export interface BigAxiosResponse<T = any, D = any> extends AxiosResponse {
   data: T;
   config: InternalBigAxiosRequestConfig<D>;
}

export interface InternalBigAxiosInstance extends AxiosInstance {
   interceptors: {
      request: AxiosInterceptorManager<InternalBigAxiosRequestConfig>;
      response: AxiosInterceptorManager<BigAxiosResponse>;
   };
}

export class BigAxios {
   create(serviceApiErrorMsgs?: Record<string, ExceptionMsg>, config?: CreateAxiosDefaults, extraOptions?: ExtraOptions): this;
   axiosCreate(config?: CreateAxiosDefaults<any>): AxiosInstance;
   interceptors: {
      request: AxiosInterceptorManager<InternalBigAxiosRequestConfig>;
      response: AxiosInterceptorManager<BigAxiosResponse>;
   };
   //  getUri(config?: AxiosRequestConfig): string;
   ajax<D = any, M = string, U = Response<D, M>>(
      url: string,
      data: Record<string, any>,
      { type, options }: { type?: Method; options?: BigAxiosRequestConfig }
   ): ResponsePromise<D, M, U>;
   get<D = any, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, any>,
      options?: BigAxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   delete<D = any, M = string, U = Response<D, M>>(url: string, options?: BigAxiosRequestConfig): ResponsePromise<D, M, U>;
   // head<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   // options<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: AxiosRequestConfig): ResponsePromise<D, M, U>;
   post<D = any, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, any>,
      options?: BigAxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   put<D = any, M = string, U = Response<D, M>>(
      url: string,
      data?: Record<string, any>,
      options?: BigAxiosRequestConfig
   ): ResponsePromise<D, M, U>;
   // patch<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: BigAxiosRequestConfig): ResponsePromise<D, M, U>;
   // postForm<D = any, M = string, U = Response<D, M>>(
   //    url: string,
   //    data:Record<string, any>,
   //    options: BigAxiosRequestConfig
   // ): ResponsePromise<D, M, U>;
   // putForm<D = any, M = string, U = Response<D, M>>(url: string, data:Record<string, any>, options: BigAxiosRequestConfig): ResponsePromise<D, M, U>;
   // patchForm<D = any, M = string, U = Response<D, M>>(
   //    url: string,
   //    data:Record<string, any>,
   //    options: BigAxiosRequestConfig
   // ): ResponsePromise<D, M, U>;
}

declare const ba: BigAxios;
export default ba;
