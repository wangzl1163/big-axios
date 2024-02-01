/*!
 * @license :big-axios - V1.0.0-beta.2 - 01/02/2024
 * https://github.com/wangzl1163/big-axios
 * Copyright (c) 2024 @wangzl1163; Licensed MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"));
	else if(typeof define === 'function' && define.amd)
		define("big-axios", ["axios"], factory);
	else if(typeof exports === 'object')
		exports["big-axios"] = factory(require("axios"));
	else
		root["BigAxios"] = factory(root["axios"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__300__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 300:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__300__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(300);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);
;// CONCATENATED MODULE: ./src/Exceptions.ts
// 系统错误
const errorMsgs = {
  400: {
    msg: '错误的请求'
  },
  401: {
    msg: '验证失败'
  },
  403: {
    msg: '服务器拒绝访问，请检查操作是否合法'
  },
  404: {
    msg: '请求地址不存在'
  },
  405: {
    msg: '您没有权限进行此操作'
  },
  406: {
    msg: '请您保证内容完整后提交'
  },
  409: {
    msg: '内容已存在'
  },
  429: {
    msg: '请求过于频繁，请稍后再试'
  },
  413: {
    msg: '请求实体过大'
  },
  414: {
    msg: '请求URI过长'
  },
  415: {
    msg: '不支持的媒体类型'
  },
  500: {
    msg: '服务器内部错误，请联系管理员'
  },
  501: {
    msg: ''
  },
  502: {
    msg: '网关错误，请检查您的网络'
  },
  503: {
    msg: '服务器维护中,请稍后重试'
  },
  504: {
    msg: '网关连接超时，请检查您的网络'
  }
};
class Exception {
  constructor(msgs) {
    this.serviceApiErrorMsgs = {
      '-9999': {
        msg: '发起网络请求失败'
      },
      ...msgs
    };
  }
  getExceptionMsg = function (errorCode, errorMsg) {
    const error = this.serviceApiErrorMsgs[errorCode + ''] ?? errorMsgs[errorCode + ''];
    if (error) {
      if (error.callback) {
        error.callback();
      }
      return errorMsg || error.msg;
    } else {
      if (errorMsg) {
        return errorMsg;
      } else {
        return '未知错误';
      }
    }
  };
}
/* harmony default export */ const Exceptions = (Exception);
;// CONCATENATED MODULE: ./src/index.ts


const queue401 = [];
let controller = new AbortController();
let postRequestList = [];
class BigAxios {
  http = external_axios_default().create();
  interceptorIds = [];
  exception = null;
  get axiosHttp() {
    return this.http;
  }
  get builtInInterceptorIds() {
    return this.interceptorIds;
  }

