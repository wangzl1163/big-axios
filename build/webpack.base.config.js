const path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
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
   plugins: [new SmartBannerPlugin(banner)],
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
