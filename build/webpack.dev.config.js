const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
   mode: 'production',
   output: {
      filename: 'big-axios.js',
      chunkFilename: '[name].chunk.js',
      sourceMapFilename: 'big-axios.map'
   },
   devtool: 'source-map',
   plugins: [],
   optimization: {
      minimize: false
   }
});
