import axios from 'axios';
import Exceptions from './Exceptions';

import type {
   AxiosRequestConfig,
   AxiosInstance,
   CreateAxiosDefaults,
   AxiosInterceptorOptions,
   AxiosInterceptorManager,
   InternalAxiosRequestConfig,
   AxiosResponse
} from 'axios';
import type {
   Method,
   ResponsePromise,
   Response,
   ExceptionMsg,
   BigAxios as BigAxiosInstance,
   ExtraOptions,
   BigAxiosRequestConfig,
   BigAxiosResponse,
   InternalBigAxiosInstance,
   InternalBigAxiosRequestConfig
} from '../types/index';

const queue401 = [];
let controller = new AbortController();
let postRequestList: { url: string; data: string }[] = [];

class BigAxios {
   private http: InternalBigAxiosInstance;
   private url: string;
   private type: string | undefined;
   private data: Record<string, any>;
   private options: BigAxiosRequestConfig;
   private interceptorIds: number[] = [];
   private exception: Exceptions = null;

   constructor() {
      this.create();
   }

   /**
    * 创建 big-axios 实例
    * @param serviceApiErrorMsgs 服务端返回的错误码与错误信息
    * @param config 配置，可参考 axios 的配置项
    * @param extraOptions loginPath：登录页面路径，默认值：/login，用于未登录时跳转到登录页面；
    *                     successfulCodes：业务 api 返回的成功状态码，默认值：[200, 0, '200']；
    *                     responseDataObjectKey：请求响应数据（response.data）中的值为请求结果的属性的名称，默认值：data；
    *                     defaultResponseData：用于指定请求返回结果的默认值，结合 responseDataObjectKey 使用；
    * @returns {BigAxiosInstance} big-axios 实例
    */
   create(serviceApiErrorMsgs?: Record<string, ExceptionMsg>, config?: CreateAxiosDefaults, extraOptions?: ExtraOptions): BigAxiosInstance {
      this.exception = new Exceptions(serviceApiErrorMsgs);

      const myOptions = { loginPath: '/login', successfulCodes: [200, 0, '200'], responseDataObjectKey: 'data', ...extraOptions };

      this.url = '';
      this.data = {};

      this.http = axios.create(config);

      // 创建内置请求拦截器
      this.interceptorIds.push(
         this.http.interceptors.request.use(
            (config) => {
               // 设置请求可取消
               config.signal = controller.signal;

               return config;
            },
            (err) => {
               return {
                  ...err,
                  message: this.exception.getExceptionMsg(-9999)
               };
            }
         )
      );

      // 创建内置响应拦截器
      this.interceptorIds.push(
         this.http.interceptors.response.use(
            (response) => {
               if (myOptions.successfulCodes.includes(response.data.code) || response.request.responseType === 'blob') {
                  return Promise.resolve(response);
               } else {
                  const errorData = {
                     ...response,
                     errorUrl: response.request.responseURL,
                     message: this.exception.getExceptionMsg(
                        response.data.code,
                        response.data.errMsg || response.data.message || response.data.msg
                     )
                  };

                  return Promise.reject(errorData);
               }
            },
            (err) => {
               let errMsg = '';
               if (err.response) {
                  if (err.response.status === 401) {
                     queue401.push(err.response);
                     // 多个接口同时请求，只提示一次登录过期
                     if (queue401.length === 1) {
                        errMsg = this.exception.getExceptionMsg(
                           err.response.status,
                           err.response.data.message || err.response.data.errMsg || '登录信息已过期'
                        );

                        if (!location.href.includes(myOptions.loginPath)) {
                           location.href = myOptions.loginPath;
                        }
                     }
                  } else {
                     errMsg = this.exception.getExceptionMsg(
                        err.response.status,
                        err.response.data.errMsg || err.response.data.message || ''
                     );
                  }
               } else {
                  errMsg = this.exception.getExceptionMsg(504, '');
               }

               const errorData = {
                  ...err,
                  config: err.config,
                  data: err.response.data,
                  errorUrl: err.config ? err.config.url : '',
                  isCanceled: err.message === 'canceled', // 主动取消请求
                  message: errMsg
               };

               return Promise.reject(errorData);
            }
         )
      );
      this.interceptorIds.push(
         this.http.interceptors.response.use(
            (response) => {
               if (
                  myOptions.successfulCodes.includes(response.data.code) &&
                  response.data[myOptions.responseDataObjectKey] === null &&
                  Object.hasOwn(myOptions, 'defaultResponseData')
               ) {
                  return Promise.resolve({
                     ...response,
                     data: {
                        ...response.data,
                        [myOptions.responseDataObjectKey]:
                           response.config.defaultResponseData == undefined
                              ? myOptions.defaultResponseData
                              : response.config.defaultResponseData
                     }
                  });
               } else {
                  return response;
               }
            },
            (err) => Promise.reject(err)
         )
      );

      this.interceptors = {
         request: {
            ...this.http.interceptors.request,
            use: (
               onFulfilled?:
                  | ((value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>)
                  | null,
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               onRejected?: ((error: any) => any) | null,
               options: AxiosInterceptorOptions = { synchronous: false, runWhen: null }
            ): number => {
               return this.http.interceptors.request.use(onFulfilled, onRejected, options);
            }
         },
         response: {
            ...this.http.interceptors.response,
            use: (
               onFulfilled?: ((value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>) | null,
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               onRejected?: ((error: any) => any) | null,
               options: AxiosInterceptorOptions = { synchronous: false, runWhen: null }
            ): number => {
               return this.http.interceptors.response.use(onFulfilled, onRejected, options);
            }
         }
      };

      return this;
   }

   interceptors: {
      request: AxiosInterceptorManager<InternalBigAxiosRequestConfig>;
      response: AxiosInterceptorManager<BigAxiosResponse>;
   };

   ajax<D = any, M = string, U = Response<D | Blob, M>>(
      url: string,
      data: Record<string, any> = {},
      { type = 'GET', options = {} }: { type?: Method; options?: BigAxiosRequestConfig } = {}
   ): ResponsePromise<D, M, U> {
      this.url = url;
      this.type = type.toLocaleUpperCase().trim();
      this.data = this.type === 'GET' ? { params: data } : data;
      this.options = options;

      switch (this.type) {
         case 'GET': {
            return new Promise<U>((resolve, reject) => {
               const config = Object.assign(this.data, this.options);
               this.http
                  .get<U, AxiosResponse<U>>(this.url, config)
                  .then((response) => {
                     if (response instanceof Blob) {
                        return resolve(response.data || response);
                     }

                     return resolve(response.data);
                  })
                  .catch((err) => {
                     this.log(err);
                     return reject(err);
                  });
            });
         }
         case 'POST': {
            return new Promise<U>((resolve, reject) => {
               if (this.options.notRepeated) {
                  const dataJson = JSON.stringify(this.data);
                  if (postRequestList.find((pd) => pd.url === this.url && pd.data === dataJson)) {
                     return reject({ message: this.options.notRepeatedMsg || '请不要提交重复的数据' });
                  }
                  postRequestList.push({ url: this.url, data: dataJson });
               }

               this.http
                  .post<U, AxiosResponse<U>>(this.url, this.data, this.options)
                  .then((response) => {
                     if (response instanceof Blob) {
                        return resolve(response.data || response);
                     }

                     return resolve(response.data);
                  })
                  .catch((err) => {
                     postRequestList = postRequestList.filter((pd) => pd.url !== err.config.url || pd.data !== err.config.data);

                     this.log(err);

                     return reject(err);
                  });
            });
         }
         case 'PUT': {
            return new Promise<U>((resolve, reject) => {
               this.http
                  .put<U, AxiosResponse<U>>(this.url, this.data, this.options)
                  .then((response) => {
                     return resolve(response.data);
                  })
                  .catch((err) => {
                     this.log(err);
                     return reject(err);
                  });
            });
         }
         case 'DELETE': {
            return new Promise<U>((resolve, reject) => {
               this.http
                  .delete<U, AxiosResponse<U>>(this.url, this.options)
                  .then((response) => {
                     return resolve(response.data);
                  })
                  .catch((err) => {
                     this.log(err);
                     return reject(err);
                  });
            });
         }
      }
   }

   get<D = any, M = string, U = Response<D, M>>(url: string, data = {}, options: BigAxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax(url, data, { options: options });
   }

   post<D = any, M = string, U = Response<D, M>>(url: string, data = {}, options: BigAxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax(url, data, { type: 'POST', options: options });
   }

   put<D = any, M = string, U = Response<D, M>>(url: string, data = {}, options: BigAxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax(url, data, { type: 'PUT', options: options });
   }

   delete<D = any, M = string, U = Response<D, M>>(url: string, options: BigAxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax(url, {}, { type: 'DELETE', options: options });
   }

   abort(): void {
      // 取消尚未完成的请求
      controller.abort();

      // 重置 controller 防止新请求无法发出
      controller = new AbortController();
   }

   clearPostData(): void {
      postRequestList = [];
   }

   private log(err: { message: string; errorUrl: string; config: AxiosRequestConfig; data: Record<string, string> }) {
      if (err.message === 'canceled') {
         return console.warn('尚未完成的 http 请求已取消: ', err.message);
      }

      console.group('%c http 请求错误：', 'color:red;');

      const keys = Object.keys(err);
      if (keys.length > 0) {
         console.log('%c地址：', 'font-family:PingFang SC, Microsoft YaHei;', err.errorUrl);
         console.log('%c方式：', 'font-family:PingFang SC, Microsoft YaHei;', err.config.method);
         console.log('%c参数：', 'font-family:PingFang SC, Microsoft YaHei;', err.config.params);
         console.log('%c结果：', 'font-family:PingFang SC, Microsoft YaHei;', err.data);
         console.log('%c详细信息：', 'font-family:PingFang SC, Microsoft YaHei;', err);
      } else {
         console.log(`%c error:`, 'font-family:PingFang SC, Microsoft YaHei;', err);
      }
      console.groupEnd();
   }

   get builtInInterceptorIds(): number[] {
      return this.interceptorIds;
   }

   axiosCreate(config?: CreateAxiosDefaults<any>): AxiosInstance {
      return axios.create(config);
   }
}

export default new BigAxios();
