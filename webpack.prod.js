const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const glob = require('glob');
const commonConfig = require('./webpack.common');

const productionConfig = merge([
  {
    output: {
      chunkFilename: './js/[name].[chunkhash:8].js',
      filename: './js/[name].[chunkhash:8].js'
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000 // in bytes
    },
    plugins: [new webpack.HashedModuleIdsPlugin()]
  },
  parts.setFreeVariable('process.env.NODE_ENV', 'production'),
  parts.clean(parts.paths.build),
  parts.attachRevision(),
  parts.minifyJavaScript(),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()]
  }),
  parts.purifyCSS({
    paths: glob.sync(`${parts.paths.src}/**/*.js`, { nodir: true })
  }),
  parts.extractImages({
    options: {
      name: './images/[name].[hash:8].[ext]',
      publicPath: '../' // override the default per loader definition
    }
  }),
  parts.generateSourceMaps({
    type: 'source-map'
  })
]);

module.exports = () => {
  return merge(commonConfig, productionConfig);
};
