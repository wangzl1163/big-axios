<h1 align="center">
<img src="https://img.shields.io/badge/BA-big--axios-42b883">
</h1>

# big-axios <a href='https://www.npmjs.com/package/big-axios'>![npm](https://img.shields.io/npm/v/big-axios?style=for-the-badge&color=42b883)</a>

一个基于 axios 的网络请求库。big-axios 内置了常见的请求拦截器、响应拦截器以及支持请求错误的日志输出。

big-axios 是通过未经转译的 ts 文件进行发布的，需要与用户项目本身一同编译构建。

#### 特性

1、内置常见的请求拦截器、响应拦截器。
2、支持请求错误的日志在浏览器控制台输出。
3、对文件流进行封装。

#### 用法

0、环境支持
|<img src="https://cdn.jsdelivr.net/npm/@browser-logos/edge/edge_32x32.png" alt="Edge">|![Firefox](https://cdn.jsdelivr.net/npm/@browser-logos/firefox/firefox_32x32.png)|![Chrome](https://cdn.jsdelivr.net/npm/@browser-logos/chrome/chrome_32x32.png)|![Safari](https://cdn.jsdelivr.net/npm/@browser-logos/safari/safari_32x32.png)
|:-------:|:----------:|:---------:|:---------:|
|Edge ≥ 79|Firefox ≥ 78|Chrome ≥ 64|Safari ≥ 12|

1、安装

```bash
npm install big-axios
```

2、快速上手

```javascript
import request from "big-axios";

request.$get("/api/user").then(res => {})
```

2.1 概念
>
>
