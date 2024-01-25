const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
   mode: 'production',
   output: {
      filename: 'big-axios.min.js',
      chunkFilename: '[name].chunk.min.js',
      sourceMapFilename: 'big-axios.min.map'
   },
   devtool: 'source-map',
   optimization: {
      // https://webpack.js.org/configuration/optimization/#optimizationnamedmodules
      // This is because each module.id is incremented based on resolving order by default.
      // Meaning when the order of resolving is changed, the IDs will be changed as well.
      moduleIds: 'hashed',
      chunkIds: 'named'
   },
   plugins: []
});
