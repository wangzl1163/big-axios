import type { Exception } from './index';

// 系统错误
const errorMsgs: Record<string, Exception> = {
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
   private serviceApiErrorMsgs: Record<string, Exception>;
   constructor(msgs: Record<string, Exception>) {
      this.serviceApiErrorMsgs = {
         '-9999': {
            msg: process.env.NODE_ENV === 'development' ? '请求参数有问题，检查去吧，闷骚的程序猿！' : '操作失败，请稍后尝试'
         },
         ...msgs
      };
   }

   getExceptionMsg = function (errorCode: number | undefined, errorMsg?: string) {
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

export default Exception;