  /**
   * 创建 big-axios 实例
   * @param serviceApiErrorMsgs 服务端返回的错误码与错误信息
   * @param config 配置，可参考 axios 的配置项
   * @param {loginPath,successfulCodes} loginPath：登录页面路径，默认值：/login，用于未登录时跳转到登录页面；successfulCodes：业务 api 返回的成功状态码，默认值：[200, 0, '200']
   * @returns {BigAxiosInstance} big-axios 实例
   */
  create(serviceApiErrorMsgs, config, {
    loginPath = '/login',
    successfulCodes = [200, 0, '200']
  } = {}) {
    this.exception = new Exceptions(serviceApiErrorMsgs);
    this.url = '';
    this.data = {};
    this.http = external_axios_default().create(config);
    // 创建内置请求拦截器
    this.interceptorIds.push(this.http.interceptors.request.use(config => {
      // 设置请求可取消
      config.signal = controller.signal;
      return config;
    }, err => {
      return {
        ...err,
        message: this.exception.getExceptionMsg(-9999)
      };
    }));
    // 创建内置响应拦截器
    this.interceptorIds.push(this.http.interceptors.response.use(response => {
      if (successfulCodes.includes(response.data.code) || response.headers['content-type'] === 'application/octet-stream' || response.headers['content-type'] === 'image/Jpeg') {
        return Promise.resolve(response);
      } else {
        const errorData = {
          ...response,
          errorUrl: response.request.responseURL,
          message: this.exception.getExceptionMsg(response.data.code, response.data.errMsg || response.data.message || response.data.msg)
        };
        return Promise.reject(errorData);
      }
    }, err => {
      let errMsg = '';
      if (err.response) {
        if (err.response.status === 401) {
          queue401.push(err.response);
          // 多个接口同时请求，只提示一次登录过期
          if (queue401.length === 1) {
            errMsg = this.exception.getExceptionMsg(err.response.status, err.response.data.message || err.response.data.errMsg || '登录信息已过期');
            if (!location.href.includes(loginPath)) {
              location.href = loginPath;
            }
          }
        } else {
          errMsg = this.exception.getExceptionMsg(err.response.status, err.response.data.errMsg || err.response.data.message || '');
        }
      } else {
        errMsg = this.exception.getExceptionMsg(504, '');
      }
      const errorData = {
        ...err,
        config: err.config,
        data: err.response.data,
        errorUrl: err.config ? err.config.url : '',
        isCanceled: err.message === 'canceled',
        // 主动取消请求
        message: errMsg
      };
      return Promise.reject(errorData);
    }));
    return this;
  }
  interceptors = {
    request: {
      ...this.http.interceptors.request,
      use(onFulfilled,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRejected, options = {
        synchronous: false,
        runWhen: null
      }) {
        return this.http.interceptors.request.use(onFulfilled, onRejected, options);
      }
    },
    response: {
      ...this.http.interceptors.response,
      use(onFulfilled,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRejected, options = {
        synchronous: false,
        runWhen: null
      }) {
        return this.http.interceptors.response.use(onFulfilled, onRejected, options);
      }
    }
  };
  ajax(url, data = {}, {
    type = 'GET',
    options = {}
  } = {}) {
    this.url = url;
    this.type = type.toLocaleUpperCase().trim();
    this.data = this.type === 'GET' ? {
      params: data
    } : data;
    this.options = options;
    switch (this.type) {
      case 'GET':
        {
          return new Promise((resolve, reject) => {
            const config = Object.assign(this.data, this.options);
            this.http.get(this.url, config).then(response => {
              // 图片
              if (response instanceof Blob) {
                return resolve(response.data);
              }
              return resolve(response.data);
            }).catch(err => {
              this.log(err);
              return reject(err);
            });
          });
        }
      case 'POST':
        {
          return new Promise((resolve, reject) => {
            if (!this.url.includes('login')) {
              const dataJson = JSON.stringify(this.data);
              if (postRequestList.find(pd => pd.url === this.url && pd.data === dataJson)) {
                return reject({
                  message: '请不要提交重复的数据'
                });
              }
              postRequestList.push({
                url: this.url,
                data: dataJson
              });
            }
            this.http.post(this.url, this.data, this.options).then(response => {
              // blob类型
              if (response instanceof Blob) {
                return resolve(response.data);
              }
              return resolve(response.data);
            }).catch(err => {
              postRequestList = postRequestList.filter(pd => pd.url !== err.config.url || pd.data !== err.config.data);
              this.log(err);
              return reject(err);
            });
          });
        }
      case 'PUT':
        {
          return new Promise((resolve, reject) => {
            this.http.put(this.url, this.data, this.options).then(response => {
              return resolve(response.data);
            }).catch(err => {
              this.log(err);
              return reject(err);
            });
          });
        }
      case 'DELETE':
        {
          return new Promise((resolve, reject) => {
            this.http.delete(this.url, this.options).then(response => {
              return resolve(response.data);
            }).catch(err => {
              this.log(err);
              return reject(err);
            });
          });
        }
    }
  }
  get(url, data = {}, options = {}) {
    return this.ajax(url, data, {
      options: options
    });
  }
  post(url, data = {}, options = {}) {
    return this.ajax(url, data, {
      type: 'POST',
      options: options
    });
  }
  put(url, data = {}, options = {}) {
    return this.ajax(url, data, {
      type: 'PUT',
      options: options
    });
  }
  delete(url, options = {}) {
    return this.ajax(url, {}, {
      type: 'DELETE',
      options: options
    });
  }
  abort() {
    // 取消尚未完成的请求
    controller.abort();

    // 重置 controller 防止新请求无法发出
    controller = new AbortController();
  }
  clearPostData() {
    postRequestList = [];
  }
  log(err) {
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
/* harmony default export */ const src = (new BigAxios());
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=big-axios.map