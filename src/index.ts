import axios from 'axios';
import Exceptions from './Exceptions';

import type { AxiosRequestConfig, AxiosInstance, CreateAxiosDefaults, AxiosInterceptorOptions } from 'axios';
import type { Method, ResponsePromise, Response, Exception } from './index';

const queue401 = [];
let controller = new AbortController();
let postRequestList: string[{ url: string; data: string }] = [];

class BigAxios {
   private http: AxiosInstance;
   private url: string;
   private type: string | undefined;
   private data: {
      [key: string]: Record<string, string>;
   };
   private options: AxiosRequestConfig;
   private interceptorIds: number[] = [];
   private exception: Exceptions = null;

   get axiosHttp(): AxiosInstance {
      return this.http;
   }

   get builtInInterceptorIds(): number[] {
      return this.interceptorIds;
   }

   /**
    * 创建 big-axios 实例
    * @param serviceApiErrorMsgs 服务端返回的错误码与错误信息
    * @param config 配置，可参考 axios 的配置项
    * @param {loginPath,successfulCodes} loginPath：登录页面路径，默认值：/login，用于未登录时跳转到登录页面；successfulCodes：业务 api 返回的成功状态码，默认值：[200, 0, '200']
    * @returns {AxiosInstance} big-axios 实例
    */
   create(
      serviceApiErrorMsgs: Record<string, Exception>,
      config?: CreateAxiosDefaults,
      { loginPath = '/login', successfulCodes = [200, 0, '200'] }: { loginPath: string; successfulCodes: (string | number)[] } = {}
   ): AxiosInstance {
      this.exception = new Exceptions(serviceApiErrorMsgs);

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
               if (
                  successfulCodes.includes(response.data.code) ||
                  response.headers['content-type'] === 'application/octet-stream' ||
                  response.headers['content-type'] === 'image/Jpeg'
               ) {
                  return Promise.resolve(response.data);
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

                        if (!location.href.includes(loginPath)) {
                           location.href = loginPath;
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

      return this;
   }

   interceptors = {
      request: {
         ...this.http.interceptors,
         use(
            onFulfilled?: ((value: V) => V | Promise<V>) | null,
            onRejected?: ((error: unknown) => unknown) | null,
            options: AxiosInterceptorOptions = { synchronous: false, runWhen: null }
         ): number {
            return this.http.interceptors.request.use(onFulfilled, onRejected, options);
         }
      },
      response: {
         ...this.http.interceptors,
         use(
            onFulfilled?: ((value: V) => V | Promise<V>) | null,
            onRejected?: ((error: unknown) => unknown) | null,
            options: AxiosInterceptorOptions = { synchronous: false, runWhen: null }
         ): number {
            return this.http.interceptors.response.use(onFulfilled, onRejected, options);
         }
      }
   };

   ajax<D = unknown, M = string, U = Response<D, M>>(
      url: string,
      data: Record<string, unknown> = {},
      { type = 'GET', options = {} }: { type: Method; options: AxiosRequestConfig } = {}
   ): ResponsePromise<D, M, U> {
      this.url = url;
      this.type = type.toLocaleUpperCase().trim();
      this.data = this.type === 'GET' ? { params: data } : data;
      this.options = options;

      switch (this.type) {
         case 'GET': {
            return new Promise((resolve, reject) => {
               const config = Object.assign(this.data, this.options);
               http
                  .get(this.url, config)
                  .then((response) => {
                     // 图片
                     if (response instanceof Blob) {
                        return resolve(response);
                     }

                     return resolve(response);
                  })
                  .catch((err) => {
                     this.log(err);
                     return reject(err);
                  });
            });
         }
         case 'POST': {
            return new Promise((resolve, reject) => {
               if (!this.url.includes('login')) {
                  const dataJson = JSON.stringify(this.data);
                  if (postRequestList.find((pd) => pd.url === this.url && pd === dataJson)) {
                     return reject({ message: '请不要提交重复的数据' });
                  }
                  postRequestList.push({ url: this.url, data: dataJson });
               }

               http
                  .post(this.url, this.data, this.options)
                  .then((response) => {
                     // blob类型
                     if (response instanceof Blob) {
                        return resolve(response);
                     }

                     return resolve(response);
                  })
                  .catch((err) => {
                     postRequestList = postRequestList.filter((pd) => pd.url !== err.config.url || pd.data !== err.config.data);

                     this.log(err);

                     return reject(err);
                  });
            });
         }
         case 'PUT': {
            return new Promise((resolve, reject) => {
               http
                  .put(this.url, this.data, this.options)
                  .then((response) => {
                     return resolve(response);
                  })
                  .catch((err) => {
                     this.log(err);
                     return reject(err);
                  });
            });
         }
         case 'DELETE': {
            return new Promise((resolve, reject) => {
               http
                  .delete(this.url, this.options)
                  .then((response) => {
                     return resolve(response);
                  })
                  .catch((err) => {
                     this.log(err);
                     return reject(err);
                  });
            });
         }
      }
   }

   get<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax<T, R>(url, data, { options: options });
   }

   post<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax(url, data, { type: 'POST', options: options });
   }

   put<D = unknown, M = string, U = Response<D, M>>(url: string, data = {}, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U> {
      return this.ajax(url, data, { type: 'PUT', options: options });
   }

   delete<D = unknown, M = string, U = Response<D, M>>(url: string, options: AxiosRequestConfig = {}): ResponsePromise<D, M, U> {
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
}

export default new BigAxios();