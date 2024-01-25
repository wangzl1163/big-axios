/*
 * @Description:
 * @Author: 王占领
 * @Date: 2024-01-11 14:36:18
 * @LastEditTime: 2024-01-25 10:54:20
 * @LastEditors: 王占领
 */
const path = require('path');
const webpack = require('webpack');
const banner = require('../license.js');

module.exports = {
   context: path.resolve(__dirname, '../'),
   entry: {
      main: './src/index.ts'
   },
   output: {
      library: {
         name: {
            root: 'BigAxios',
            amd: 'big-axios',
            commonjs: 'big-axios'
         },
         type: 'umd',
         umdNamedDefine: true
      }
   },
   externals: {
      axios: 'axios'
   },
   resolve: {
      // 如果去掉'.js'，则会报Module not found: Error: Can't resolve '@babel/runtime/helpers/asyncToGenerator' in '...'错误
      extensions: ['.js', '.ts'],
      alias: {
         '@': path.resolve(__dirname, '../src')
      }
   },
   plugins: [new webpack.BannerPlugin(banner)],
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: 'babel-loader'
               }
            ]
         }
      ]
   }
};
